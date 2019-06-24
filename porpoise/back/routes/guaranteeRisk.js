const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const logger = require('../logger').logger
const client = require('./dbconfig/index')

router.use(bodyParser.json())

let guaranteeKeys = []
// 切换到db2
router.use(function (req, res, next) {
  client.select(2)
  if (!guaranteeKeys.length) {
    getKeys('guarantee').then((data) => {
      guaranteeKeys = data
      next()
    })
  } else {
    next()
  }
})

function getKeys (hash) {
  return new Promise((resolve, reject) => {
    client.hkeys(hash, (error, resp) => {
      if (error) {
        reject(error)
      } else {
        resolve(resp)
      }
    })
  })
}

function multipleGet (hash, keys) {
  return new Promise((resolve, reject) => {
    client.hmget([hash, ...keys], (error, resp) => {
      if (error) {
        reject(error)
      } else {
        resolve(resp)
      }
    })
  })
}

// 分页返回 group list 数据
router.post('/clusters', (req, res, next) => {
  let gua = []
  const page = req.body.page || 0
  const count = req.body.count || 10
  const start = async function () {
    try {
      if (page >= guaranteeKeys.length) {
        throw Error('page index out of range')
      }
      let result = await multipleGet('guarantee', guaranteeKeys.slice(page * count, (page + 1) * count))
      for (let i in result) {
        gua.push({
          id: JSON.parse(result[i]).id,
          name: JSON.parse(result[i]).id
        })
      }
      res.type('application/json')
      res.send(JSON.stringify({
        data: {
          list: gua,
          total: guaranteeKeys.length
        },
        msg: 'ok',
        status: 0
      }))
    } catch (e) {
      logger.error(e)
      res.send(JSON.stringify({
        data: null,
        msg: 'failed',
        status: -1
      }))
    }
  }
  start()
})

// 返回group list数据
router.get('/clusters', (req, res, next) => {
  var gua = []
  client.hgetall('guarantee', function (error, resp) {
    if (error) {
      logger.error(err)
      res.send(JSON.stringify({
        data: error,
        msg: 'failed',
        status: -1
      }))
    } else {
      var gua = []
      for (var i in resp) {
        gua.push({
          id: i,
          name: i
        })
      }
      res.send(JSON.stringify({
        msg: 'OK',
        status: 0,
        data: gua
      }))
    }
    // 关闭链接
    // client.end();
  });
})

// 根据id反向查族谱
router.get('/getClusterByEntity', (req, res, next) => {
  var key = req.query.id
  client.hmget('guarantee_reverse', key, function (error, resp) {
    if (error) {
      logger.error(err)
      res.send(JSON.stringify({
        data: error,
        msg: 'failed',
        status: -1
      }))
    } else {
      const result = []
      resp.forEach((v) => {
        if (!v) return
        result.push({
          id: v,
          name: v
        })
      })
      res.type('application/json')
      res.send(JSON.stringify({
        data: result,
        msg: 'ok',
        status: 0
      }))
    }
  })
})

// 某个族谱信息
router.get('/getClusterById', (req, res, next) => {
  var key = req.query.id
  client.hmget('guarantee', key, function (error, resp) {
    if (error) {
      logger.error(err)
      res.send(JSON.stringify({
        data: error,
        msg: 'failed',
        status: -1
      }))
    } else {
      let val = JSON.parse(resp[0])
      res.send(JSON.stringify({
        data: val,
        msg: 'ok',
        status: 0
      }))
    }
  })
})

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

// 根据id反向查path
router.get('/paths', (req, res, next) => {
  var key = req.query.id
  // entity key->path id set
  const start = async function () {
    try {
      const result = [];
      const pathIds = await getPathIdsSet(key)
      for (let i of pathIds) {
        let pathString = await getPathById('path', i)
        result.push(JSON.parse(pathString))
      }
      res.send(JSON.stringify({
        data: result,
        msg: 'ok',
        status: 0
      }))
    } catch (e) {
      res.send(JSON.stringify({
        data: null,
        msg: 'failed',
        status: -1
      }))
    }
  }
  start()
})

// 计算path中的类别总数
router.get('/count', (req, res, next) => {
  client.get('count', (err, resp) => {
    if (err) {
      logger.error(err)
      res.send(JSON.stringify({
        data: err,
        msg: 'failed',
        status: -1
      }))
    } else {
      res.type('application/json')
      res.send(JSON.stringify({
        msg: 'OK',
        status: 0,
        data: JSON.parse(resp)
      }))
    }
  })
})

module.exports = router
