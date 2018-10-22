// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var ip = require('ip')

var devPort = 8090
var stsPort = 8300

//  为了防止jenkins构建错误，需要在这里做处理
var devIp
try {
  devIp = ip.address('WLAN', 'ipv4')
} catch(e){
  devIp = ip.address()
}

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: './',
    assetsPublicPath: './',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    // 日事清地址
    rsqServer: 'https://www.rishiqing.com/',
    // 日事清api的后台地址
    apiServer: 'https://ding.rishiqing.com/',
    // apiServer: 'http://dd.rsq.etoutiao.cn/',
    // 日事清-portlet的权限认证后台地址
    authServer: 'https://ding.rishiqing.com/',
    // authServer: 'http://dd.rsq.etoutiao.cn/rsqauth/',
    // 日事清前端文件地址
    frontServer: 'https://rishiqing-front.oss-cn-beijing.aliyuncs.com',
    // 阿里云OSS STS认证的server地址，临时！！！！注意更新
    stsServer: 'https://stsserver.hz.taeapp.com/sts/',
    // stsServer: 'http://182.92.222.40:8300/sts/',
    aliOSS: {
      region: 'oss-cn-beijing',
      bucket: 'rishiqing-file',
      root: 'dingtalk/',
      imageBucket: 'rishiqing-images',
      kanbanCoverImagePath: 'cover/custom/kanban/'
    },
    version: 2000000
  },
  beta: {
    env: require('./beta.env'),
    index: path.resolve(__dirname, '../dist/beta/mobile/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist/beta/mobile/'),
    assetsSubDirectory: './',
    assetsPublicPath: '/dingtalk/beta/mobile/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    // 日事清地址
    rsqServer: 'http://beta.rishiqing.com/',
    // 日事清api的后台地址
    apiServer: 'http://betading.rishiqing.com/',
    // apiServer: 'http://dd.rsq.etoutiao.cn/',
    // 日事清-portlet的权限认证后台地址
    authServer: 'http://betading.rishiqing.com/',
    // authServer: 'http://dd.rsq.etoutiao.cn/rsqauth/',
    // 日事清前端文件地址
    frontServer: 'https://rishiqing-front.oss-cn-beijing.aliyuncs.com/',
    // 阿里云OSS STS认证的server地址，临时！！！！注意更新
    stsServer: 'https://stsserver.hz.taeapp.com/sts/',
    // stsServer: 'http://182.92.222.40:8300/sts/',
    remindServer: 'http://ding.rishiqing.com/',
    aliOSS: {
      region: 'oss-cn-beijing',
      bucket: 'rishiqing-file',
      root: 'dingtalk/',
      imageBucket: 'rishiqing-images',
      kanbanCoverImagePath: 'cover/custom/kanban/'
    },
    version: 2000000
  },
  dev: {
    env: require('./dev.env'),
    port: devPort,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static/',
    assetsPublicPath: '/assets',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: true,
    hotPath: '/__webpack_hmr',
    // 日事清地址
    rsqServer: 'http://beta.rishiqing.com/',
    // 日事清api的后台地址
    apiServer: 'http://dev1.ngrok.timetask.cn/',
    // 日事清-portlet的权限认证后台地址
    authServer: 'http://dev1.ngrok.timetask.cn/rsqauth/',
    // 日事清前端文件地址
    // frontServer: 'http://' + devIp + ':' + (process.env.PORT || devPort) + '/',
    frontServer: '/',
    // 阿里云OSS STS认证的server地址
    // stsServer: 'http://' + ip.address() + ':' + (process.env.STS_PORT || stsPort) + '/sts/'
    stsServer: 'https://stsserver.hz.taeapp.com/sts/',
    aliOSS: {
      region: 'oss-cn-beijing',
      bucket: 'rishiqing-file',
      root: 'dingtalk/',
      imageBucket: 'rishiqing-images',
      kanbanCoverImagePath: 'cover/custom/kanban/'
    },
    version: 2000000
  }
}
