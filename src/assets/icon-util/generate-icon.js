const fs = require('fs')

//  生成css font icon的效果图列表
function generate(str){
  const reg = /\.(icon2-[a-z0-9\-]+):before/g
  let result = ''
  let match
  while(match = reg.exec(str)){
    result += makeTag(match[1])
  }
  return result
}

function makeTag(cls){
  return '<li><i class="' + cls + '"></i><span>' + cls + '</span></li>';
}

const file = fs.readFileSync('../fonts/icomoon2.css', 'UTF-8')
const fontTags = generate(file)
const demo = fs.readFileSync('./demo.html.template', 'UTF-8')
const result = demo.replace(/\$\{FONT_PLACEHOLDER\}/g, fontTags)
fs.writeFileSync('./demo.html', result, 'UTF-8')
