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
var should = require("should");
var path = require("path");
var webpack = require('webpack');
var fs = require('fs');
var jsdom = require("jsdom");
var rm = require('rimraf');

var BowerWebpackPlugin = require("../");

var OUTPUT_DIR = path.join(__dirname, '../dist');

exports.OUTPUT_DIR = OUTPUT_DIR;

/**
 * Describes a bower plugin test.
 * @param text
 * @param fn
 */
exports.describe = function (text, fn) {
  function clearOutput(done) {
    return rm(OUTPUT_DIR, done);
  }

  return describe(text, function () {
    beforeEach(clearOutput);
    afterEach(clearOutput);
    fn();
  });
};

/**
 * Tests if the plugin returns soft error
 * @param webpackConfig
 * @param done
 */
exports.testBowerPluginError = function testBowerPlugin(webpackConfig, done) {
  webpack(webpackConfig, function (err, stats) {
    stats.hasErrors().should.be.eql(true);
    done();
  });
};

/**
 * @param {Object} webpackConfig configuration for webpack
 * @param {Object} expectedModules expected css and js files
 * @param done called when done
 */
exports.testBowerPlugin = function testBowerPlugin(webpackConfig, expectedModules, done) {

  webpack(webpackConfig, function (err, stats) {

    var jsonStats = stats.toJson();
    jsonStats.errors.should.be.eql([]);

    var bundleScript = 'file:///' + path.join(webpackConfig.output.path, webpackConfig.output.filename);
    jsdom.env("<html></html>", [bundleScript], {}, function (errors, window) {
      should(errors).be.equal(null);

      var document = window.document;

      (function checkExpectedJs() {
        var expectedJs = expectedModules.js || [];
        if (expectedJs.length > 0) should(window.loadedModules).eql(expectedJs);
      })();

      (function checkExpectedCSS() {
        var expectedCss = expectedModules.css || [];
        if (expectedCss.length > 0) {
          var loadedCssClasses = [];

          var styleTags = document.getElementsByTagName('style');
          for (var i = 0; i < styleTags.length; i++) {
            var declarations = styleTags[i].innerHTML.split("}");
            for (var j = 0; j < declarations.length; j++) {
              var name = declarations[j].match(/^\s*\.([^\s]+).*/);
              if (name) loadedCssClasses.push(name[1]);
            }
          }

          should(loadedCssClasses).eql(expectedCss);
        }
      })();

      (function checkExpectedFonts() {
        var expectedFont = expectedModules.font || [];
        for (var i = 0; i < expectedFont.length; i++) {
          fs.existsSync(path.join(OUTPUT_DIR, expectedFont[i])).should.be.equal(true);
        }
      })();

      window.close();
      done();
    });
  })
};

/**
 * Creates default config using a defined entry point
 * @param {string} entryPoint name of the file, which acts as an entry point
 * @returns {{entry: *, output: {path: *, filename: string}, plugins: *[], debug: boolean}}
 */
exports.config = function config(entryPoint) {
  return {
    entry:   path.join(__dirname, "fixtures", entryPoint),
    output:  {
      path:     OUTPUT_DIR,
      filename: 'bundle' + entryPoint
    },
    plugins: [new BowerWebpackPlugin()],
    module:  {
      loaders: [
        {
          test:   /\.css$/,
          loader: "style-loader!css-loader"
        },
        {
          test:   /\.woff([\?]?.*)$/,
          loader: "file-loader?name=[name].[ext]"
        }
      ]
    },
    debug:   true
  };
};