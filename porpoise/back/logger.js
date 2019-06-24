const path = require('path')
const winston = require('winston')
const errorLog = path.join(__dirname, '../logs/error.log')
const moment = require('moment')

// 获取代码文件，函数，行号
Object.defineProperty(global, '__stack_porpoise', {
  get: function () {
    const orig = Error.prepareStackTrace
    Error.prepareStackTrace = function (_, stack) {
      return stack
    }
    const err = new Error()
    Error.captureStackTrace(err, arguments.callee)
    const stack = err.stack
    Error.prepareStackTrace = orig
    return stack
  }
})

Object.defineProperty(global, '__line_porpoise', {
  get: function () {
    return __stack_porpoise[1].getLineNumber()
  }
})

Object.defineProperty(global, '__function_porpoise', {
  get: function () {
    return __stack_porpoise[1].getFunctionName()
  }
})

Object.defineProperty(global, '__file_porpoise', {
  get: function () {
    return __stack_porpoise[1].getFileName()
  }
})

/** 错误日志 */
// silly: 5, debug: 4, verbose: 3, info: 2, warn: 1, error: 0
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'silly'
    }),
    new (winston.transports.File)({
      filename: errorLog,
      level: 'silly',
      timestamp: function () {
        // return Date.now()
        return moment().format('YYYY-MM-DD, HH:mm:ss')
      },
      formatter: function (options) {
        // Return string will be passed to logger.
        return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' +
          (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '')
      }
    })
  ]
})

const formatterLogger = function (msg, line, func, file) {
  let str = ''
  if (typeof (msg) !== 'undefined') {
    if (typeof (msg) === 'object') {
      str += JSON.stringify(msg)
    } else if (typeof (msg) === 'string') {
      str += msg
    } else {
      str += msg.toString()
    }
    if (typeof (line) !== 'undefined') {
      str += ' [line] ' + line
      if (typeof (func) !== 'undefined') {
        str += ' [function] ' + func
        if (typeof (file) !== 'undefined') {
          str += ' [file] ' + file
        }
      }
    }
  }
  return str
}

module.exports = {
  logger,
  formatterLogger
}
