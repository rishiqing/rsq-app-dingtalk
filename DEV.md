# 开发文档

## 分支说明

* v1.0.0：基于vue1.0版本的uigit
* v1.1.0：新版本UI + 笔记
* v2.0.0：基于vue2.0版本，包括了新UI和笔记功能

## postcss替换sass

> sass使用繁琐，而postcss通过precss插件可以兼容大部分sass语法，故使用postcss解析编译前的css文件。
> .scss文件均使用postcss编译

### 使用到的package有：
1. postcss-loader：webpack集成postcss的loader，按照postcss官方推荐，在使用postcss-loader之前调用css-loader
2. postcss-import：支持@import语法引入css文件
3. autoprefixer：自动添加vendor prefixes
4. precss：按照sass的语法解析文件

### webpack配置
在build/utils中将scss文件的loader设置为postcss

    scss: generateLoaders('postcss', {
                                       plugins: (loader) => [
                                         require('postcss-import')({ root: loader.resourcePath }),
                                         require('autoprefixer')({ browsers: ['last 2 versions'] }),
                                         require('precss')()
                                       ]
                                     })

### .postcssrc.js文件
项目中postcss默认的配置文件为.postcssrc.js，由于在dev环境下postcss的import功能无法正常使用，故这里不使用配置文件，而采用动态配置的方式

## server说明
> portlet前端需要与日事清api、第三方权限认证系统、前端资源等后台服务交互。

### apiServer
日事清接口api，测试环境为http://beta.rishiqing.com，正式环境为https://www.rishiqing.com

### authServer
第三方权限认证后台，例如，与钉钉集成时，需要authServer与钉钉后台和日事清后台交互已同步人员信息，人员相关的接口需要通过authServer获取

### frontServer
前端资源存放的后台。开发环境一般为本地dev-server，正式环境一般为阿里云OSS或CDN节点

## 跨域问题解决方案
> 日事清系统中的登录接口j_spring_security_check，直接调用默认使用302重定向，而CORS的options请求（preflight）不允许返回redirect，因此需要使用同一的域做访问

1. 配置域名。例如解析`dd.rsq.etoutiao.cn`域名到公网服务器（182.92.222.40）
2. 配置nginx端口转发。将`http://dd.rsq.etoutiao.cn/abc`转发到某个服务器端口，例如（9888）
3. 通过Xshell等ssh连接工具做ssh隧道，映射某个本地端口（8888）到配置好的服务器端口（9888）
4. 启动Xshell连接服务器，即可实现将访问连接统一到`dd.rsq.etoutiao.cn`这个域名下

## 问题汇总

### .vue文件中的警告问题

Previous source map found, but options.sourceMap isn't set.
In this case the loader will discard the source map enterily for performance reasons.
See https://github.com/postcss/postcss-loader#sourcemap for more information.

暂时先将config/index.js中的dev.cssSourceMap设置为true

### .vue文件中无法使用scss的问题

.vue文件的style标签中无法使用scss相关的import等语法，具体原因待研究。
而在.postcsssr.js中配置了postcss的相关插件后，.vue文件的style标签就可以正常使用了！

### mutation中的参数问题
vue2.0中，mutation的payload需要是一个对象，而不能同时传入多个参数！需要统一测试修改！

## 多人开发流程
目前由于钉钉方的限制，一个微应用只能有一个地址，因此一个微应用难以多人开发，目前多人开发采用同一个套件下新建多个微应用的方式

1. 新建后台。由于一个java后台只能服务一个微应用，因此，需要在原来的基础上新建并启动一个新后台，服务微应用。并做好后台的映射
2. 修改配置config/index.js
  - hotPath: 开发时前端打包文件的热加载hmr路径，默认为"/__webpack_hmr"，不同的开发者需要设置不同的path
  - dev-server.js: 修改`'webpack-hot-middleware/client?path=/__wallace_hmr&noInfo=true&reload=true'`中的path为配置文件中的hotPath
  - authServer: 后台地址，根据不同的path映射到不同的后台

# 版本号说明

- 三位版本号。如2.0.0
- 为做比较版本码按照（主版本号 * 1000000 + 副版本号 * 1000 + 三级版本号）的形式表示，例如：2.1.12版本号，对应的版本码为2001012
