

const path = require('path');

// Builds bundle usable inside <script>.
module.exports = {
	mode: process.env.NODE_ENV || 'production',
	context: __dirname,
	entry: {
		'app': './app.js',
	},
	output: {
		path: path.join(__dirname, '/dist'),
		filename: '[name].js',
		libraryTarget: 'umd',
		library: 'app',
	},
	devtool: 'source-map',
	module: {
		rules: [

			{
				test: /\.js?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.(html|css|md)$/,
				exclude: /node_modules/,
				loader: 'raw-loader',
			},
			{
				test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
				loader: 'base64-inline-loader',
				options: {
					limit: Infinity,
					mimetype: 'image/png',
				},
			},
		],
	},
	devServer: {
		contentBase: __dirname,
		publicPath: '/dist',
		compress: true,
		port: 4003,
	},
	resolve: {},
};
