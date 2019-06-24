import { fetchCardData } from 'actions/Card'
import { setRenderChartStatus } from 'actions/Chart'
import { authorizedFetch } from 'actions/Global'
import { API_ADDRESS } from '../../../../../../global_config'
import { ActionTypes } from 'redux-undo';

const GROUP_COMPANY_LIST_PATH = API_ADDRESS + '/api/search/group_company'
const STOCK_CHART_PATH = API_ADDRESS + '/api/graph/stockRight'
const INVEST_CHART_PATH = API_ADDRESS + '/api/graph/outInvestWithTree'
const RISK_LIST_PATH = API_ADDRESS + '/api/notification/event_info'
const SINGLE_COMPANY_RISK_LIST_PATH = API_ADDRESS + '/api/notification/company_event_info'
const GROUP_FEATURE = API_ADDRESS + '/api/search/group/feature'
const NEW_REGISTER = API_ADDRESS + '/api/search/group/new_register_company'
// const SINGLE_COMPANY_RELATIVE_RISK_CHART = API_ADDRESS + '/mock/api/graph/company_event_graph'
const FIND_GROUP_MEMBERS = API_ADDRESS + '/api/search/group/findGroupMembers'
const SINGLE_COMPANY_RELATIVE_RISK_CHART = API_ADDRESS + '/api/graph/relation'
const CAPITAL_CIRCLE_LIST_PATH = API_ADDRESS + '/api/search/group/findCapitalCirculationList'
const CAPITAL_CIRCLE_DETAIL_PATH = API_ADDRESS + '/api/search/group/findCapitalCirculationDetail'
const MUTUAL_GUARA_LIST_PATH = API_ADDRESS + '/api/search/group/findJointAndMutualGuaraList'
const MUTUAL_GUARA_DETAIL_PATH = API_ADDRESS + '/api/search/group/findJointAndMutualGuaraDetail'
const BLOCK_TRADE_LIST_PATH = API_ADDRESS + '/api/search/group/findGroupBlockTradePage'
const EXPIRE_BUSINESS_LIST_PATH = API_ADDRESS + '/api/search/group/findGroupExpireBusinessPage'
const INNER_CREDIT_TOTAL_PATH = API_ADDRESS + '/api/search/group/findGroupAndInnerCreditTotal'
const CREDIT_OVER_LIMITLIST_PATH = API_ADDRESS + '/api/search/group/findGroupCreditOverLimitList'

/** ================================ action types =========================== */
const GET_SINGLE_COMPANY_CHART_SUCCESS = 'GET_SINGLE_COMPANY_CHART_SUCCESS'
const riskTypeActionsMap = {
  'SINGLE_COMPANY': 'GET_SINGLE_COMPANY_RISK_LIST_SUCCESS',
  'FIRST_DEGREE': 'GET_FIRST_DEGREE_RISK_LIST_SUCCESS',
  'SECOND_DEGREE': 'GET_SECOND_DEGREE_RISK_LIST_SUCCESS',
  'THIRD_DEGREE': 'GET_THIRD_DEGREE_RISK_LIST_SUCCESS',
  'MORE_DEGREE': 'GET_MORE_DEGREE_RISK_LIST_SUCCESS'
}

/* ================================= actions ================================ */
/**
 * 获取企业列表
 * @return {Function} action
 */
export function getCompanyList () {
  return (dispatch, getState) => {
    let url = `
      ${GROUP_COMPANY_LIST_PATH}?circle=${encodeURIComponent(getState().location.query.group_name)}
        &type=${encodeURIComponent(getState().location.query.type)}
    `
    fetchCardData(dispatch, url, (data) => {
      function compare (property) {
        return function (a, b) {
          let value1 = Number(a[property])
          let value2 = Number(b[property])
          return value2 - value1
        }
      }
      data.companies.sort(compare('page_rank'))
      dispatch({
        type: 'GET_COMPANY_LIST_SUCCESS',
        companyList: data.companies,
        num: data.num
      })
    })
  }
}
/**
 * 群体特征
 * @param {string} group_name 派系公司名
 * @param {string} type 行业类型
 */
