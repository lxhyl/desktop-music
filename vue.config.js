const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {

    lintOnSave: false,//取消ES6语法校验
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
    outputDir: "dist", //打包目录
    indexPath: "index.html",
    productionSourceMap: false,

    // 开发环境配置
    devServer: {
        // host:"localhost",
        port:"8080",
        proxy: {
            '/api': {
                target: 'https://zhangpengfan.xyz:3000',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }

        }
    },
    plugins:[
        new BundleAnalyzerPlugin()
    ],
    
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
            return {
                plugins: [
                    new CompressionPlugin({
                        test: /\.js$|\.html$|.\css/, //匹配文件名
                        threshold: 10240,//对超过10k的数据压缩
                        deleteOriginalAssets: true //不删除源文件
                    })
                ]
            }
        }
    }
}
