import moment from 'moment'

export const timestampToDate = (value) => {
  if (!value) {
    return ''
  }
  return moment(value, 'x').format('YYYY-MM-DD')
}

function add0(m) {
  return m < 10 ? '0' + m : m
}

export const timestampToDatetime = (value) => {
  var time = new Date(value)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
}

export const dateFmt = (data, fmt) => {
  if (!data) return
  if (typeof data === 'string') {
    data = data.replace(/-/g, '/')
    data = new Date(data)
  }
  if (!data.getMonth) {
    return
  }
  let o = {
    'M+': data.getMonth() + 1,                 // 月份
    'd+': data.getDate(),                    // 日
    'h+': data.getHours(),                   // 小时
    'm+': data.getMinutes(),                 // 分
    's+': data.getSeconds(),                 // 秒
    'q+': Math.floor((data.getMonth() + 3) / 3), // 季度
    'S': data.getMilliseconds()             // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (data.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}


export const isToday = (date) => {
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'))
  }
  let now = new Date()
  let yearFlag = now.getFullYear() === date.getFullYear()
  let monthFlag = now.getMonth() === date.getMonth()
  let dayFlag = now.getDate() === date.getDate()
  return yearFlag && monthFlag && dayFlag
}