export function getGroupFeature () {
  return (dispatch, getState) => {
    const promise1 = new Promise( (resolve) => {
      fetchFeature('group','行业', resolve)
    })
    const promise2 = new Promise( (resolve) => {
      fetchFeature('city', '城市', resolve)
    })
    const promise3 = new Promise( (resolve) => {
      fetchFeature('province', '省份', resolve)
    })
    function fetchFeature (type, name, resolve) {
      let url = `${GROUP_FEATURE}?group_name=${encodeURIComponent(getState().location.query.group_name)}&type=${encodeURIComponent(name)}`
      authorizedFetch(url, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).then((data) => {
        let featureData = data
        if (data.status !== 0) {
          resolve(featureData)
          throw Error(data.msg)
        }
        featureData.type = type
        featureData.data.forEach((item) => {
          item.name = item.content
          item.value = item.count
        })
        resolve(featureData)
      }).catch((e) => {
        console.error(e)
      })
    }
    Promise.all([promise1, promise2, promise3])
    .then((resultList) => {
      dispatch({
        type: 'GET_GROUP_FEATURE_SUCCESS',
        featureData: resultList
      })
    })
  }
}
/**
 * 新注册企业
 * @param {string} group_name 派系公司名
 * @param {string} type 行内客户标识 后台说暂时无作用 先写死
 */
export function getNewRegister () {
  return (dispatch, getState) => {
    let url = `${NEW_REGISTER}?group_name=${encodeURIComponent(getState().location.query.group_name)}&type=0`
    authorizedFetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then((data) => {
      if (data.status === 0 && data.data) {
        dispatch({
          type: 'GET_NEW_REGISTER_SUCCESS',
          registerList: data.data.data || [],
          totalCount: data.data.total_count || 0
        })
      }
    }).catch((e) => {
      console.error(e)
    })
  }
}
/**
 * 获取集团机会或风险事件信息
 * @param {Number} ruleType 事件类型
 * @param {Number} offset 当前页起始位置
 * @param {Number} count  当前页的个数
 * @return {Function} action
 */
export function getRiskList (ruleType = 0, offset = 0, count = 5) {
  return (dispatch, getState) => {
    let url = `
      ${RISK_LIST_PATH}?groupName=${encodeURIComponent(getState().location.query.group_name)}&ruleType=${ruleType}&offset=${offset}&count=${count}`
    fetchCardData(dispatch, url, (data) => {
      dispatch({
        type: 'GET_RISK_LIST_SUCCESS',
        riskList: data.eventDatas,
        totalCount: data.totalCount
      })
    })
  }
}

/**
 * 获取单一企业机会或风险事件信息
 * @param {Object} postBody
 */
export function getSingleCompanyRiskList (riskType, jsonData) {
  return (dispatch) => {
    // 参数companies不能为空
    if (!jsonData.companies.length) {
      return
    }
    let url = `${SINGLE_COMPANY_RISK_LIST_PATH}`
    authorizedFetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(jsonData)
    }).then((data) => {
      if (data.status !== 0) throw Error(data.msg)
      data = data.data
      dispatch({
        type: riskTypeActionsMap[riskType],
        riskList: data.eventDatas,
        totalCount: data.totalCount
      })
    }).catch((e) => {
      console.error(e)
    })
  }
}

export function getSingleCompanyChart (name) {
  return async (dispatch, getState) => {
    const chartData = {
      stock: {},
      invest: {},
      sameLayer: {}
    }
    dispatch(setRenderChartStatus('pending'))

    await Promise.all([
      getStockRightChart(name),
      getInvestChart(name),
      getSameLayerChart(name, getState().clusterChartData)
    ]).then((res) => {
      chartData.stock = res[0]
      chartData.invest = res[1]
      chartData.sameLayer = res[2]
    })

    dispatch(setRenderChartStatus('drawing'))
    dispatch({
      type: GET_SINGLE_COMPANY_CHART_SUCCESS,
      data: chartData
    })
  }
}

