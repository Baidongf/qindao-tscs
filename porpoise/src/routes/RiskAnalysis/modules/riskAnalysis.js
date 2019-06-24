import { GraphUtil } from 'components/Chart/GraphUtil'

const clusterNamesPath = '/api/riskAnalysis/analyList'
const CLUSTER_ITEM_PATH = '/api/riskAnalysis/analyGroup'
const CLUSTER_DATA_ITEM_PATH = '/api/riskAnalysis/analyGraph'
const CREDIT_DATA_ITEM_PATH = '/api/riskAnalysis/credit'

export const RISKANALYSIS_CLUSTER_NAMES = 'GET_RISKANALYSIS_CLUSTER_NAMES_SUCCESS'
export const RISKANALYSIS_GET_CLUSTER_ITEM_SUCCESS = 'RISKANALYSIS_GET_CLUSTER_ITEM_SUCCESS'
export const GET_CLUSTER_CHART_DATA_SUCCESS = 'GET_CLUSTER_CHART_DATA_SUCCESS'
export const NODE_RISK_DATA_ITEM = 'NODE_RISK_DATA_ITEM'
export const CREDIT_DATA_ITEM = 'CREDIT_DATA_ITEM'
export const CREDIT_CARD_DATA_ITEM = 'CREDIT_CARD_DATA_ITEM'


/**
 * 获取公司列表
 * @return {Function} dispatch
 */
export function getClusterNames () {
  return (dispatch) => {
    let url = `${clusterNamesPath}`
    getData(dispatch, url, (data) => {
      dispatch({
        type: RISKANALYSIS_CLUSTER_NAMES,
        clusterNames: data
      })
    })
  }
}
/**
 * 获取集团下的group
 * @param {*} id 
 */
export function getCompanyClusterItem (id) {
  return (dispatch) => {
    let url = `${CLUSTER_ITEM_PATH}/?id=${id}`
    getData(dispatch, url, (data) => {
      dispatch({
        type: RISKANALYSIS_GET_CLUSTER_ITEM_SUCCESS,
        clusterItem: {
          id: id,
          data: data
        }
      })
    })
  }
}

/**
 * 获取族谱群数据
 * @param  {String} id 族谱群id
 * @return {Function} dispatch
 */
export function getClusterChart (id) {
  return (dispatch, getState) => {
    const url = `${CLUSTER_DATA_ITEM_PATH}/?id=${id}`
    getData(dispatch, url, (data) => {
      const chartData = {}
      const newData = GraphUtil.preprocessChartData(data)
      chartData[id] = newData
      dispatch({
        type: 'GET_CLUSTER_CHART_DATA_SUCCESS',
        chartData
      })
      dispatch({
        type: CREDIT_DATA_ITEM,
        creditData: data.shouxin
      })
    })
  }
}

// 获取某公司下的详细授信信息
export function getRiskNodeDetail (object) {
  return (dispatch, getState) => {
    const url = `${CREDIT_DATA_ITEM_PATH}/?id=${object.name}`
    getData(dispatch, url, (data) => {
        dispatch({
          type: 'CREDIT_DATA_ITEM',
          creditData: data
        })
        data['name'] = object.name
        dispatch({
          type: 'NODE_RISK_DATA_ITEM',
          chartData: data
        })
    })
    dispatch({
      type: 'CREDIT_CARD_DATA_ITEM',
      creditData: 'Credit'
    })
  }
}

export function toggleCard (creditData) {
  return (dispatch, getState) => {
    dispatch({
        type: 'CREDIT_CARD_DATA_ITEM',
        creditData: creditData
      })
  }
}

export function getCreditCardNames (state = '', action) {
  if (action.type === CREDIT_CARD_DATA_ITEM) {
    return action.creditData;
  } else {
    return state
  }
}

export function getCreditDataNames (state = {}, action) {
  if (action.type === CREDIT_DATA_ITEM) {
    return Object.assign({}, action.creditData);
  } else {
    return state
  }
}

export function getRiskNodeDetailNames (state = {}, action) {
  if (action.type === NODE_RISK_DATA_ITEM) {
    return Object.assign({}, action.chartData);
  } else {
    return state
  }
}

export function getClusterChartNames (state = {}, action) {
  if (action.type === GET_CLUSTER_CHART_DATA_SUCCESS) {
    return Object.assign({}, action.chartData);
  } else {
    return state
  }
}

export function getCompanyClusterItemNames (state = {}, action) {
  if (action.type === RISKANALYSIS_GET_CLUSTER_ITEM_SUCCESS) {
    return action.clusterItem
  } else {
    return state
  }
}

export function guaranteeRiskClusterNames (state = [], action) {
  if (action.type === RISKANALYSIS_CLUSTER_NAMES) {
    return action.clusterNames
  } else {
    return state
  }
}

// 请求function 
function getData (dispatch, url, success, fail) {
  dispatch({
    type: 'SET_RENDER_CHART_STATUS',
    status: 'pending'
  })
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    // mode: 'no-cors'
  }).then((response) => {
    dispatch({
      type: 'SET_RENDER_CHART_STATUS',
      status: 'success'
    })
    if (!response.ok) {
      throw Error(response.status)
    }
    return response.json()
  }).then((data) => {
    dispatch({
      type: 'SET_RENDER_CHART_STATUS',
      status: 'success'
    })
    if (data.status) {
      throw Error(data.msg)
    }
    success && success(data.data)
  }).catch((e) => {
    dispatch({
      type: 'SET_RENDER_CHART_STATUS',
      status: 'success'
    })
    fail && fail(e)
  })
}