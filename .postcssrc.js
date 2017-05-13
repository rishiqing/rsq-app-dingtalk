// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": function(loader) {
    return [
      require('postcss-import')({ root: loader.resourcePath }),
      // require('cssnext')(),
      require('autoprefixer')({ browsers: ['last 2 versions'] }),
      require('precss')(),
      // require('cssnano')()
    ]
  }
}
