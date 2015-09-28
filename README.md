# Bower Webpack Plugin

Use [Bower](http://bower.io/) with [Webpack](http://webpack.github.io/).

# Getting started

Install the plugin:

```
npm install --save-dev bower-webpack-plugin
```

Add the plugin to your Webpack configuration:

```javascript
var BowerWebpackPlugin = require("bower-webpack-plugin");
module.exports = {
  module:  {
    loaders: [
      {
        test:   /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  },
  plugins: [new BowerWebpackPlugin()]
};
```

# Configuration

The plugin takes options object as its single argument.

* `modulesDirectories` {`string[]` or `string`} - the array of extra module directories, the plugin will look for bower components in. Unless `searchResolveModulesDirectories` is `false`, the plugin searches also for modules in directories defined at [`resolve.modulesDirectories`](http://webpack.github.io/docs/configuration.html#resolve-modulesdirectories).

* `manifestFiles` {`string[]` or `string`} - the names of the bower manifest files. The plugin will try them in the order they are mentioned. The first matching will be used.

* `includes` {`RegExp[]` or `RegExp`} - the plugin will match files contained in a manifest file, and will include only those which match any of the RegExp expressions.

* `excludes` {`RegExp[]` or `RegExp`} - the plugin will match files contained in a manifest, and will exclude all files, which match any of the expressions.

* `searchResolveModulesDirectories` {`boolean`} - if `false`, the plugin will not search [`resolve.modulesDirectories`](http://webpack.github.io/docs/configuration.html#resolve-modulesdirectories) for bower components.

Using the plugin, without specifying the configuration is equivalent to following:

```javascript
plugins: [
  new BowerWebpackPlugin({
    modulesDirectories: ["bower_components"],
    manifestFiles:      "bower.json",
    includes:           /.*/
    excludes:           [],
    searchResolveModulesDirectories: true
  })
]
```

# Usage

When the plugin is active, you can require bower modules using `require`.

# Example

This example shows how to use Twitter bootstrap installed by `bower` in your project.

Make sure, you have [bower installed](http://bower.io/#install-bower).
Create new project and install bower-webpack-plugin:

```
npm init
npm install --save-dev webpack file-loader style-loader css-loader bower-webpack-plugin
```

Install *bootstrap* bower component:

```
bower install bootstrap
```

Create an `index.html` file:

```html
<html>
  <head>
    <meta charset="utf-8">
  </head>
  <body>
    <script type="text/javascript" src="bundle.js" charset="utf-8"></script>

    <div class="container-fluid main-page">
      <div class="message-wrapper">
        <div class="box">
          <p class="lead">Press the button, to see if Bowerk Webpack Plugin works...</p>
          <button type="button" class="btn btn-default btn-lg btn-center" data-toggle="modal" data-target="#myModal">
            <span class="glyphicon glyphicon-hand-right"></span> Try me
          </button>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title" id="myModalLabel">Bower Component Test</h4>
            </div>
            <div class="modal-body">
              If you see this dialog, it means that everything works <span class="glyphicon glyphicon-ok"></span> OK
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

Create a `demo.css` file:

```css
.main-page {
  display: table;
  width: 100%;
  height: 100%;
  min-height: 100%;
  background-color: #26A65B;
}

.message-wrapper {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}

.box {
  width: 50%;
  margin: 0 auto;
  background: #F2F1EF;
  padding: 30px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}
```

Create `entry.js`, where you require bootstrap.

```javascript
require("jquery");
require("bootstrap");
require("./demo.css");
```

Twitter bootstrap comes with CSS, JavaScript, Fonts and Less. Let's assume we want to use compiled CSS, and we don't need less files.

Create `webpack.config.js` with the following content:

```javascript
var webpack = require("webpack");
var BowerWebpackPlugin = require('bower-webpack-plugin');

module.exports = {
  entry:   "./entry.js",
  output:  {
    path:     __dirname,
    filename: "bundle.js"
  },
  module:  {
    loaders: [
      {test: /\.css$/, loader: "style!css"},
      {test: /\.(woff|svg|ttf|eot)([\?]?.*)$/, loader: "file-loader?name=[name].[ext]"}
    ]
  },
  plugins: [
    new BowerWebpackPlugin({
      excludes: /.*\.less/
    }),
    new webpack.ProvidePlugin({
      $:      "jquery",
      jQuery: "jquery"
    })
  ]
};
```

Run `webpack` and open the `index.html` file.

# Release History

## 0.1.9 - 28 Sep 2015

Changes:
  * [Respect '.bowerrc' settings](https://github.com/lpiepiora/bower-webpack-plugin/issues/25)
  * Use MIT as SPDX license

## 0.1.8 - 06 Apr 2015

Changes:
  * [Add 'searchResolveModulesDirectories' option](https://github.com/lpiepiora/bower-webpack-plugin/pull/15)

## 0.1.6 - 01 Feb 2015

Changes:
 * [Fix resolving of bower.json, when used in conjunction with other plugins](https://github.com/lpiepiora/bower-webpack-plugin/pull/11)

## 0.1.5 - 05 Jan 2015

Changes:
 * [Use data.resource rather than userRequest](https://github.com/lpiepiora/bower-webpack-plugin/pull/9)

## 0.1.4 - 13 Dec 2014

Fixes for issues:
  * [The example never finishes and leaks](https://github.com/lpiepiora/bower-webpack-plugin/issues/6)

## 0.1.3 - 27 Nov 2014

Fixes for issues:
  * [The example never finishes and leaks](https://github.com/lpiepiora/bower-webpack-plugin/issues/6)

## 0.1.2 - 31 Oct 2014

Fixes for issues:
  * [Resolve strategy](https://github.com/lpiepiora/bower-webpack-plugin/issues/5)

## 0.1.1 - 30 Oct 2014

Fixes for issues:
 * [Use resolve.modulesDirectories, when resolving bower modules](https://github.com/lpiepiora/bower-webpack-plugin/issues/2)
 * [Requesting modules aliased via 'resolve.alias' fails](https://github.com/lpiepiora/bower-webpack-plugin/issues/3)

## 0.1.0 - 26 Oct 2014

Initial release
