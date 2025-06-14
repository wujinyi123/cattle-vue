const path = require('path')

module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'http://localhost:8088',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    },
    configureWebpack: {
        resolve: {
          alias: {
            '@': path.resolve(__dirname, 'src')
          }
        }
    }
}