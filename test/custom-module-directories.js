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
var fs = require("fs");

testUtils.describe("resolving components being stored in custom module directories", function () {
  var config = testUtils.config,
    testBowerPluginError = testUtils.testBowerPluginError,
    testBowerPlugin = testUtils.testBowerPlugin;

  it("should not resolve a component stored in 'custom_components' if no custom configuration is given", function (done) {
    testBowerPluginError(config("custom-module-multiple-js"), done);
  });

  it("should resolve a component stored in 'custom_components' dir if it's specified in 'resolve.modulesDirectories'", function (done) {
    var cfg = config("custom-module-multiple-js"),
      expectations = {
        js:  ['custom-module-multiple-js-0', 'custom-module-multiple-js-1'],
        css: []
      };

    cfg.resolve = {
      modulesDirectories: ["custom_components", "bower_components"]
    };

    testBowerPlugin(cfg, expectations, done);
  });

  it("should resolve a component stored in 'custom_components' dir, if the 'cfg.resolve' is undefined", function (done) {
    var cfg = config("custom-module-multiple-js"),
      expectations = {
        js:  ['custom-module-multiple-js-0', 'custom-module-multiple-js-1'],
        css: []
      };

    cfg.resolve = undefined;

    cfg.plugins = [
      new BowerWebpackPlugin({
        modulesDirectories: ["custom_components", "bower_components"]
      })
    ];

    testBowerPlugin(cfg, expectations, done);
  });

  it("should resolve a component stored in 'custom_components' dir, if the 'cfg.resolve.moduleDirectories' is undefined", function (done) {
    var cfg = config("custom-module-multiple-js"),
      expectations = {
        js:  ['custom-module-multiple-js-0', 'custom-module-multiple-js-1'],
        css: []
      };

    cfg.resolve = {
      modulesDirectories: undefined
    };

    cfg.plugins = [
      new BowerWebpackPlugin({
        modulesDirectories: ["custom_components", "bower_components"]
      })
    ];

    testBowerPlugin(cfg, expectations, done);
  });

  it("should resolve a component stored in 'custom_components' dir if it's specified in 'modulesDirectories'", function (done) {
    var cfg = config("custom-module-multiple-js"),
      expectations = {
        js:  ['custom-module-multiple-js-0', 'custom-module-multiple-js-1'],
        css: []
      };

    cfg.plugins = [
      new BowerWebpackPlugin({
        modulesDirectories: ["custom_components", "bower_components"]
      })
    ];

    testBowerPlugin(cfg, expectations, done);
  });


  it("should resolve a component stored in 'custom_components' dir, if specified in a .bowerrc file", function (done) {
    var cfg = config("custom-module-multiple-js"),
      expectations = {
        js:  ['custom-module-multiple-js-0', 'custom-module-multiple-js-1'],
        css: []
      };

    cfg.resolve = {
      modulesDirectories: undefined
    };

    // Generate a .bowerrc file pointing to `custom_components`
    var bowerRcFilename = ".bowerrc",
      bowerRc = {
      "directory": "custom_components"
    }
    fs.writeFileSync(bowerRcFilename, JSON.stringify(bowerRc));

    cfg.plugins = [
      new BowerWebpackPlugin()
    ];

    testBowerPlugin(cfg, expectations, done);

    // Clean-up.
    fs.unlinkSync(bowerRcFilename);
  });

});
