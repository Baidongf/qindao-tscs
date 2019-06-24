/**
 * @file Card
 * @author haizhi
 */
import {
  COMPANY_BRIEF_PATH,
  PERSON_BRIEF_PATH,
  FIND_RELATION_PATH,
  FIND_GUARANTEE_PATH,
  PERSON_MERGE_SUGGESTED_LIST,
  CASE_BRIEF_PATH,
  CLUSTER_PATH,
  CLUSTER_ITEM_PATH,
  CLUSTER_CID_PATH,
  GET_DETAIL_LIST_PARH,
  FILTER_EDGE_DETAIL_PATH,
  LP_PARAMS
} from '../config'

import {
  setRenderChartStatus,
  setOriginChartData,
  setOperateChartStatus,
  getChartDataFail,
  toggleGraphType,
  setDisplayChartData
} from './Chart'

import {
  caseTypeMap
} from '../card.config'

import { authorizedFetch } from './Global'
import chartService from 'services/chart'

const clusterParam = LP_PARAMS.Company_cluster

export function getBriefIsLoading (bool) {
  return {
    type: 'GET_BRIEF_IS_LOADING',
    isLoading: bool
  }
}

export function getBriefSuccess (data) {
  return {
    type: 'GET_BRIEF_SUCCESS',
    data
  }
}

export function getCompanyBriefSuccess (data) {
  return {
    type: 'GET_COMPANY_BRIEF_SUCCESS',
    data
  }
}

export function toggleCardType (cardType) {
  return {
    type: 'TOGGLE_CARD_TYPE',
    cardType
  }
}

export function setRelationSrcName (companyName) {
  return {
    type: 'SET_RELATION_SRC_NAME',
    companyName
  }
}

function briefAdaptor (data) {
  return {
    legal_man: data.legal_person, // 法定代表人,
    registered_capital: data.reg_capital, // 注册资本
    registered_date: data.reg_date, // 注册日期
    registered_code: data.reg_no, // 注册号
    business_status: data.oper_status, // 经营状态,
    unified_social_credit_code: data.unified_social_code, // 统一社会信用代码
    business_scope: data.oper_range, // 经营范围
    company:data.name
  }
}

export function getCompanyBrief (companyName) {
  return (dispatch, getState) => {
    dispatch(getBriefIsLoading(true))
    if (!companyName) {
      companyName = getState().initCompanyName
    }
    let url = `${COMPANY_BRIEF_PATH}?company=${encodeURIComponent(companyName)}`
    fetchCardData(dispatch, url, (data) => {
      data = briefAdaptor(data)
      dispatch(getCompanyBriefSuccess(data))
      dispatch(toggleCardType('Company'))
      dispatch({
        type: 'SET_RELATION_SRC_NAME',
        companyName: data.company
      })
    }, (e) => {
      dispatch(getCompanyBriefSuccess({ company: companyName }))
      dispatch(toggleCardType('Company'))
      dispatch({
        type: 'SET_RELATION_SRC_NAME',
        companyName: companyName
      })
    })
  }
}

export function getPersonBrief (personId) {
  return (dispatch) => {
    dispatch(getBriefIsLoading(true))
    let url = `${PERSON_BRIEF_PATH}?id=${personId}`
    fetchCardData(dispatch, url)
  }
}

export function getMergeSuggestedList (personId) {
  return (dispatch) => {
    dispatch(getBriefIsLoading(true))
    let url = `${PERSON_MERGE_SUGGESTED_LIST}/?id=${personId}`
    fetchCardData(dispatch, url)
  }
}

export function getCaseBrief (id, cardType) {
  return (dispatch) => {
    dispatch(getBriefIsLoading(true))
    let url = `${CASE_BRIEF_PATH}?collection=${caseTypeMap[cardType].collection}&record_id=${id}`
    fetchCardData(dispatch, url)
  }
}

/**
 * 获取族谱名列表
 * @param {Number} offset 当前页起始位置
 * @param {Number} count 当前页的个数
 * @return {Function} action
 */
export function getCompanyCluster (offset = 0, count = 10) {
  return (dispatch) => {
    let url = `
      ${CLUSTER_PATH}?domain_name=${clusterParam.domain_name}&type=zupu&offset=${offset}&count=${count}
    `
    fetchCardData(dispatch, url, (data) => {
      dispatch({
        type: 'GET_COMPANY_CLUSTER_SUCCESS',
        clusterNames: data.data,
        total: data.total_count
      })
    })
  }
}

/**
 * POST 担保或转账信息查询
 * @param {Object} postBody
 */
