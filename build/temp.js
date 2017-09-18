var list = [
  {id: 1, name: 'aaa'},
  {id: 2, name: 'bbb'},
  {id: 3, name: 'ccc'},
  {id: 4, name: 'ddd'}
]

list.forEach(obj => {
  obj.date = new Date().getTime()
})

var target = list.find(obj => {
  return obj.id == 3
})

target === list[2]

var mapList = list.map(obj => {
  obj.date = new Date().getTime()
  return obj
})

mapList[1] === list[1]

mapList === list
//
// [1, 2, 3].map(num => {
//   return num * 2
// })

//  [2, 4, 6]
