var path=require("path");
var webpack=require('webpack');
var ExtractTextPlugin=require('extract-text-webpack-plugin');
var extractCss=new ExtractTextPlugin('style/[name].css');

module.exports={
	entry:{index:'./lib/js/index.jsx'},
	output:{
		path:path.resolve(__dirname,"public/"),
		publicPath:"public/",
		filename:"js/[name].js"
	},
	module:{
		rules:[
			{
				test:/\.jsx$/,
				use:[{
					loader:'babel-loader',
					query:{
						presets:['es2015','react']
					}
				}]
			},
			{
				test:/\.scss$/,
				loader:extractCss.extract(['css-loader','sass-loader'])
			}
		]
	},
	watchOptions:{
		aggregateTimeout:300,
		poll:1000
	},
	devServer: {
		contentBase:'./',
	    historyApiFallback: true,
	    inline: true,
	    progress: true
  	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE.ENV':"development"
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.CommonsChunkPlugin('main'),
		extractCss
	]
}