const redis = require('redis')
const logger = require('../../logger').logger
const client = redis.createClient({
  host: '172.16.215.3',
  port: 6379
})
client.on('error', function (err) {
  logger.error('Error ' + err)
})

module.exports = client