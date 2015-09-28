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

var path = require("path");
var Logger = require("./bower-plugin-logger");
var ManifestResolver = require("./bower-plugin-manifest-resolver.js");
var MainResolver = require("./bower-plugin-main-resolver.js");
var pluginUtils = require("./bower-plugin-utils");

/**
 * Configuration for the plugin
 * @typedef {Object} BowerWebpackPlugin~Options
 * @property {string|string[]} [modulesDirectories=["bower_components"]] - the directories, where the plugin searches for bower components
 * @property {string|string[]} [manifestFiles=["bower.json"]] - the list of bower manifest files,
 *                                                              the plugin will try, when looking for a manifest file
 * @property {RegExp|RegExp[]} [includes=[RegExp(".*")]] - the list of regular expressions, used to check if a file referenced
 *                                                         by the manifest file should be included.
 * @property {RegExp|RegExp[]} [excludes=[]] - the list of regular expressions, used to check if a file referenced by the manifest
 *                                             should be excluded by the plugin.
 * @property {boolean} [searchResolveModulesDirectories=true] - whether to search through resolve.modulesDirectories for bower components
 */
/**
 * Creates new Bower Webpack Plugin
 * @param {BowerWebpackPlugin~Options} [options] - options, containing a configuration for the plugin
 * @returns {BowerWebpackPlugin}
 * @constructor
 */
function BowerWebpackPlugin(options) {
  var opt = options || {};
  this.modulesDirectories = opt.modulesDirectories ? [].concat(opt.modulesDirectories) : [pluginUtils.resolveComponentsDirectory()];
  this.manifestFiles = opt.manifestFiles ? [].concat(opt.manifestFiles) : ["bower.json"];
  this.includes = opt.includes ? [].concat(opt.includes) : [/.*/];
  this.excludes = opt.excludes ? [].concat(opt.excludes) : [];
  this.searchResolveModulesDirectories = opt.searchResolveModulesDirectories === false ? false : true;
}

module.exports = BowerWebpackPlugin;

BowerWebpackPlugin.prototype.apply = function (compiler) {
  var configModulesDirectories = this.searchResolveModulesDirectories ? compiler.options.resolve.modulesDirectories : [],
    modulesDirectories = pluginUtils.unique(this.modulesDirectories.concat(configModulesDirectories)),
    manifestFiles = this.manifestFiles,
    includes = this.includes,
    excludes = this.excludes,
    manifestMainFiles = {};

    compiler.resolvers.normal.plugin('module', function (request, finalCallback) {

    var logger = new Logger(),
      manifestResolver = new ManifestResolver(this, modulesDirectories, manifestFiles),
      mainResolver = new MainResolver(this, includes, excludes);

    // the plugin does not support modules with slashes - no nesting here...
    // e.g. require('some-module/whatever'); will not be resolved
    if (request.request.indexOf('/') >= 0) {
      return finalCallback();
    }

    manifestResolver.resolve(request, logger).
      then(mainResolver.resolve.bind(mainResolver)).
      then(function (resolveResult) {

        manifestMainFiles[resolveResult.manifestFile] = resolveResult.mainFiles;

        logger.writeOut(finalCallback);
        return finalCallback(null, {
          path:     resolveResult.manifestFile,
          query:    request.query,
          resolved: true
        });

      })
      .catch(function () {
        logger.writeOut(finalCallback);
        finalCallback();
      });

  });


  compiler.plugin("normal-module-factory", function (nmf) {
    nmf.plugin("after-resolve", function (data, callback) {

      if (!manifestMainFiles.hasOwnProperty(data.resource)) {
        return callback(null, data);
      }

      function componentName(manifestFilePath) {
        var dirname = path.dirname(manifestFilePath),
          indexOfLastSeparator = dirname.lastIndexOf(path.sep);
        return dirname.substring(indexOfLastSeparator + 1);
      }

      var bowerComponentName = componentName(data.resource),
        bowerLoaderPath = path.join(__dirname, "bower-loader"),
        bowerLoaderParams = JSON.stringify({include: manifestMainFiles[data.resource]});

      data.loaders = [bowerLoaderPath + "?" + bowerLoaderParams];
      data.request = bowerComponentName + " (bower component)";
      data.userRequest = bowerComponentName + " (bower component)";

      return callback(null, data);

    });
  });

};
