const path = require('path');

const resolve = dir => {
    return path.join(__dirname, dir)
};

// node 去掉前两位参数信息
const rawArgv = process.argv.slice(2);
// 开发 打包 注意 test:e2e 模式 走 build 模式
const NODE_ENV = rawArgv[0] === 'build' ? 'production' : 'development';

// 设置环境
process.env.NODE_ENV = NODE_ENV;

const IS_PROD = process.env.NODE_ENV === 'production';

module.exports = {
    publicPath: IS_PROD ? './' : '/', // 线上打包路径，请根据项目实际线上情况
    outputDir: 'build/', // 打包生成的生产环境构建文件的目录
    assetsDir: process.env.assetsDir || 'static', // 放置生成的静态资源路径，默认在outputDir
    indexPath: 'index.html', // 指定生成的 index.html 输入路径，默认outputDir
    // lintOnSave: true, // 是否开启eslint保存检测，有效值：ture | false | 'error'
    productionSourceMap: IS_PROD, // 开启 生产环境的 source map?
    // runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
    chainWebpack: config => {
        // 配置路径别名
        config.resolve.alias
            .set('@', resolve('src'))
    },
    css: {
        modules: false, // 启用 CSS modules
        extract: IS_PROD, // 是否使用css分离插件 true style 和 文件的css less sass 文件不能自动更新
        sourceMap: false, // 开启 CSS source maps?
        loaderOptions: {} // css预设器配置项
    },
    devServer: {
        // overlay 同时显示警告和错误
        overlay: {
            warnings: true,
            errors: true
        },
        open: true, // 配置自动启动浏览器
        hotOnly: true, // 热更新
        port: 8080, // 端口
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
        }
    }
};
