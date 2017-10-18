require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var chalk = require('chalk')
var path = require('path')
var ip = require('ip')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})
console.log('config.dev.hotPath:' + config.dev.hotPath)
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {},
  path: config.dev.hotPath
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

//  跨域访问
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//  upload server
app.post('/rsqddmdevapp/upload', function(req, res){
  console.log(chalk.blue('>>>>receiving upload files'))
  require('./dev-upload-server')(req,  res)
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://' + ip.address('WLAN', 'ipv4') + ':' + port + '/'

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log(chalk.blue('basic dev config:'))
console.log(chalk.blue('auth server:', config.dev.authServer))
console.log(chalk.blue('rishiqing api server:', config.dev.apiServer))
console.log(chalk.blue('frontend server:', config.dev.frontServer))
console.log(chalk.blue('dev server(should be same as frontend server):', uri))
if(config.dev.frontServer !== uri){
  console.log(chalk.black.bgRed(' WARN '), chalk.red('dev server is not same as frontend server, this may cause some problem in dev environment'))
}
console.log(chalk.green('> Starting dev server...'))

devMiddleware.waitUntilValid(() => {
  console.log(chalk.green('> Listening at ' + uri + '\n'))
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    // opn(uri)
  }
  _resolve()
})

// app.use(config.dev.rootPath, router)
// app.use('/', router)

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
