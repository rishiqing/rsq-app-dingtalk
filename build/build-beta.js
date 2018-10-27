require('./check-versions')()

process.env.NODE_ENV = 'beta'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.beta.conf')

var spinner = ora('building for beta test...')
spinner.start()

console.log(chalk.blue('basic beta prod config, should use server config:'))
// console.log(chalk.blue('auth server:', config.beta.authServer))
// console.log(chalk.blue('rishiqing api server:', config.beta.apiServer))
// console.log(chalk.blue('frontend server:', config.beta.frontServer))

rm(path.join(config.beta.assetsRoot, config.beta.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