export function getDetailList (postBody) {
  return (dispatch, getState) => {
    dispatch(getBriefIsLoading(true))
    let headers = new Headers({
      'Content-Type': 'application/json'
    })
    let url = `${GET_DETAIL_LIST_PARH}`
    authorizedFetch(url, {
      method: 'POST',
      headers: headers,
      mode: 'cors',
      body: JSON.stringify(postBody)
    }).then((data) => {
      if (data.status !== 0) throw Error(data.msg)
      dispatch(getBriefSuccess(data.data || {}))
    }).catch((e) => {
      console.error(e)
    })
  }
}

/**
 * 根据条件查询图详情列表
 * http://wiki.haizhi.com/pages/viewpage.action?pageId=5704148#id-图谱配置接口-5.根据条件查询图详情列表
 * @param {Object} body post body
 * @return {Function} dispatch
 */
export function filterEdgeDetail (body) {
  return (dispatch) => {
    fetchCardData(dispatch, {
      url: FILTER_EDGE_DETAIL_PATH,
      postBody: {
        method: 'POST',
        body: JSON.stringify(body),
      }
    })
  }
}

/**
 * 获取族谱企业数据
 * @param {String} id cluster id
 * @return {Function} dispatch
 */
export function getCompanyClusterItem (id) {
  return (dispatch) => {
    let url = `${CLUSTER_ITEM_PATH}/?cid=${id}&result_type=graph&domain_name=${clusterParam.domain_name}&type=zupu`
    fetchCardData(dispatch, url, (data) => {
      dispatch({
        type: 'GET_CLUSTER_ITEM_SUCCESS',
        clusterItem: {
          cid: id,
          data: data
        }
      })
    })
  }
}

/**
 * 通过公司名称获取族谱群中心企业 id
 * @param {String} name 公司名称
 * @return {Function} dispatch
 */
export function getCompanyClusterByName (name) {
  return (dispatch) => {
    let url = `${CLUSTER_CID_PATH}?domain_name=${clusterParam.domain_name}&type=zupu&entity_name=${name}`
    fetchCardData(dispatch, url, (data) => {
      if (data) {
        dispatch({
          type: 'GET_COMPANY_CLUSTER_SUCCESS',
          clusterNames: [{ cluster_name: data.cluster_name, cluster_cid: data.cluster_cid }],
          total: 1
        })
        dispatch({
          type: 'GET_CLUSTER_ID_SUCCESS',
          id: data.cluster_name // risk_analysis 中 name 做族谱 id
        })
      } else {
        dispatch({
          type: 'GET_CLUSTER_ID_SUCCESS',
          id: -1  // 如果搜索结果不存在，返回值无 data 属性
        })
      }
    })
  }
}

/**
 * GET 卡片详情的通用方法
 * @param {*} dispatch dispatch
 * @param {Object} req request url or { url: url, body: body }
 * @param {Function} success 成功回调函数
 * @param {Function} fail 失败回调函数
 */
export function fetchCardData (dispatch, req, success, fail) {
  let url, postBody
  if (typeof req === 'string') {
    url = req
  } else {
    url = req.url || ''
    postBody = req.postBody || {}
  }
  authorizedFetch(url, postBody).then((data) => {
    dispatch(getBriefIsLoading(false))
    if (data.status) {
      throw Error(data.msg)
    }
    if (success) {
      success(data.data)
    } else {
      dispatch(getBriefSuccess(data.data))
    }
  }).catch((e) => {
    fail && fail(e)
    // dispatch(getCardDataFail(e.message)) // 测试说，不要放出来
  })
}

export function getCardDataFail (msg) {
  return {
    type: 'GET_CARD_DATA_FAIL',
    msg
  }
}

// 找关系
export function findRelation (companyNames, traceDepth = 10, options) {
  return (dispatch, getState) => {
    let headers = new Headers({
      'Content-Type': 'application/json'
    })
    options['max_length'] = traceDepth

    /** 根据行内配置设定参数 */
    const belongBankRelation = JSON.parse(sessionStorage.getItem('belongBankRelation')) || []
    belongBankRelation.forEach((r) => {
      if (options.edges.some((e) => e.class === r.target_table)) return
      options.edges.push({
        class: r.target_table,
        visible: r.is_selected === 1 && r.is_show === 1,
        traceDepth: 1
      })
    })
    dispatch({
      type: 'GET_BELONG_BANK_RELATION_SUCCESS',
      data: belongBankRelation
    })
    const globalOptions = getState().FilterOptions
    globalOptions.edges = Object.assign(JSON.parse(JSON.stringify(options.edges)), globalOptions.edges)
    dispatch({
      type: 'CHANGE_FILTER_OPTIONS',
      options: globalOptions
    })

    companyNames = companyNames.filter((name) => name !== undefined)
    const params = {
      method: 'POST',
      headers: headers,
      mode: 'cors',
      body: JSON.stringify({
        options: options
      })
    }
    const config = {
      companyNames,
      host: FIND_RELATION_PATH,
      params,
      belongBankRelation
    }
    fetchRelationData(config, dispatch)
  }
}