export function clearSingleCompanyChart () {
  return {
    type: GET_SINGLE_COMPANY_CHART_SUCCESS,
    data: null
  }
}

async function getStockRightChart (name) {
  let stockData = {}
  try {
    const data = await authorizedFetch(`${STOCK_CHART_PATH}?name=${encodeURIComponent(name)}`)
    if (!data.status && data.data) {
      stockData = Object.assign({}, data.data)
      stockData.stockCompList = data.data
      var capital = Number.parseFloat(stockData.properties.capital)
      stockData.children && stockData.children.forEach((c) => {
        delete c.children //  只要第一层
        c.properties.actual_controller = c.relations.actual_controller ? 'true' : 'false'
        c.properties.control_shareholder = c.relations.control_shareholder ? 'true' : 'false'
        if (c.relations.invest) {
          c.properties.actual_controller = c.relations.actual_controller ? 'true' : 'false'
          c.properties.control_shareholder = c.relations.control_shareholder ? 'true' : 'false'
          if (capital) {
            c.properties.ratio = c.relations.invest.invest_amount / capital
          }
        } else if (capital && c.relations.tradable_share) {
          c.properties.ratio = parseFloat(c.relations.tradable_share.total_stake_distribution) / 100
        }
        c.properties.ratio = c.properties.ratio || ''
        c.properties._type = 'stock'
      })
      stockData.children.sort((a, b) => a.properties.ratio > b.properties.ratio ? -1 : 1)
      cutChildren(stockData, 5, '小股东', (data) => data.reduce((acc, cur) => acc + (cur.properties.ratio || 0), 0))
    } else {
      // throw Error(data.msg)
    }
  } catch (e) {
    console.error(e)
  }
  return stockData
}

async function getInvestChart (name) {
  let investData = {}
  try {
    const data = await authorizedFetch(`${INVEST_CHART_PATH}?company=${encodeURIComponent(name)}`)
    if (!data.status && data.data) {
      investData = data.data
      if (investData.children) {
        traversalTree(investData, (d, prev) => {
          d.properties._type = 'invest'
          d.depth = prev ? prev.depth + 1 : 0
          d.properties._depth = d.depth
          const capital = Number.parseFloat(d.properties.capital)
          if (d.relations) {
            d.properties.actual_controller = d.relations.actual_controller ? 'true' : 'false'
            d.properties.control_shareholder = d.relations.control_shareholder ? 'true' : 'false'
            d.properties.is_abnormal_status = ['吊销', '注销', '清算', '停业', '撤销'].some(function (tag) {
              let businessStatus = d.properties.business_status || ''
              return businessStatus.indexOf(tag) > -1
            })
            if (d.relations.invest) {
              if (capital) {
                d.properties.ratio = d.relations.invest.invest_amount / capital
              }
              d.properties.actual_controller = 'false'
              d.properties.control_shareholder = 'false'
            } else if (d.relations.tradable_share) {
              d.properties.ratio = d.relations.tradable_share.total_stake_distribution
            }
          }
          d.properties.ratio = d.properties.ratio || ''
          if (d.depth > 2 && d.properties.ratio && prev.properties.ratioToRoot) {
            d.properties.ratioToRoot = d.properties.ratio * prev.properties.ratioToRoot
          } else if (d.depth === 2 && d.properties.ratio && prev.properties.ratio) {
            d.properties.ratioToRoot = d.properties.ratio * prev.properties.ratio
          }
        })
        traversalTree(investData, (d) => {
          d.children && d.children.sort((a, b) => a.properties.ratio > b.properties.ratio ? -1 : 1)
        })
        investData.investCompList = JSON.parse(JSON.stringify(investData))
        // investData.investCompList = Object.assign(investData)
        traversalTree(investData, (d) => {
          switch (d.depth) {
            case 0:
              cutChildren(d, 5, '投资对象', () => '持股')
              break
            case 1:
              cutChildren(d, 3, '投资对象', () => '持股')
              break
            case 2:
              cutChildren(d, 5, '投资对象', () => '持股')
              break
            default:
              break
          }
        })
      }
    } else {
      // throw Error(data.msg)
    }
  } catch (e) {
    console.error(e)
  }
  return investData
}

