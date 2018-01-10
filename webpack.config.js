var path=require("path");
var webpack=require('webpack');
var ExtractTextPlugin=require('extract-text-webpack-plugin');
var extractCss=new ExtractTextPlugin('style/[name].css');

module.exports={
	entry:{index:'./dev/js/index.js'},
	output:{
		path:path.resolve(__dirname,"bulid/"),
		publicPath:"bulid/",
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
				test:/\.js$/,
				use:[{
					loader:'babel-loader',
					query:{
						presets:['es2015']
					}
				}]
			},
			{
				test:/\.scss$/,
				loader:extractCss.extract(['css-loader','sass-loader'])
			},
			{
				test:/\.(png|jpg|gif|woff|woff2|ttf|eot|svg|swf)$/,
				use:[{
					loader:'file-loader',
					options:{
						name:'img/[name].[ext]',
						publicPath: './'
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