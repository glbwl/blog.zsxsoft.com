let webpack = require('webpack');
let path = require('path');
let buildPath = path.resolve(__dirname, 'build');
let nodeModulesPath = path.resolve(__dirname, 'node_modules');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let TransferWebpackPlugin = require('transfer-webpack-plugin');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let purify = require("purifycss-webpack-plugin");


let config = {
  //Entry point to the project
  entry: [
    path.join(__dirname, '/src/app/app.jsx'),
  ],
  //Webpack config options on how to obtain modules
  resolve: {
    //When requiring, you don't need to add these extensions
    extensions: ["", ".js", ".jsx"],
  },
  devtool: 'source-map',
  //Configuration for server
  devServer: {
    contentBase: 'build',
  },
  //Output file config
  output: {
    path: buildPath,    //Path of output file
    filename: 'app.js',  //Name of output file
  },
  plugins: [
    //Used to include index.html in build folder
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: path.join(__dirname, '/src/www/index.html'),
      //minify: true, 
    }),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new ExtractTextPlugin("style.css"),
    new purify({
      basePath: __dirname,
      paths: [
        "src/www/index.html",
      ],
      purifyOptions: {
        minify: true,
      },
    }),
    //Allows error warninggs but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
    //Transfer Files
    new TransferWebpackPlugin([
      { from: 'www/images', to: 'images' },
    ], path.resolve(__dirname, "src")),

  ],
  module: {
    //eslint loader
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: [path.resolve(__dirname, "src/app")],
        exclude: [nodeModulesPath],
      },
    ],
    //Allow loading of non-es5 js files.
    loaders: [
      {
        test: /\.(js|jsx)$/, //All .js and .jsx files
        loader: 'babel-loader', //babel loads jsx and es6-7
        include: [__dirname, path.resolve(__dirname, '../src')], //include these files
        exclude: [nodeModulesPath],  //exclude node_modules so that they are not all compiled
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
    ],
  },
  eslint: {
    configFile: '.eslintrc',
  },
};

module.exports = config;