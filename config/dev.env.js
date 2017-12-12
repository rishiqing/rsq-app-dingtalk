var merge = require('webpack-merge')
var prodEnv = require('./release.env.js')

module.exports = merge(prodEnv, {
  NODE_ENV: '"dev"'
})
