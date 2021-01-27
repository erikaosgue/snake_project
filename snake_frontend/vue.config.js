module.exports = {
  transpileDependencies: ["vuetify"],
  chainWebpack: config => {
        config.module
            .rule('images')
            .test(/\.(png)$/)
            .use('url-loader')
              .loader('url-loader')
              .end()
    }
};
