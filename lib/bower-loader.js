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

var util = require('util');
var loaderUtils = require('loader-utils');

/**
 * Loads bower main files from a specified bower manifest file
 * @param source source file, which must be loaded
 * @returns {string} containing require for each included file
 * @function
 */
module.exports = function (source) {
  var bower = JSON.parse(source),
    result = [],
    bowerMainFiles = (util.isArray(bower.main)) ? bower.main : [bower.main],
    bowerMainIncludes = loaderUtils.parseQuery(this.query).include;

  function includesContain(entry) {
    return bowerMainIncludes.some(function (include) {
      return entry === include;
    });
  }

  this.cacheable();

  bowerMainFiles.filter(includesContain).forEach(function (item) {
    if (/\.js$/.test(item)) {
      result.push("module.exports = require(" + JSON.stringify("./" + item) + ");");
    } else {
      result.push("require(" + JSON.stringify("./" + item) + ");");
    }
  });

  return result.join("\n");

};