// 查询担保环
export function findGuarantee (companyNames) {
  return (dispatch) => {
    let headers = new Headers({
      'Content-Type': 'application/json'
    })
    companyNames = companyNames.filter((name) => name !== undefined)
    const params = {
      method: 'GET',
      headers: headers,
      mode: 'cors'
    }
    const config = {
      companyNames,
      host: FIND_GUARANTEE_PATH,
      params
    }
    fetchRelationData(config, dispatch)
  }
}

function fetchRelationData (config = {}, dispatch) {
  let p = []
  const { companyNames, host, params, belongBankRelation } = config
  dispatch(setRenderChartStatus('pending'))
  for (let i = 0; i < companyNames.length; i++) {
    if (companyNames[i + 1] && companyNames[i] === companyNames[i + 1]) continue  // 连续两个相同公司，跳过本次

    let url = ''
    if (i === 0 || i === companyNames.length - 1) { // 起点，终点都单独请求一次，以便接口超时的时候至少可以画出两个点
      url = `${host}?company1=${companyNames[i]}`
      p.push(getRelation(url))
    }
    if (i < companyNames.length - 1) {
      url = `${host}?company1=${companyNames[i]}&company2=${companyNames[i + 1]}`
      p.push(getRelation(url))
    }

    function getRelation (url) {
      return authorizedFetch(encodeURI(url), params)
        .then((data) => {
          if (data.status) {
            throw Error(data.msg)
          }
          return data.data
        }).catch((e) => {
          dispatch(getChartDataFail(e.message))
        })
    }
  }
  Promise.all(p).then((res) => {
    const data = res.reduce((acc, val) => {
      val = val || { edges: [], vertexes: [] }
      return {
        edges: acc.edges.concat(val.edges),
        vertexes: acc.vertexes.concat(val.vertexes)
      }
    }, {
      edges: [],
      vertexes: []
    })
    dispatch(toggleGraphType(false))

    const chartData = chartService.preprocess(data, null, { belongBankRelation })
    dispatch(setOriginChartData(chartData.vertexes, chartData.edges))

    dispatch(setOperateChartStatus('show_origin' + Date.now()))
    if (!data.edges.length) {
      dispatch(getChartDataFail(`在设定的条件下，未发现两家企业间存在关系`))
    }
  }, (err) => {
    throw Error(err)
  }).catch((e) => {
    console.error(e)
    dispatch(getChartDataFail('找关系失败'))
  })
}

export function selectCenterTreeNode (vertex) {
  return {
    type: 'SELECT_CENTER_TREE_NODE',
    vertex
  }
}

/**
 * 在族谱群中选中居中显示的公司
 * @param {String} id vertex id
 * @return {Object} action
 */
export function selectCenterClusterNode (id) {
  return {
    type: 'SELECT_CENTER_CLUSTER_NODE',
    id
  }
}

/**
 * 在族谱群中选中需要显示的公司
 * @param {String} id vertex id
 * @param {String} showType invest or officer
 * @return {Object} action
 */
export function selectPersonClusterNode (id, showType) {
  return {
    type: 'SELECT_PERSON_CLUSTER_NODE',
    id,
    showType
  }
}

/**
 * 从群体关系卡片中选出一条边
 * @param {Object} chartData chart data
 * @return {Object} action obj
 */
export function selectMergeData (chartData) {
  return (dispatch, getState) => {
    const { selectedMergeData, displayChartData, mergeChartData } = getState()
    const newChart = {}
    newChart.edges = displayChartData.edges.filter((e) => !e._id.includes('mergeEdge'))
      .concat(mergeChartData.edges)
      .concat(chartData.edges)
    newChart.vertexes = displayChartData.vertexes.filter((v) => !v._id.includes('mergeNode'))
      .concat(mergeChartData.vertexes)
      .concat(chartData.vertexes)
    newChart.vertexes = chartService.getUniqueById(newChart.vertexes)
    dispatch(setDisplayChartData(newChart.vertexes, newChart.edges))

    chartData.vertexes.push(...selectedMergeData.vertexes)
    chartData.edges.push(...selectedMergeData.edges)
    chartData.vertexes = chartService.getUniqueById(chartData.vertexes)
    dispatch({
      type: 'SELECT_MERGE_DATA',
      chartData
    })
  }
}

/**
 * 清空从群体关系列表中选取的边
 * @return {Object} empty data
 */
export function cleanMergeData () {
  return {
    type: 'SELECT_MERGE_DATA',
    chartData: { vertexes: [], edges: [] }
  }
}
