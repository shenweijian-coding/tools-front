// const path = require('path')
// const fs = require('fs')
// export const getFolder = (path: any) => {
//   let components: Array<string> = []
//   const files = fs.readdirSync(path)
//   files.forEach(function (item: string) {
//     let stat = fs.lstatSync(path + '/' + item)
//     if (stat.isDirectory() === true && item != 'components') {
//       components.push(path + '/' + item)
//       components.push.apply(components, getFolder(path + '/' + item))
//     }
//   })
//   return components
// }
export function timeConvert(time: string) {
  const dt = new Date(time) //new实例
  const y = dt.getFullYear() //获取年
  //获取月 日 时等等     其中月默认从0开始所以+1  
  //使用空字符串转为string类型 
  //使用padStart方法补0
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') 
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}