function getSameLayerChart (name, cluster) {
  const clusterChart = { vertexes: [], edges: [] }
  for (let key in cluster) {
    if (cluster.hasOwnProperty(key)) {
      clusterChart.vertexes.push(...cluster[key].vertexes)
      clusterChart.edges.push(...cluster[key].edges)
    }
  }
  const sameLayerChart = {}
  const centerCompany = clusterChart.vertexes.find((v) => v.name === name)
  if (!centerCompany) {
    return sameLayerChart
  }

  sameLayerChart.properties = centerCompany
  const centerId = centerCompany._id

  /** 疑似同一企业 */
  getSameCompanyByType('share_phone_address', 'sameComp')

  /** 共同控股股东 */
  const shareholderId = []
  const sameShareholderEdge = getEdgeByType(clusterChart.edges, centerId, 'actual_controller')
  sameShareholderEdge.forEach((e) => {
    if (e._from === centerId) {
      return
    }
    const company = clusterChart.vertexes.find((v) => v._id === e._from)
    if (company && !shareholderId.includes(company._id)) {
      shareholderId.push(company._id)
    }
  })
  const sameShareholderComp = []
  const sameShareholderCompList = []
  clusterChart.edges.forEach((e) => {
    if (shareholderId.includes(e._from) && !sameShareholderComp.includes(e._to) && e._to !== centerId) {
      sameShareholderComp.push(e._to)
    }
  })
  sameLayerChart.sameShareholderCompIdList = sameShareholderComp
  if (sameShareholderComp.length === 1) {
    const company = clusterChart.vertexes.find((v) => v._id === sameShareholderComp[0])
    sameLayerChart.sameShareholderComp = company.name
    sameLayerChart.sameShareholderCompList = company
  } else if (sameShareholderComp.length > 1) {
    sameLayerChart.sameShareholderComp = `共${sameShareholderComp.length}个关联企业`
    sameShareholderComp.forEach((s) => {
      sameShareholderCompList.push(clusterChart.vertexes.find((v) => v._id === s))
    })
    sameLayerChart.sameShareholderCompList = sameShareholderCompList
  }

  /** 共核心高管 */
  getSameCompanyByType('officer_share', 'sameOfficer')

  const labelMap = {
    sameComp: '疑似同一企业',
    sameShareholderComp: '共同控股股东',
    sameOfficer: '共核心高管'
  }
  sameLayerChart.children = []
  for (let key in sameLayerChart) {
    if (key in labelMap) {
      sameLayerChart.children.push({
        properties: {
          name: sameLayerChart[key]
        },
        relations: {
          label: labelMap[key]
        },
        otherChild: sameLayerChart.sameShareholderCompIdList,
        isSameLayer: true
      })
    }
  }

  return sameLayerChart

  function getSameCompanyByType (edgeType, key) {
    const edges = getEdgeByType(clusterChart.edges, centerId, edgeType)
    if (edges.length > 1) {
      sameLayerChart[key] = `共${edges.length}个关联企业`
    }
    if (edges.length === 1) {
      const companyId = edges[0]._from === centerId ? edges[0]._to : edges[0]._from
      const company = clusterChart.vertexes.find((v) => v._id === companyId)
      if (company) {
        sameLayerChart[key] = company.name
      }
    }
  }
}

