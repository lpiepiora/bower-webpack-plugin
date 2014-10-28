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

var Q = require("q");
var path = require("path");

/**
 * The object, returned when the main files are resolved within a manifest file.
 * @typedef {Object} MainResolver~ResolveResult
 * @property {string} manifestFile - a manifest file, which was resolved
 * @property {string[]} mainFiles - the list of resolved main files, which were found in the manifestFile
 */

/**
 * Resolves main files from a bower manifest file
 * @param webpackPlugin
 * @param {RegExp[]} includes - the list of patterns for matching files to include
 * @param {RegExp[]} excludes - the list of patterns for matching files to exclude
 * @returns {MainResolver}
 * @constructor
 */
function MainResolver(webpackPlugin, includes, excludes) {
  if (!(this instanceof MainResolver)) {
    return new MainResolver(webpackPlugin, includes, excludes);
  }
  this.webpackPlugin = webpackPlugin;
  this.includes = includes;
  this.excludes = excludes;
}

module.exports = MainResolver;

/**
 * @param manifestFile
 * @lends {MainResolver.resolve}
 * @returns {Promise} a promise, which when resolved successfully, will contain a {@link MainResolver~ResolveResult} or will contain an {@link Error} if rejected.
 */
MainResolver.prototype.resolve = function (manifestFile) {
  var basedir = path.dirname(manifestFile),
    includes = this.includes,
    excludes = this.excludes,
    fileSystem = this.webpackPlugin.fileSystem,
    readFile = Q.nbind(fileSystem.readFile, fileSystem);

  function includeMatching(file) {
    var filePath = path.normalize(path.join(basedir, file));
    return includes.some(function (include) {
      return include.test(filePath);
    });
  }

  function excludeMatching(file) {
    var filePath = path.normalize(path.join(basedir, file));
    return excludes.length === 0 || excludes.every(function (exclude) { return !exclude.test(filePath); });
  }

  return readFile(manifestFile).
    then(JSON.parse).
    then(function (jsonManifestFile) {
      var mainFiles = Array.isArray(jsonManifestFile.main) ? jsonManifestFile.main : [jsonManifestFile.main];
      return {
        manifestFile: manifestFile,
        mainFiles:    mainFiles.filter(includeMatching).filter(excludeMatching)
      };
    });


};