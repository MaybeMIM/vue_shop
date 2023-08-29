const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  // (项目优化) 修改开发与发布默认入口文件
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      // 得到默认打包入口 先清空 再追加自己的默认文件
      config.entry('app').clear().add('./src/main-prod.js')

      // 只有在发布时才需要将import导入的包 用 externals 加载外部CDN资源
      // 使用 externals设置 排除项
      config.set('externals', {
        // vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        // element: 'Element-UI',
        'vue-quill-editor': 'VueQuillEditor',
      })
      // 追加一个属性 希望在首页中根据布尔值决定是否显示引入的CDN代码及不同标题
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      // 得到默认打包入口 先清空 再追加自己的默认文件
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
})
