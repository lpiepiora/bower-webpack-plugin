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

var testUtils = require('./test-utils');

var BowerWebpackPlugin = require("../");

testUtils.describe("resolving of modules, with exclusion of unwanted files", function () {
  var config = testUtils.config;
  var testBowerPlugin = testUtils.testBowerPlugin;

  it("should exclude unwanted files based on the regular expressions (string test)", function (done) {
    var expectations = {
      js:  ['module-with-exclusions-1'],
      css: []
    };

    var cfg = config('module-with-exclusions');
    cfg.plugins = [
      new BowerWebpackPlugin({excludes: /.*0\.js/})
    ];

    testBowerPlugin(cfg, expectations, done);
  });

  it("should exclude unwanted files based on the regular expressions (array test)", function (done) {
    var expectations = {
      js:  ['module-with-exclusions-1'],
      css: []
    };

    var cfg = config('module-with-exclusions');
    cfg.plugins = [
      new BowerWebpackPlugin({excludes: [/.*0\.js/]})
    ];

    testBowerPlugin(cfg, expectations, done);
  });

  it("should include all files if a regular expression doesn't match", function (done) {
    var expectations = {
      js:  ['module-with-exclusions-0', 'module-with-exclusions-1'],
      css: []
    };

    var cfg = config('module-with-exclusions');
    cfg.plugins = [
      new BowerWebpackPlugin({excludes: [/.*\.css/]})
    ];

    testBowerPlugin(cfg, expectations, done);
  });

  it("should include, a file which is unmatched by excludes", function (done) {
    var expectations = {
      js:  ['module-with-exclusions-0'],
      css: []
    };

    var cfg = config('module-with-exclusions');
    cfg.plugins = [
      new BowerWebpackPlugin({excludes: [/.*5\.js/, /.*1\.js/]})
    ];

    testBowerPlugin(cfg, expectations, done);
  });

  it("should include no files if all are matched by an exclusion regexps", function (done) {
    var expectations = {
      js:  [],
      css: []
    };

    var cfg = config('module-with-exclusions');
    cfg.plugins = [
      new BowerWebpackPlugin({excludes: [/.*0\.js/, /.*1\.js/]})
    ];

    testBowerPlugin(cfg, expectations, done);
  });

  it("should include all files if a regular expression doesn't match (with component name)", function (done) {
    var expectations = {
      js:  ['module-with-exclusions-0', 'module-with-exclusions-1'],
      css: []
    };

    var cfg = config('module-with-exclusions');
    cfg.plugins = [
      new BowerWebpackPlugin({excludes: /.*\/some-module\/.*\.js/})
    ];

    testBowerPlugin(cfg, expectations, done);
  });


});