// 关联风险图谱接口
export function getSingleCompanyRelativeChart (companyNames, depth) {
  return (dispatch, getState) => {
    // 设置要开启的边
    const options = JSON.parse(JSON.stringify(getState().FilterOptions))
    const findRelationEdges = ['invest', 'shareholder', 'officer', 'concert', 'actual_controller', 'tradable_share', 'control_shareholder', 'person_merge', 'family', 'guarantee', 'money_flow']
    options.edges.forEach((edge) => {
      if (findRelationEdges.includes(edge.class)) {
        edge.visible = true
      }
    })
    /** 根据行内配置设定参数 */
    // const belongBankRelation = JSON.parse(sessionStorage.getItem('belongBankRelation')) || []
    // belongBankRelation.forEach((r) => {
    //   if (options.edges.some((e) => e.class === r.target_table)) return
    //   options.edges.push({
    //     class: r.target_table,
    //     visible: r.is_selected === 1 && r.is_show === 1,
    //     traceDepth: 1
    //   })
    // })
    options['max_length'] = depth
    let headers = new Headers({
      'Content-Type': 'application/json'
    })
    const params = {
      method: 'POST',
      headers: headers,
      mode: 'cors',
      body: JSON.stringify({
        options: options
      })
    }
    let url = `${SINGLE_COMPANY_RELATIVE_RISK_CHART}?company1=${companyNames[0]}&company2=${companyNames[1]}`
    authorizedFetch(encodeURI(url), params)
    .then((data) => {
      if (data.status !== 0) throw Error(data.msg)
      dispatch({
        type: 'GET_RELATIVE_RISK_CHART_SUCCESS',
        data: data.data
      })
    }).catch((e) => {
      console.error(e)
    })
  }
}

/**
 * 获取筛选公司结果
 * @param {Object} postBody
 */
export function getGroupMembers (jsonData) {
  return (dispatch) => {
    let url = `${FIND_GROUP_MEMBERS}`
    authorizedFetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(jsonData)
    }).then((data) => {
      if (data.status !== 0) throw Error(data.msg)
      dispatch({
        type: 'GET_COMPANY_LIST_SUCCESS',
        companyList: data.data.members,
        num: data.data.members.length
      })
    }).catch((e) => {
      console.error(e)
    })
  }
}

/**
 * 获取集团内资金流转环信息
 */
export function getCapitalCircleList (jsonData) {
  return (dispatch) => {
    let url = `${CAPITAL_CIRCLE_LIST_PATH}`
    authorizedFetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(jsonData)
    }).then((data) => {
      if (data.status !== 0) throw Error(data.msg)
      dispatch({
        type: 'GET_CAPITAL_CIRCLE_LIST_SUCCESS',
        capitalCircleList: data.data.list,
        num: data.data.list.length
      })
    }).catch((e) => {
      console.error(e)
    })
  }
}

/**
 * 获取集团内单个资金流转环-详情
 * @param {Object} postBody
 */
export function getCapitalCircleDetail (jsonData) {
  return (dispatch) => {
    let url = `${CAPITAL_CIRCLE_DETAIL_PATH}`
    authorizedFetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(jsonData)
    }).then((data) => {
      if (data.status !== 0) throw Error(data.msg)
      dispatch({
        type: 'GET_CAPITAL_CIRCLE_DETAIL_SUCCESS',
        data: data.data,
        num: data.data.detail.length,
        group_type: 'capital_circle'
      })
    }).catch((e) => {
      console.error(e)
    })
  }
}

/**
 * 获取集团内联保互保环信息
 */
export function getMutualGuaraList (jsonData) {
  return (dispatch) => {
    let url = `${MUTUAL_GUARA_LIST_PATH}`
    authorizedFetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(jsonData)
    }).then((data) => {
      if (data.status !== 0) throw Error(data.msg)
      dispatch({
        type: 'GET_MUTUAL_GUARA_LIST_SUCCESS',
        mutualGuaraList: data.data.list,
        num: data.data.list.length
      })
    }).catch((e) => {
      console.error(e)
    })
  }
}

/**
 * 获取集团内联保互保环-详情
 * @param {Object} postBody
 */
export function getMutualGuaraDetail (jsonData) {
  return (dispatch) => {
    let url = `${MUTUAL_GUARA_DETAIL_PATH}`
    authorizedFetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(jsonData)
    }).then((data) => {
      if (data.status !== 0) throw Error(data.msg)
      dispatch({
        type: 'GET_MUTUAL_GUARA_DETAI_SUCCESS',
        data: data.data,
        num: data.data.detail.length,
        group_type: 'mutual_guara'
      })
    }).catch((e) => {
      console.error(e)
    })
  }
}

