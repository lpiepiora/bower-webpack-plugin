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

testUtils.describe("resolving of single file modules", function () {
  var config = testUtils.config;
  var testBowerPlugin = testUtils.testBowerPlugin;

  it("should load a 'main' with a single string value, pointing to a JavaScript file", function (done) {
    var expectations = {
      js:  ['module-single-string'],
      css: []
    };

    testBowerPlugin(config('module-single-string.js'), expectations, done);

  });

  it("should load a 'main' with a single string value, pointing to a CSS file", function (done) {

    var expectations = {
      js:   [],
      css:  ['module-single-string-css'],
      font: ['fixture-fonts.woff']
    };

    testBowerPlugin(config('module-single-string-css.js'), expectations, done);

  });

  it("should load a 'main' with an array having a single value, pointing to a file", function (done) {
    var expectations = {
      js:  ['module-single-array'],
      css: []
    };
    testBowerPlugin(config('module-single-array.js'), expectations, done);
  })

});