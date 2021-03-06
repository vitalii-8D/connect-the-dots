const merge = require("webpack-merge");
const path = require("path");
const base = require("./base");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(base, {
  mode: "production",
  output: {
    filename: "bundle.min.js"
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  plugins: [
    new CopyPlugin([
      {
        from: path.join(__dirname, 'assets'),
        to: path.resolve(__dirname, 'docs', 'assets'),
      }
    ])
  ]
});
