/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Lukasz Piepiora <lpiepiora@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

"use strict";

var Q = require('q');

/**
 * Resolves a bower manifest file, in the given loop paths, using specified manifest file names
 * @param webpackPlugin - the webpack plugin instance
 * @param {string[]} lookupPaths - an array of paths, which are used to lookup the manifest file.
 *                                 The paths are tried in order, as specified in the array.
 * @param {string[]} manifestFiles - an array of possible names of manifest files.
 *                                 The files are tried in the order as they are specified in the array.
 * @returns {ManifestResolver}
 * @constructor
 */
function ManifestResolver(webpackPlugin, lookupPaths, manifestFiles) {
  if (!(this instanceof ManifestResolver)) {
    return new ManifestResolver(webpackPlugin, lookupPaths, manifestFiles);
  }

  this.webpackPlugin = webpackPlugin;
  this.lookupPaths = lookupPaths;
  this.manifestFiles = manifestFiles;

}

module.exports = ManifestResolver;

/**
 * Finds the first existing manifest file.
 * @param request - the webpack request object
 * @param {Logger} logger - the logger used to log debug information
 * @returns {Promise} a promise, which when resolves contains a path to the resolved manifest file.
 *                    when the promise is rejected it contains an {@link Error}
 */
ManifestResolver.prototype.resolve = function (request, logger) {
  var webpackPlugin = this.webpackPlugin,
    fsStat = Q.nbind(webpackPlugin.fileSystem.stat, webpackPlugin.fileSystem);

  function resolveBowerManifest(startBase, lookupPaths, moduleName, manifestFiles) {
    var deferred = Q.defer();

    (function loopDirectoryHierarchy(base) {

      // create a copy
      var remainingLookupPaths = lookupPaths.slice(0);

      (function loopLookupPaths() {
        var newBase, lookupPath, possibleModulePath, remainingManifestFiles;

        if (remainingLookupPaths.length === 0) {
          newBase = webpackPlugin.normalize(base + "/..");
          if (newBase === "" || newBase === base) {
            logger.log("No more paths left to try");
            return deferred.reject(new Error(
              "No bower component: " + base + "/[" + lookupPaths.join(",") + "]/" + moduleName + "/[" + manifestFiles.join(",") + "]"
            ));
          }

          return loopDirectoryHierarchy(newBase);
        }

        lookupPath = remainingLookupPaths.shift();
        possibleModulePath = webpackPlugin.join(webpackPlugin.join(base, lookupPath), moduleName);
        // create a copy
        remainingManifestFiles = manifestFiles.slice(0);

        (function loopManifestFiles() {
          var manifestFile, filePath;

          if (remainingManifestFiles.length === 0) {
            logger.log("No more files left to try.");
            return loopLookupPaths();
          }

          manifestFile = remainingManifestFiles.shift();
          filePath = webpackPlugin.join(possibleModulePath, manifestFile);

          logger.log("Trying path: " + filePath);
          fsStat(filePath).then(
            function (stat) {
              if (!stat.isDirectory()) {
                return deferred.resolve(filePath);
              }

              logger.log(filePath + " is a directory, trying next.");
              return loopManifestFiles();
            },
            function () {
              logger.log(filePath + " doesn't exists, trying next.");
              return loopManifestFiles();
            }
          );
        }());

      }());

    }(startBase));

    return deferred.promise;
  }

  return resolveBowerManifest(request.path, this.lookupPaths, request.request, this.manifestFiles);

};




