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
var testUtils = require("./test-utils");
var BowerWebpackPlugin = require("../");

testUtils.describe("searching for components 'resolve.modulesDirectories'", function () {
  var config = testUtils.config,
    testBowerPluginError = testUtils.testBowerPluginError,
    testBowerPlugin = testUtils.testBowerPlugin;

  it("should occur by default", function (done) {
    var cfg = config("custom-module-single-string"),
      expectations = {
        js:  ['custom-module-single-string-bower'],
        css: []
      };

    cfg.resolve = {
      modulesDirectories: ["custom_components", "bower_components"]
    };

    testBowerPlugin(cfg, expectations, done);
  });

  it("should not occur when 'searchResolveModulesDirectories' is false", function (done) {
    var cfg = config("custom-module-single-string"),
      expectations = {
        js:  ['custom-module-single-string-node'],
        css: []
      };

    cfg.resolve = {
      modulesDirectories: ["custom_components", "bower_components"]
    };

    cfg.plugins = [
      new BowerWebpackPlugin({
          searchResolveModulesDirectories: false
      })
    ];

    testBowerPlugin(cfg, expectations, done);
  });

  it("should occur when 'searchResolveModulesDirectories' is true", function (done) {
    var cfg = config("custom-module-single-string"),
      expectations = {
        js:  ['custom-module-single-string-bower'],
        css: []
      };

    cfg.resolve = {
      modulesDirectories: ["custom_components", "bower_components"]
    };

    cfg.plugins = [
      new BowerWebpackPlugin({
          searchResolveModulesDirectories: true
      })
    ]

    testBowerPlugin(cfg, expectations, done);
  });
});
