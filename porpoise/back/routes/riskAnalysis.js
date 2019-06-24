const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const logger = require('../logger').logger
const client = require('./dbconfig/index')
router.use(bodyParser.json())
const BANK = 271138644000
// 切换到db4
router.use(function (req, res, next) {
  client.select(4)
  next()
})
router.get('/bankAll', function (req, res) {
  let total = 0
  client.hgetall('belong_bank', function (err, data) {
    for (let i in data) {
      total = total + parseInt(JSON.parse(data[i]))
    }
    success(res, total * 1.2, 'data')
  })
})

// 获取某个公司对应的集团
router.get('/analyList', function (req, res) {
  client.hgetall('risk', function (err, data) {
    if (err) {
      logger.error(err)
      errBack(res, err)
    } else {
      let initData = []
      for (let i in data) {
        let companyData = []
        let jsonData = JSON.parse(data[i]).paths
        companyData = getCompany(jsonData, 'noName')
        if (companyData.length > 5) {
          initData.push({
            id: i,
            _id: i,
            name: changeName(i),
            num: companyData.length
          })
        }
      }
      let d = 0
      for (let i = 0; i < initData.length; i++) {
        for (let j = i + 1; j < initData.length; j++) {
          if (initData[i]['num'] < initData[j]['num']) {
            d = initData[j]
            initData[j] = initData[i]
            initData[i] = d
          }
        }
      }
      success(res, initData, 'data')
    }
  })
})

// 获取某个集团下的所有公司
router.get('/analyGroup', function (req, res) {
  let id = req.query.id
  client.hmget('risk', id, function (err, data) {
    if (err) {
      logger.error(err)
      errBack(res, err)
    } else {
      let companyData = []
      let jsonData = JSON.parse(data[0]).paths
      companyData = getCompany(jsonData, 'name')
      const start = async function () {
        for (let i = 0; i < companyData.length; i++) {
          let belong = await checkBelong(companyData[i].origin_name)
          if (parseInt(belong) > 0) {
            companyData[i]['belong_gdrc'] = true
          }
        }
        success(res, companyData, 'data')
      }
      start()
    }
  })
})

// 获取某个集团的graph
const shouxin = {
  bank: 0,
  credit_money_total: 0
}
router.get('/analyGraph', function (req, res) {
  let id = req.query.id

  var start = async function () {
    let lastData = await getGraphData(id)
    for (let i = 0; i < lastData.vertexes.length; i++) {
      const name = lastData.vertexes[i]['name']
      let belong = await checkBelong(name)
      if (parseInt(belong) > 0) {
        lastData.vertexes[i]['belong_gdrc'] = true
      }
      const init = await getShouxin(name)
      lastData.vertexes[i].origin_name = name
      lastData.vertexes[i].name = changeName(name)
      // lastData.vertexes[i].is_blacklist = await checkCompanyType(name, 'blacklist_collection')
      // lastData.vertexes[i].is_graylist = await checkCompanyType(name, 'graylist_collection')
      lastData.vertexes[i].is_blacklist = i % 6 === 0 && lastData.vertexes[i]._id.includes('Company') // mock
      lastData.vertexes[i].is_greylist = i % 3 === 0 && lastData.vertexes[i]._id.includes('Company')  // mock
      shouxin['credit_money_total'] = parseInt(shouxin['credit_money_total']) + parseInt(init['credit_money'])
    }
    shouxin['credit_percen_total'] = ((shouxin['credit_money_total'] / BANK) * 100).toFixed(5) + '%'
    shouxin['credit_surplus'] = ''
    shouxin['start_time'] = '2017-01-01'
    shouxin['end_time'] = '2017-12-30'
    shouxin['width'] = '空'
    shouxin['type'] = '空'
    lastData['shouxin'] = shouxin
    success(res, lastData, 'data')
  }
  start()
})
// 授信额度计算
router.get('/credit', function (req, res) {
  let id = req.query.id
  var start = async function () {
    let initData = await getShouxin(id)
    Object.assign(initData, shouxin)
    success(res, initData, 'data')
  }
  start()
})

// 检查是不是行内字段
function checkBelong (id) {
  return new Promise((resolve, reject) => {
    client.hmget('belong_bank', id, function (err, data) {
      if (err) {
        logger.error(err)
      } else {
        resolve(data[0])
      }
    })
  })
}

/** 判断一家企业是否属于某种类型的企业 */
function checkCompanyType (name, type) {
  return new Promise((resolve, reject) => {
    client.sismember(type, name, (err, res) => {
      if (err) {
        logger.error(err)
        reject()
      } else {
        resolve(res === 1)
      }
    })
  })
}

