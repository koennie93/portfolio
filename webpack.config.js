const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/browserIndex.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'js'),
    clean: true, // Clear the output directory before each build
  },
  // Only generate source maps in development mode
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  // Configure optimization to ensure license comments are extracted
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        terserOptions: {
          format: {
            comments: /@license|@preserve|Copyright|license|License/i,
          },
        },
      }),
    ],
  },
  plugins: [
    ...(process.env.NODE_ENV === 'production' ? [
      new WebpackObfuscator({
        rotateStringArray: true,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        identifierNamesGenerator: 'hexadecimal',
        renameGlobals: false,
        selfDefending: true
      }, ['excluded_bundle_name.js'])
    ] : [])
  ],
}; 