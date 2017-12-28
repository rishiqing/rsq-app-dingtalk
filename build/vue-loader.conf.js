var utils = require('./utils')
var config = require('../config')
const c = config[process.env.NODE_ENV]

module.exports = {
  cssSourceMap: false,
  loaders: utils.cssLoaders({
    sourceMap: c.productionSourceMap ? c.productionSourceMap : c.cssSourceMap,
    extract: c.cssLoader.extract
  })
}
