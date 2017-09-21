const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		app: ['./src/app.js', './src/modules/react-stars.js']
	},
	plugins: [
		// new CleanWebpackPlugin(['dist']),
		// new HtmlWebpackPlugin({
		// 	title: 'Production'
		// }),
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
	],
	module: {
		rules: [
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
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};