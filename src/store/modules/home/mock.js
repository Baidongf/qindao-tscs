const base = '/mock/gap/api/homepage'



// 为了列表数据生成随机的 key
const generateKey = () => {
  return Math.random().toString(36).substr(2)
}

let globalKey = 0

// 为表格生成数组数据
const generateResponse = (data, count) => {
  const response = {
    success: true,
    payload: { data: [] },
    message: { from: 'mock' },
  }

  for (let i = 0; i < count; i++) {
    let _data = Object.assign({}, data, { key: generateKey() })
    response.payload.data.push(_data)
  }
  return response
}

module.exports = function(router) {

  // 首页显示哪些模块
  router.get(`${base}/module`, function(req, res, next) {
    res.json({
      success: true,
      payload: {
        data: [0, 1, 2, 3, 4, 5, 6]
      },
      message: {
        type: 'mock'
      }
    })
  })

  // 首页-商机管理
  router.get(`${base}/businessOpportunity`, function(req, res, next){
    const data = {
      name: '这是名字',
      state: '这是状态',
      origin: '来源',
      type: '类型'
    }
    const response = generateResponse(data, 5)
    res.json(response)
  })

  // 首页-客户动态
  router.get(`${base}/customerActivity`, function(req, res, next){
    const data = {
      name: '动态名称1111',
      category: '动态类型2222',
      time: '推送时间3333',
    }
    const response = generateResponse(data, 5)
    res.json(response)
  })

  // 首页-客户信息
  router.get(`${base}/customerInfo`, function(req, res, next){
    const data = {
      customer: '用户是谁',
      code: '9527',
      category: 'IT',
      legalPerson: 'jackma',
      foundDate: '2018-01-01',
      capital: '3,000',
      level: 'A',
      address: '广东省深圳市芒果大厦',
    }
    const response = generateResponse(data, 5)
    res.json(response)
  })

  // 首页-知识库
  router.get(`${base}/knowledgeBase`, function(req, res, next){
    const data = {
      name: '信息名称',
      type: '信息类型',
      publishTime: '2019-01-01',
      readingVolume: 865,
    }
    const response = generateResponse(data, 5)
    res.json(response)
  })

  // 首页-营销活动
  router.get(`${base}/marketingActivity`, function(req, res, next){
    const data = {
      name: '富滇银行理财计划拉新',
      state: 'pending',
      timeInterval: '2018-01-01 2019-12-31',
    }
    const response = generateResponse(data,4)
    res.json(response)
  })

  // 首页-营销成果
  router.get(`${base}/marketingResults`, function(req, res, next){
    const data = {
      amount: '1,234',
      isArrowUp: true,
      percent: '10.5%',
    }
    const dataArr = [
      {...data, key: 'deposit'},
      {...data, key: 'balance'},
      {...data, key: 'loan'},
    ]
    const response = {
      success: true,
      payload: { data: dataArr },
      message: { from: 'mock' },
    }
    res.json(response)
  })

  // 首页-工作日程
  router.get(`${base}/workSchedule`, function(req, res, next){
    const data = {
      arrange: '安排安排安排',
      theme: '主题主题',
      name: '名称名称',
    }
    const response = generateResponse(data, 3)
    res.json(response)
  })

}

