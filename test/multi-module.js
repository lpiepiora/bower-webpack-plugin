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

testUtils.describe("resolving of multi-file modules", function () {

  var config = testUtils.config;
  var testBowerPlugin = testUtils.testBowerPlugin;

  it("should load two JavaScript files included in a 'bower.json' file", function (done) {
    var expectations = {
      js:  ["module-multiple-js-0", "module-multiple-js-1"],
      css: []
    };
    testBowerPlugin(config('module-multiple-js.js'), expectations, done);
  });

  it("should load files of mixed types included in a 'bower.json' file", function (done) {
    var expectations = {
      js:   ['module-multiple-mixed'],
      css:  ['module-multiple-mixed'],
      font: ['fixture-fonts.woff']
    };
    testBowerPlugin(config('module-multiple-mixed.js'), expectations, done);
  });

  it("should load files of mixed types included in a 'bower.json' file, when the file points to sub-directories", function (done) {
    var expectations = {
      js:   ['module-multiple-mixed-with-subdirs'],
      css:  ['module-multiple-mixed-with-subdirs'],
      font: ['fixture-fonts.woff']
    };
    testBowerPlugin(config('module-multiple-mixed-with-subdirs.js'), expectations, done);
  });

  it("should load files, which are required by multiple modules", function (done) {
    var expectations = {
      js:   ['module-single-array', 'module-multiple-mixed-with-subdirs'],
      css:  ['module-single-string-css', 'module-multiple-mixed-with-subdirs'],
      font: ['fixture-fonts.woff']
    };

    testBowerPlugin(config('require-multiple-modules.js'), expectations, done);

  });

});
