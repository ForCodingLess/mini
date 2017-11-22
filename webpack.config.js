var path=require("path");
var webpack=require('webpack');

module.exports={
	entry:{index:'./lib/js/index.jsx'},
	output:{
		path:path.resolve(__dirname,"public/js/"),
		publicPath:"public/js/",
		filename:"[name].js"
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
			}
		]
	},
	watchOptions:{
		aggregateTimeout:300,
		poll:1000
	},
	devServer: {
	    historyApiFallback: true,
	    hot: true,
	    inline: true,
	    progress: true
  	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE.ENV':"development"
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.CommonsChunkPlugin('main')
	]
}