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
export function timeConvert(time: any) {
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

export function dateFormate(dateTime, timeflag) {
  console.log(dateTime, 'dateTime')
  const date = new Date(dateTime * 1000);
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? (`0${m}`) : m;   
  let d = date.getDate();
  d = d < 10 ? (`0${d}`) : d;
  let h = date.getHours();
  h = h < 10 ? (`0${h}`) : h;
  let minute = date.getMinutes();
  minute = minute < 10 ? (`0${minute}`) : minute;
  let seconds = date.getSeconds();
  seconds = seconds < 10 ? (`0${seconds}`) : seconds;
  let result = '';
  if (timeflag) {
    result = `${y}-${m}-${d} ${h}:${minute}:${seconds}`;
  } else {
    result = `${y}-${m}-${d}`;
  }
  return result;
};