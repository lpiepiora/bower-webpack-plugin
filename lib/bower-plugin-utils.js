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

/**
 * Given an array, returns new array having only unique entries.
 * @param array {Object[]} the array, which may contain duplicates
 * @returns {Object[]} an array containing only unique elements
 */
exports.unique = function (array) {
  var u = {}, result = [], arrLen = array.length;
  for (var i = 0; i < arrLen; i++) {
    if (u.hasOwnProperty(array[i])) {
      continue;
    }
    u[array[i]] = true;
    result.push(array[i]);
  }
  return result;
};

/**
 * Resolves a directory setting using .bowerrc
 * @returns String directory as configured in .bowerrc
 */
exports.resolveComponentsDirectory = function() {
  var fs = require("fs");
  var bowerRcFilename = ".bowerrc";
  var defaultFolder = "bower_components";

  try {
    // If .bowerrc exists, parse and if set return its directory option.
    fs.statSync(bowerRcFilename);
    var bowerRc = JSON.parse(fs.readFileSync(bowerRcFilename));
    if (bowerRc.directory) {
      return bowerRc.directory;
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      var Logger = require("./bower-plugin-logger");
      var logger = new Logger();
      logger.log(err);
    }
  }

  return defaultFolder;
};
