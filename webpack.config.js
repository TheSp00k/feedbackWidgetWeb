const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
// const Uglify = require("uglifyjs-webpack-plugin");

/*
* 
*     "build": "babel src -d build && cpx src/*.scss build/",
 "dev": "webpack-dev-server",
 "prod": "npm run clean && npm run build && webpack -p",
 "clean": "rimraf ./dist/* && rimraf ./build/*"
* */

module.exports = {
	entry: {
		app: ['babel-polyfill', './src/app.js', './src/modules/react-stars.js']
		// stars: './src/modules/react-stars.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			// {
			// 	test: /\.scss$/,
			// 	use: ExtractTextPlugin.extract({
			// 		fallback: 'style-loader',
			// 		use: ['css-loader', 'sass-loader'],
			// 		publicPath: '/dist'
			// 	})
			// },
			{
				test: /\.svg$/,
				use: 'svg-inline-loader'
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			}
		]
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: false,
		port: 9000,
		hot: true,
		stats: 'errors-only',
		open: true
	},
	plugins: [
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
		// new Uglify()
	]
};