function keyToId (key) {
  return new Promise((resolve, reject) => {
    client.hmget('risk_reverse', key, function (err, data) {
      if (err) {
        logger.error(err)
      } else {
        resolve(data[0])
      }
    })
  })
}

function getGraphData (id) {
  return new Promise((resolve, reject) => {
    client.hmget('risk', id, function (err, data) {
      if (err) {
        logger.error(err)
      } else {
        let companyData = []
        let jsonData = JSON.parse(data[0]).paths
        companyData = getCompanyGraph(jsonData, 'name')
        for (let v in jsonData) {
          jsonData[v]['_id'] = jsonData[v]._id
          if (jsonData[v].attr === 'invest') {
            jsonData[v]['label'] = '投资'
          } else if (jsonData[v].attr === 'officer') {
            jsonData[v]['label'] = '高管(' + jsonData[v]['position'] + ')'
          } else if (jsonData[v].attr === 'link') {
            jsonData[v]['label'] = '地址和电话相同'
          }
        }
        let lastData = {
          vertexes: companyData,
          edges: jsonData
        }
        resolve(lastData)
      }
    })
  })
}

function getShouxin (id) {
  return new Promise((resolve, reject) => {
    client.hmget('belong_bank', id, function (err, data) {
      if (err) {
        logger.error(err)
        resolve({})
      } else {
        let initData = {}
        try {
          initData['credit_money'] = parseFloat(data[0]) || ''
          initData['credit_percen'] = '' + (initData['credit_money'] / BANK * 100).toFixed(5) + '%'
          initData['credit_surplus'] = (BANK - initData['credit_money']).toFixed(5)
          if (parseFloat(initData['credit_money']) === 0 || initData['credit_money'] === '') {
            initData['credit_money'] = 0
            initData['credit_percen'] = 0
          }
        }
        catch (e) {
          initData['credit_money'] = ''
          initData['credit_percen'] = ''
          initData['credit_surplus'] = ''
        }
        initData['start_time'] = '2017-01-01'
        initData['end_time'] = '2017-12-30'
        initData['width'] = '空'
        initData['type'] = '空'
        resolve(initData)
      }
    })
  })
}

function getCompany (jsonData, type) {
  let companyData = []
  let lastData = []
  for (let j in jsonData) {
    if (jsonData[j]['_to'].split('/')[0] === 'Company' &&
      companyData.indexOf(jsonData[j]['_to']) === -1) {
      companyData.push(jsonData[j]['_to'])
      if (type === 'noName') {
        lastData.push(jsonData[j]['_to'])
      } else {
        lastData.push({
          name: changeName(jsonData[j]['dst_name']),
          origin_name: jsonData[j].dst_name,
          _id: jsonData[j]['_to']
        })
      }
    }
    if (jsonData[j]['_from'].split('/')[0] === 'Company' &&
      companyData.indexOf(jsonData[j]['_from']) === -1) {
      companyData.push(jsonData[j]['_from'])
      if (type === 'noName') {
        lastData.push(jsonData[j]['_from'])
      } else {
        lastData.push({
          name: changeName(jsonData[j]['src_name']),
          origin_name: jsonData[j].src_name,
          _id: jsonData[j]['_from']
        })
      }
    }
  }
  return lastData
}

function getCompanyGraph (jsonData, type) {
  let companyData = []
  let lastData = []
  for (let j in jsonData) {
    if (companyData.indexOf(jsonData[j]['_to']) === -1) {
      companyData.push(jsonData[j]['_to'])
      if (type === 'noName') {
        lastData.push(jsonData[j]['_to'])
      }
      else {
        lastData.push({
          name: jsonData[j]['dst_name'],
          _id: jsonData[j]['_to']
        })
      }
    }
    if (companyData.indexOf(jsonData[j]['_from']) === -1) {
      companyData.push(jsonData[j]['_from'])
      if (type === 'noName') {
        lastData.push(jsonData[j]['_from'])
      }
      else {
        lastData.push({
          name: jsonData[j]['src_name'],
          _id: jsonData[j]['_from']
        })
      }
    }
  }
  return lastData
}

function errBack (res, err) {
  res.send({
    msg: err,
    status: -1
  })
}
function success (res, data, type) {
  if (type === 'remain') {
    res.send({
      msg: 'success',
      status: 0
    })
  } else if (type === 'data') {
    res.send({
      msg: 'success',
      data: data,
      status: 0
    })
  }
}

function changeName (originName) {
  let name = originName.split('')
  if (name.length <= 3) {
    name.splice(1, 2, '**')
  } else {
    name.splice(3, 5, '*****')
  }
  return name.join('')
}

module.exports = router
