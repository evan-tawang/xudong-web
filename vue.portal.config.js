const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    entry: ['./portal/sockjs.min.js','./portal/stomp.min.js', './portal/chat.js'],
    output:{
        path: path.resolve(__dirname, 'build-portal'),
        filename: 'chat.portal.js',
        publicPath: './',
    },
    plugins: [
        new webpack.ProvidePlugin({
            SockJS: 'sockjs-client',
        }),
        //拷贝static下的文件到dist下
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'portal/test.html'),
                to: './',
                ignore: ['.*']
            },
            {
                from: path.resolve(__dirname, 'portal/chat.css'),
                to: './',
                ignore: ['.*']
            },
            {
                from: path.resolve(__dirname,'portal/jquery-3.4.1.min.js'),
                to: './',
                ignore: ['.*']
            }
        ])
    ]
};
