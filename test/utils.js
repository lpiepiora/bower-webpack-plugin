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


var fs = require("fs");
var pluginUtils = require("../lib/bower-plugin-utils");

describe("plugin utils library", function () {

  describe("unique method", function () {

    it("should return an empty array when passed an empty array", function (done) {
      var result = pluginUtils.unique([]);
      result.should.be.eql([]);
      done();
    });

    it("should return an array containing the same elements, when the array has only unique elements", function (done) {
      var result = pluginUtils.unique(["one", "two", "three"]);
      result.length.should.be.equal(3);
      result.should.be.eql(["one", "two", "three"]);
      done();
    });

    it("should return an array, which doesn't contain duplicated elements", function (done) {
      var result = pluginUtils.unique(["one", "two", "two", "three", "one"]);
      result.should.be.eql(["one", "two", "three"]);
      result.length.should.be.equal(3);
      done();
    });

  });

  describe("bower_components resolution", function () {

    it("should return 'bower_components' when no .bowerrc file", function(done) {
      var result = pluginUtils.resolveComponentsDirectory();
      result.should.be.eql("bower_components");
      done();
    });

    it("should return 'bower_components' when no definition in .bowerrc", function(done) {

      // Generate a .bowerrc file
      var bowerRcFilename = ".bowerrc",
        bowerRc = {
          "foo": ["bar"]
        }
      fs.writeFileSync(bowerRcFilename, JSON.stringify(bowerRc));
      var result = pluginUtils.resolveComponentsDirectory();
      fs.unlinkSync(bowerRcFilename);

      result.should.be.eql("bower_components");
      done();
    });

    it("should detect 'custom_components' if .bowerrc specifies it", function(done) {

      // Generate a .bowerrc file pointing to `custom_components`
      var bowerRcFilename = ".bowerrc",
        bowerRc = {
          "foo": "bar",
          "directory": "custom_components"
        }
      fs.writeFileSync(bowerRcFilename, JSON.stringify(bowerRc));
      var result = pluginUtils.resolveComponentsDirectory();
      fs.unlinkSync(bowerRcFilename);

      result.should.be.eql("custom_components");
      done();
    });

  });

});
