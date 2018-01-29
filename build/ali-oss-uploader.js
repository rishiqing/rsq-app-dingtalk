var chalk = require('chalk')
var path = require('path')
var url = require('url')
var OSS = require('ali-oss')
var readdir = require('recursive-readdir')
var homedir = require('home-dir')
var secret = require(homedir('/.dingtalk/frontend/secret'))
var STS = OSS.STS;
var co = require('co')
var sts = new STS({
  accessKeyId: secret.aliOSS.accessKeyId,
  accessKeySecret: secret.aliOSS.accessKeySecret,
});
var ossRegion = 'oss-cn-beijing'
var ossBucket = 'rishiqing-front'
var ossRootPath = 'dingtalk/'
var roleArn = secret.aliOSS.roleArn
var sessionName = 'dingtalkFrontUser'
var expiration = 900

var uploadRetryTimes = 5

var argv = process.argv
if(argv.length < 3){
  return console.log(chalk.white.bgRed(' ERROR '), chalk.red('wrong number of argument, please add the upload directory'))
}
var uploadDir = path.resolve(argv[2])

co(function* () {
  console.log(chalk.blue('>>initializing OSS client...'))
  console.log(chalk.blue('>>  OSS region is ' + ossRegion))
  console.log(chalk.blue('>>  OSS bucket is ' + ossBucket))
  console.log(chalk.blue('>>  OSS root path is ' + ossRootPath))
  var token = yield sts.assumeRole(
    roleArn, '', expiration, sessionName);
  var client = new OSS({
    region: ossRegion,
    accessKeyId: token.credentials.AccessKeyId,
    accessKeySecret: token.credentials.AccessKeySecret,
    stsToken: token.credentials.SecurityToken,
    bucket: ossBucket
  });

  console.log(chalk.blue('>>begin reading directory: ' + uploadDir))
  var files = yield readdir(uploadDir)
  for (var i = 0; i< files.length; i++) {
    var file = files[i]
    var relativePath = path.relative(uploadDir, file)
    var mills = new Date().getTime()
    var uploadName = url.resolve(ossRootPath, relativePath)

    var checkpoint = null;
    for (var j = 0; j < uploadRetryTimes; j++) {
      try {
        var res = yield client.multipartUpload(uploadName, file, {
          checkpoint: checkpoint,
          progress: function* (p, cpt){
            checkpoint = cpt
            console.log(chalk.blue('>>---' + Math.ceil(p * 100) + '% : ' + (new Date().getTime() - mills) + 'ms, ' + relativePath + ' --> ' + uploadName))
          }
        });
        console.log(chalk.green('||---done, ' + (new Date().getTime() - mills) + 'ms, ' + relativePath + ' --> ' + uploadName))
        break
      } catch (err) {
        if (j < uploadRetryTimes - 1) {
          console.log(chalk.red(' WARN retry: ' + (j + 1) + ' '), chalk.red(relativePath + ' --> ' + uploadName), chalk.red(err))
        } else {
          console.log(chalk.white.bgRed(' ERROR '), chalk.red(relativePath + ' --> ' + uploadName), chalk.red(err))
        }
      }
    }

    // if(res.res.status == 200){
    //   console.log(chalk.blue('>>---' + (new Date().getTime() - mills) + 'ms, ' + relativePath + ' --> ' + uploadName))
    // } else {
    //   console.log(chalk.white.bgRed(' ERROR '), chalk.red(file + ' --> ' + uploadName))
    //   console.log(res)
    //   break
    // }
  }
  // console.log(chalk.blue('>>finish upload'))
}).catch(function (err) {
  console.log(err);
});


