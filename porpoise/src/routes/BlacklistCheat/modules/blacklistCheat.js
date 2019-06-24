import { GraphUtil } from 'components/Chart/GraphUtil'
import { setRenderChartStatus } from 'actions/Chart'

const findRelationPath = `/api/blacklist/relation`

const RELATION_CLUSTER = 'GET_RELATION_CLUSTER_SUCCESS'
const RELATION_PATH_LIST = 'GET_RELATION_PATH_LIST'
const START_END_COMPANY_ID = 'SET_START_END_COMPANY_ID'

// 暂存找关系得到的路径数据
// 先这么写吧，日后优化
let originPathList = []

export function findRelation (name) {
  return (dispatch) => {
    dispatch(setRenderChartStatus('pending'))
    const url = `${findRelationPath}/?id=${name}`
    fetchData(dispatch, url, (pathList) => {
      originPathList = pathList
      if (!pathList.length) {
        dispatch({
          type: 'GET_CHART_DATA_FAIL',
          msg: '当前公司不与黑名单库相连'
        })
      }
      let chartData = rebuildChartFromPathList(pathList)
      chartData = GraphUtil.preprocessChartData(chartData)
      setStartEndCompany(dispatch, name, pathList)
      dispatch({
        type: RELATION_CLUSTER,
        chartData: chartData
      })
      dispatch({
        type: 'SET_OPERATE_CHART_STATUS',
        status: 'show_origin' + new Date()
      })
      dispatch({
        type: RELATION_PATH_LIST,
        pathList
      })
    })
  }
}

export function setStartEndCompany (dispatch, startName, pathList) {
  if (!pathList.length) return
  const startPath = pathList[0].risk_path.find((path) => path.src_name === startName || path.dst_name === startName)
  const startCompanyId = startPath.dst_name === startName ? startPath._to : startPath._from
  const endCompanyId = []
  pathList.forEach((l) => {
    const name = l.black_member_name
    const path = l.risk_path.find((path) => path.src_name === name || path.dst_name === name)
    let id = path._from
    if (path.dst_name === name) {
      id = path._to
    }
    if (!endCompanyId.includes(id)) {
      endCompanyId.push(id)
    }
  })
  dispatch({
    type: START_END_COMPANY_ID,
    startEndId: {
      startName,
      startId: startCompanyId,
      endId: endCompanyId
    }
  })
}

export function showPathChart (idx) {
  return (dispatch) => {
    let path = [originPathList[idx]]
    let chartData = rebuildChartFromPathList(path)
    chartData = GraphUtil.preprocessChartData(chartData)
    dispatch({
      type: RELATION_CLUSTER,
      chartData: chartData
    })
    dispatch({
      type: 'SET_OPERATE_CHART_STATUS',
      status: 'show_origin' + new Date()
    })
  }
}

export function showAll () {
  return (dispatch) => {
    let chartData = rebuildChartFromPathList(originPathList)
    chartData = GraphUtil.preprocessChartData(chartData)
    dispatch({
      type: RELATION_CLUSTER,
      chartData: chartData
    })
    dispatch({
      type: 'SET_OPERATE_CHART_STATUS',
      status: 'show_origin' + new Date()
    })
  }
}

function rebuildChartFromPathList (pathList) {
  let vertexes = []
  const edges = []
  pathList.forEach((paths) => {
    const chartData = rebuildChart(paths.risk_path)
    vertexes.push(...chartData.vertexes)
    edges.push(...chartData.edges)
  })
  vertexes = GraphUtil.getUnique(vertexes)
  return {
    vertexes: vertexes,
    edges: edges
  }
}

/**
 * 根据路径重建图
 * @param {Array} path 路径
 * @return {Object} 重建的图数据
 */
function rebuildChart (path) {
  const vertexIds = []
  const edgeIds = []
  const vertexes = []
  const edges = []

  path.forEach((path) => {
    if (!vertexIds.includes(path._from)) {
      vertexes.push({
        _id: path._from,
        name: (path.src_name || path._from) + (path.src_belong ? ' [行内企业]' : ''),
        belong_gdrc: path._from.includes('Company') && !path.src_belong
      })
      vertexIds.push(path._from)
    }
    if (!vertexIds.includes(path._to)) {
      vertexes.push({
        _id: path._to,
        name: (path.dst_name || path._to) + (path.dst_belong ? ' [行内企业]' : ''),
        belong_gdrc: path._to.includes('Company') && !path.dst_belong
      })
      vertexIds.push(path._to)
    }
    const pathId = path._id
    let label = ''
    if (path.attr === 'invest') {
      label += '投资 ' + path.invest_amount
    } else if (path.attr === 'officer') {
      label += path.position
    } else if (path.attr === 'linked') {
      label = '地址和电话相同'
    }
    if (!edgeIds.includes(pathId)) {
      edges.push({
        _id: pathId,  // id是数字，需要已字母开头
        _from: path._from,
        _to: path._to,
        label: label
      })
      edgeIds.push(pathId)
    }
  })

  return {
    vertexes: vertexes,
    edges: edges
  }
}

/**
 * GET 通用方法
 * @param {*} dispatch dispatch
 * @param {String} url url
 * @param {Function} success 成功回调函数
 * @param {Function} fail 失败回调函数
 */
function fetchData (dispatch, url, success, fail) {
  fetch(url, {
    method: 'GET',
    // mode: 'no-cors'
  }).then((response) => {
    if (!response.ok) {
      throw Error(response.status)
    }
    return response.json()
  }).then((data) => {
    if (data.status) {
      throw Error(data.msg)
    }
    success && success(data.data)
  }).catch((e) => {
    console.error(e)
    fail && fail(e)
  })
}

// reducers
export function originChartData (state = {}, action) {
  if (action.type === RELATION_CLUSTER) {
    return Object.assign({}, action.chartData)
  } else {
    return state
  }
}

export function relationPathList (state = [], action) {
  if (action.type === RELATION_PATH_LIST) {
    return action.pathList
  } else {
    return state
  }
}

export function startEndId (state = {}, action) {
  if (action.type === START_END_COMPANY_ID) {
    return action.startEndId
  } else {
    return state
  }
}
