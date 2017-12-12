require('./check-versions')()

process.env.NODE_ENV = 'release'
console.log('----build----: env is: ' + process.env.NODE_ENV)

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
const webpackConfig = require('./webpack.release.conf.js')

const spinner = ora('building for release...')
spinner.start()

console.log(chalk.blue('basic prod config:'))
console.log(chalk.blue('auth server:', config.release.authServer))
console.log(chalk.blue('rishiqing api server:', config.release.apiServer))
console.log(chalk.blue('frontend server:', config.release.frontServer))

rm(path.join(config.release.assetsRoot, config.release.assetsSubDirectory), err => {
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

    console.log(chalk.cyan(' release Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
