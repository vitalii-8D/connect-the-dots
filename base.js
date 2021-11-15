const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

console.log(__dirname)

module.exports = {
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'docs'),
    // clean: true,
  },
  resolve: {
    extensions: ['.js', '.png'],
    alias: {
      // '~': path.resolve(__dirname, './src')
    }
  },
  mode: "development",
  devtool: "source-map",
  devServer: {
    open: true,
    port: 8070
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // use: "babel-loader"
        use: [{
          loader: "babel-loader",
          options: {
            presets: [
              '@babel/preset-env'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }]
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: "file-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "")
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html")
    })
  ]
};
