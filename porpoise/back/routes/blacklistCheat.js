const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const logger = require('../logger').logger
const client = require('./dbconfig/index')

router.use(bodyParser.json())

// 切换到db4
router.use(function (req, res, next) {
  client.select(4)
  next()
})

// 找关系
router.get('/relation', (req, res, next) => {
  let key = req.query.id
  // entity key->path id set
  try {
    const result = []
    const start = async function () {
      const pathIds = await getPathIdsSet(key)
      for (let i of pathIds) {
        let pathString = await getPathById('path', i)
        let pathData = JSON.parse(pathString)
        const setBelong = async function () {
          for (let i = 0; i < pathData.risk_path.length; i++) {
            let srcBelong = await checkBelong(pathData.risk_path[i].src_name)
            let dstBelong = await checkBelong(pathData.risk_path[i].dst_name)
            pathData.risk_path[i].src_belong = srcBelong > 0
            pathData.risk_path[i].dst_belong = dstBelong > 0
          }
          result.push(pathData)
        }
        await setBelong()
      }
      res.type('application/json')
      res.send(JSON.stringify({
        data: result,
        msg: 'ok',
        status: 0
      }))
    }
    start()
  } catch (e) {
    res.send(JSON.stringify({
      data: null,
      msg: 'failed',
      status: -1
    }))
  }
})

// 检查是不是行内字段
function checkBelong (id) {
  return new Promise((resolve, reject) => {
    client.hmget('belong_bank', id, function (err, data) {
      if (err) {
        logger.error(err);
      } else {
        resolve(data[0])
      }
    })
  })
}

function getPathIdsSet (key) {
  return new Promise(function (resolve, reject) {
    client.smembers(key, function (err, replies) {
      if (err) {
        reject(err)
      } else {
        resolve(replies)
      }
    })
  })
}

function getPathById (key, field) {
  return new Promise(function (resolve, reject) {
    client.hget([key, field], function (err, replies) {
      if (err) {
        reject(err)
      } else {
        resolve(replies)
      }
    })
  })
}

module.exports = router