/**
 * 获取集团内近期大额交易客户
 * @param {Object} postData
 */
export function getBlockTradeList (postData) {
  return (dispatch) => {
    let url = BLOCK_TRADE_LIST_PATH
    authorizedFetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(postData)
    }).then((data) => {
      if (data.status !== 0) throw Error(data.msg)
      dispatch({
        type: 'GET_BLOCK_TRADE_LIST',
        blockTradeList: data.data,
        num: data.data.total
      })
    }).catch((e) => {
      console.error(e)
    })
  }
}

/**
 * 获取集团内近期业务到期客户
 * @param {Object} postData
 */
export function getExpireBusinessList (postData) {
  return (dispatch) => {
    let url = EXPIRE_BUSINESS_LIST_PATH
    authorizedFetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(postData)
    }).then((data) => {
      if (data.status !== 0) throw Error(data.msg)
      dispatch({
        type: 'GET_EXPIRE_BUSINESS_LIST',
        expireBusinessList: data.data,
        num: data.data.total
      })
    }).catch((e) => {
      console.error(e)
    })
  }
}

/**
 * 获取集团和行内授信总金额
 * @param {Objest} postData
 */
export function getInnerCreditTotal (postData) {
  return (dispatch) => {
    let url = INNER_CREDIT_TOTAL_PATH
    authorizedFetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(postData)
    }).then((data) => {
      if (data.status !== 0) throw Error(data.msg)
      dispatch({
        type: 'GET_INNER_CREDIT_TOTAL',
        data: data.data
      })
    }).catch((e) => {
      console.error(e)
    })
  }
}

/**
 * 获取
 * @param {Object} postData
 */
export function getCreditOverLimitlist (postData) {
  return (dispatch) => {
    let url = CREDIT_OVER_LIMITLIST_PATH
    authorizedFetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(postData)
    }).then((data) => {
      if (data.status !== 0) throw Error(data.msg)
      dispatch({
        type: 'GET_CREDIT_OVER_LIMITLIST',
        data: data.data,
        num: data.data.total
      })
    }).catch((e) => {
      console.error(e)
    })
  }
}
/* ================================= reducers =============================== */
export function companyListObj (state = { companyList: [], num: 0 }, action) {
  if (action.type === 'GET_COMPANY_LIST_SUCCESS') {
    return {
      companyList: action.companyList,
      num: action.num
    }
  } else {
    return state
  }
}

export function groupFeatureObj (state = { featureData: [] }, action) {
  if (action.type === 'GET_GROUP_FEATURE_SUCCESS') {
    return {
      featureData: action.featureData
    }
  } else {
    return state
  }
}

export function newRegisterObj (state = { registerList: [], totalCount: 0 }, action) {
  if (action.type === 'GET_NEW_REGISTER_SUCCESS') {
    return {
      registerList: action.registerList,
      totalCount: action.totalCount
    }
  } else {
    return state
  }
}

export function riskListObj (state = { riskList: [], totalCount: 0 }, action) {
  if (action.type === 'GET_RISK_LIST_SUCCESS') {
    return {
      riskList: action.riskList,
      totalCount: action.totalCount
    }
  } else {
    return state
  }
}

export function singleCompanyRiskListObj (state = { riskList: [], totalCount: 0 }, action) {
  if (action.type === 'GET_SINGLE_COMPANY_RISK_LIST_SUCCESS') {
    return {
      riskList: action.riskList,
      totalCount: action.totalCount
    }
  } else if (action.type === 'GET_FIRST_DEGREE_RISK_LIST_SUCCESS') {
    return {
      firstDegreeRiskList: action.riskList,
      firstDegreeTotalCount: action.totalCount
    }
  } else if (action.type === 'GET_SECOND_DEGREE_RISK_LIST_SUCCESS') {
    return {
      secondDegreeRiskList: action.riskList,
      secondDegreeTotalCount: action.totalCount
    }
  } else if (action.type === 'GET_THIRD_DEGREE_RISK_LIST_SUCCESS') {
    return {
      thirdDegreeRiskList: action.riskList,
      thirdDegreeTotalCount: action.totalCount
    }
  } else if (action.type === 'GET_MORE_DEGREE_RISK_LIST_SUCCESS') {
    return {
      moreDegreeRiskList: action.riskList,
      moreDegreeTotalCount: action.totalCount
    }
  } else {
    return state
  }
}

