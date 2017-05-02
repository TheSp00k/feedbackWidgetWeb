const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		app: './src/app.js',
		stars: './src/modules/react-stars.js',
		contact: './src/contact.js'
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
			},
			{
				test: /\.pug$/,
				use: 'pug-loader'
			}
		]
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
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
			excludeChunks: ['contact'],
			template: './src/index.html'
		}),
		new HtmlWebpackPlugin({
			title: 'Contact page',
			hash: true,
			chunks: ['contact'],
			filename: 'contact.html',
			template: './src/contact.html'
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
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin()
	]
};