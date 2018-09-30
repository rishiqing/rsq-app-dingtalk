/* eslint-disable */
export default {
  // 对象深复制
  deepClone (source) {
	  const targetObj = source.constructor === Array ? [] : {} // 判断复制的目标是数组还是对象
	  for (const keys in source) { // 遍历目标
	    if (source.hasOwnProperty(keys)) {
	      if (source[keys] && typeof source[keys] === 'object') { // 如果值是对象，就递归一下
	        targetObj[keys] = source[keys].constructor === Array ? [] : {}
	        targetObj[keys] = this.deepClone(source[keys])
	      } else { // 如果不是，就直接赋值
	        targetObj[keys] = source[keys]
	      }
	    }
	  }
	  return targetObj
  },
  // 兼容rrule的option，传入数字或者数组，如果是数组就复制，不是就返回实参的数组
  toArray (num) {
  	let arrCache = []
    if (Array.isArray(num)) {
      arrCache = [...num]
    } else {
      arrCache = [num]
    }
    return arrCache
  }
}
