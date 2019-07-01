const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: ['./portal/sockjs.min.js','./portal/stomp.min.js', './portal/chat.js'],
    output:{
        path: path.resolve(__dirname, 'build-portal'),
        filename: 'chat.portal.js',
        publicPath: './'
    },
    plugins: [
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
