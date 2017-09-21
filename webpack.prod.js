const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = merge(common, {
	plugins: [
		new UglifyJSPlugin({
			sourceMap: true
		}),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Feedback widget',
			minify: {
				collapseWhitespace: true
			},
			hash: true,
			template: './src/AB554Q.html'
		}),
		new ExtractTextPlugin({
			filename: 'app.css',
			disable: true,
			allChunks: true
		}),
		new ExtractTextPlugin({
			filename: 'bootstrap.css',
			disable: true,
			allChunks: true
		}),
		new ExtractTextPlugin({
			filename: 'bootstrap-theme.css',
			disable: true,
			allChunks: true
		}),
		// new webpack.optimize.CommonsChunkPlugin({
		// 	name: 'app',
		// 	chunks: ['app', 'stars']
		// }),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin()

	]
});