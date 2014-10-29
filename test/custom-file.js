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

testUtils.describe("resolving of files, when having custom module file name", function () {
  var config = testUtils.config;
  var testBowerPlugin = testUtils.testBowerPlugin;

  it("should take the custom file, when the normal file is last", function (done) {
    var expectations = {
      js:   ['module-custom-bower-file'],
      css:  ['module-custom-bower-file'],
      font: ['fixture-fonts.woff']
    };

    var cfg = config('module-custom-bower-file');
    cfg.plugins = [
      new BowerWebpackPlugin({manifestFiles: ["custom.json", "bower.json"]})
    ];

    testBowerPlugin(cfg, expectations, done);
  });

  it("should take the custom file, when the normal file is missing", function (done) {
    var expectations = {
      js:   ['module-custom-bower-file'],
      css:  ['module-custom-bower-file'],
      font: ['fixture-fonts.woff']
    };

    var cfg = config('module-custom-bower-file');
    cfg.plugins = [
      new BowerWebpackPlugin({manifestFiles: ["bower.json", "custom.json"]})
    ];

    testBowerPlugin(cfg, expectations, done);
  });


  it("should take the custom file, when it is first in the array", function (done) {
    var expectations = {
      js:   ['module-custom-file-fallback'],
      css:  ['module-custom-file-fallback'],
      font: ['fixture-fonts.woff']
    };

    var cfg = config('module-custom-file-fallback');
    cfg.plugins = [
      new BowerWebpackPlugin({manifestFiles: ["custom.json", "bower.json"]})
    ];

    testBowerPlugin(cfg, expectations, done);
  });

});