export function singleCompanyChart (state = null, action) {
  if (action.type === GET_SINGLE_COMPANY_CHART_SUCCESS) {
    return action.data
  } else {
    return state
  }
}

export function singleCompanyRelativeChart (state = null, action) {
  if (action.type === 'GET_RELATIVE_RISK_CHART_SUCCESS') {
    return action.data
  } else {
    return state
  }
}

export function findGroupMembers (state = { companies: [] }, action) {
  if (action.type === 'FIND_GROUP_MEMBERS_SUCCESS') {
    return {
      companies: action.data.companies
    }
  } else {
    return state
  }
}

export function capitalCircleList (state = { capitalCircleList: [], num: 0 }, action) {
  if (action.type === 'GET_CAPITAL_CIRCLE_LIST_SUCCESS') {
    return {
      capitalCircleList: action.capitalCircleList,
      num: action.num
    }
  } else {
    return state
  }
}

export function capitalCircleDetail (state = { data: {}, num: 0, group_type: '' }, action) {
  if (action.type === 'GET_CAPITAL_CIRCLE_DETAIL_SUCCESS') {
    return {
      data: action.data,
      num: action.num,
      group_type: action.group_type
    }
  } else {
    return state
  }
}

export function mutualGuaraList (state = { mutualGuaraList: [], num: 0 }, action) {
  if (action.type === 'GET_MUTUAL_GUARA_LIST_SUCCESS') {
    return {
      mutualGuaraList: action.mutualGuaraList,
      num: action.num
    }
  } else {
    return state
  }
}

export function mutualGuaraDetail (state = { data: {}, num: 0, group_type: '' }, action) {
  if (action.type === 'GET_MUTUAL_GUARA_DETAI_SUCCESS') {
    return {
      data: action.data,
      num: action.num,
      group_type: action.group_type
    }
  } else {
    return state
  }
}

export function blockTradeList (state = {
  blockTradeList: [],
  num: 0
}, action) {
  if (action.type === 'GET_BLOCK_TRADE_LIST') {
    return {
      blockTradeList: action.blockTradeList,
      num: action.num
    }
  } else {
    return state
  }
}

export function expireBusinessList (state = {
  expireBusinessList: [],
  num: 0
}, action) {
  if (action.type === 'GET_EXPIRE_BUSINESS_LIST') {
    return {
      expireBusinessList: action.expireBusinessList,
      num: action.num
    }
  } else {
    return state
  }
}

export function innerCreditTotal (state = {
  data: {}
}, action) {
  if (action.type === 'GET_INNER_CREDIT_TOTAL') {
    return {
      data: action.data
    }
  } else {
    return state
  }
}

export function creditOverLimitlist (state = {
  data: {},
  num: 0
}, action) {
  if (action.type === 'GET_CREDIT_OVER_LIMITLIST') {
    return {
      data: action.data,
      num: action.num
    }
  } else {
    return state
  }
}
/** ================================ utils =================================== */

function getEdgeByType (edges, id, type) {
  return edges.filter((e) => (e._from === id || e._to === id) && e._id.includes(type))
}

function traversalTree (data, cb, prev) {
  cb(data, prev)
  data.children && data.children.forEach((d) => {
    traversalTree(d, cb, data)
  })
}

function cutChildren (data, maxLength, name, ratioCb) {
  if (!data.children) {
    return
  }
  const len = data.children.length
  if (len > maxLength) {
    const cuttedChildren = data.children.slice(maxLength - 1)
    data.children = data.children.slice(0, maxLength - 1)
    data.children.push({
      properties: {
        name: `其他${len - maxLength + 1}个${name}`,
        ratio: ratioCb && ratioCb(cuttedChildren)
      },
      otherChild: cuttedChildren
    })
  }
}
