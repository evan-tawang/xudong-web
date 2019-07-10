const path = require('path');
const webpack = require('webpack');
var argv = require('yargs').argv;

const resolve = dir => {
    return path.join(__dirname, dir)
};

const resolveProd = (process)=>{
    const rawArgv = process.argv.slice(2);
    return rawArgv[2] === 'production';
};

// 设置环境
const isProd = resolveProd(process);

module.exports = {
    // entry: getDirectories('./portal'),
    publicPath: isProd ? './' : '/', // 线上打包路径，请根据项目实际线上情况
    outputDir: 'build/', // 打包生成的生产环境构建文件的目录
    assetsDir: process.env.assetsDir || 'static', // 放置生成的静态资源路径，默认在outputDir
    indexPath: 'index.html', // 指定生成的 index.html 输入路径，默认outputDir
    // lintOnSave: true, // 是否开启eslint保存检测，有效值：ture | false | 'error'
    productionSourceMap: isProd, // 开启 生产环境的 source map?
    // runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
    chainWebpack: config => {
        // 配置路径别名
        config.resolve.alias
            .set('@', resolve('src'))

        // config.plugin('define')
        //     .use(webpack.ProvidePlugin, [{
        //         server: JSON.stringify(argv.server ? argv.server : ''),
        //     }]);

        //开发环境拷贝到编译后目录下
        config.plugin('copy')
            .tap(args => {
                if(!isProd){
                    args[0][0].from = './portal';
                    args[0][0].to = './';
                }
                return args;
            });
    },
    css: {
        modules: false, // 启用 CSS modules
        extract: isProd, // 是否使用css分离插件 true style 和 文件的css less sass 文件不能自动更新
        sourceMap: false, // 开启 CSS source maps?
        loaderOptions: {} // css预设器配置项
    },
    devServer: {
        publicPath:'/',
        // overlay 同时显示警告和错误
        overlay: {
            warnings: true,
            errors: true
        },
        open: true, // 配置自动启动浏览器
        hotOnly: true, // 热更新
        port: 8081, // 端口
        proxy: {//代理
            '/': {
                ws: false,
                target: 'http://127.0.0.1:9001',
                // target: 'http://47.96.89.84:9001',
                changeOrigin: true,
                pathRewrite: {
                    '/service': '',
                },
            },
        },
    }
};
