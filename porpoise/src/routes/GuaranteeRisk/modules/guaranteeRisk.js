import { GraphUtil } from 'components/Chart/GraphUtil'
import { authorizedFetch } from 'actions/Global'
import { LP_PARAMS, BELONG_BANK } from 'config'
import { API_ADDRESS } from '../../../../global_config'

const domainName = LP_PARAMS.Company_cluster.domain_name

const clusterPath = `${API_ADDRESS}/api/graph/cluster_path`
const getPathsByNamePath = `${API_ADDRESS}/api/graph/entity_paths`
const getClusterByEntityPath = `${API_ADDRESS}/api/graph/find_group`
const guaranteeCountPath = `${API_ADDRESS}/api/graph/path_types`

export const GUARANTEE_CLUSTER_NAMES = 'GET_GUARANTEE_CLUSTER_NAMES_SUCCESS'
export const GUARANTEE_CLUSTER = 'GET_GUARANTEE_CLUSTER_SUCCESS'
export const GUARANTEE_CLUSTER_CHART = 'GET_GUARANTEE_CLUSTER_CHART_SUCCESS'
export const GUARANTEE_CLUSTER_NAME_BY_ENTITY = 'GET_CLUSTER_NAME_BY_ENTITY_SUCCESS'
export const HIGHLIGHT_LINKS = 'HIGHLIGHT_LINKS'
export const GUARANTEE_PATH_COUNT = 'GET_GUARANTEE_PATH_COUNT_SUCCESS'
const GET_GUARANTEE_PATHS_SUCCESS = 'GET_GUARANTEE_PATHS_SUCCESS'

// actions

/**
 * 获取担保路径
 * @param {String} pathType 路径类型
 * @param {Number} offset 当前页面偏移数
 * @param {Number} count 当前页面目标数
 * @return {Function} dispatch
 */
export function getGuaranteePaths (pathType, offset = 0, count = 10) {
  return (dispatch, getState) => {
    let url = `
      ${clusterPath}?domain_name=${domainName}&type=danbao&path_type=${pathType}&offset=${offset}&count=${count}
    `
    authorizedFetch(url).then((data) => {
      const guaranteePaths = getState().guaranteePaths
      guaranteePaths[pathType] = data.data.data
      dispatch({
        type: GET_GUARANTEE_PATHS_SUCCESS,
        guaranteePaths
      })
    })
  }
}

/**
 * 根据企业名称搜索包含它的所有路径
 * @param {String} name 企业名称
 * @return {Function} dispatch
 */
export function getPathsByName (name) {
  return (dispatch, getState) => {
    let url = `${getPathsByNamePath}?entity_name=${name}&domain_name=${domainName}&type=danbao` // mock 暂时是entity_id，应该为 entity_name
    authorizedFetch(url).then((data) => {                                                       //现改为entity_name
      const paths = data.data
      const count = {}
      const guaranteePaths = {}
      Object.keys(getState().pathTypeMap).forEach((pathType) => {
        guaranteePaths[pathType] = []
      })
      paths.forEach((path) => {
        guaranteePaths[path.type].push(path)
      })
      for (let type in guaranteePaths) {
        count[type] = guaranteePaths[type].length
      }
      dispatch({
        type: GET_GUARANTEE_PATHS_SUCCESS,
        guaranteePaths
      })
      dispatch({
        type: GUARANTEE_PATH_COUNT,
        count
      })
    })
  }
}

export function getCluster (id) {
  return (dispatch) => {
    let url = `${clusterPath}?id=${id}`
    fetchData(dispatch, url, (data) => {
      dispatch({
        type: GUARANTEE_CLUSTER,
        clusterItem: {
          cid: id,
          data: data
        }
      })
    })
  }
}

/**
 * 获取担保路径数量统计
 * @return {Function} dispatch
 */
export function getGuaranteePathCount () {
  return (dispatch) => {
    let url = `${guaranteeCountPath}?domain_name=${domainName}&type=danbao`
    authorizedFetch(url).then((data) => {
      const count = data.data
      const pathTypes = Object.keys(pathTypeMap())
      pathTypes.forEach((type) => {
        if (!(type in count)) {
          count[type] = 0
        }
      })
      dispatch({
        type: GUARANTEE_PATH_COUNT,
        count
      })
    })
  }
}

/**
 * 获取担保群图数据
 * @param  {String} pathId 担保群id
 * @return {Function} dispatch
 */
export function getClusterChart (pathId) {
  return (dispatch, getState) => {
    const [type, id] = pathId.split('/')
    let path = getState().guaranteePaths[type].find((path) => path.id === Number(id)).paths
    path = JSON.parse(path)
    const companyId = path[0]._from

    let url = `${getClusterByEntityPath}?entity_id=${companyId}&domain_name=${domainName}&type=danbao`
    authorizedFetch(url).then((data) => {
      if (!data.data) {
        dispatch({
          type: 'GET_CHART_DATA_FAIL',
          msg: '获取图谱失败'
        })
        return
      }
      const paths = []
      data.data && JSON.parse(data.data.paths).forEach((p) => paths.push(p))
      data = rebuildChart(paths, data.data.vertexes)
      const newData = GraphUtil.preprocessChartData(data)
      newData.vertexes && newData.vertexes.forEach((v) => v[BELONG_BANK] = true)
      const chartData = {}
      chartData[id] = newData
      dispatch({
        type: GUARANTEE_CLUSTER_CHART,
        chartData
      })
    })
  }
}

/**
 * 根据路径重建图
 * @param {Array} path 路径
 * @param {Array or undefined} vertexes 图数据；如果在库中不存在，为 undefiend
 * @return {Object} 重建的图数据
 */
function rebuildChart (paths, vertexes = []) {
  const vertexIds = []
  const edgeIds = []
  const edges = []

  paths.forEach((path) => {
    if (!vertexes.length) { // 如果没有图数据，从 paths 中重构图
      if (!vertexIds.includes(path._from)) {
        vertexes.push({
          _id: path._from,
          name: path.src_name
        })
        vertexIds.push(path._from)
      }
      if (!vertexIds.includes(path._to)) {
        vertexes.push({
          _id: path._to,
          name: path.dst_name
        })
        vertexIds.push(path._to)
      }
    }
    const pathId = path._id.includes('guarantee/') ? path._id : 'guarantee/' + path._id
    if (!edgeIds.includes(pathId)) {
      edges.push({
        _id: pathId,  // id需要以字母开头
        _from: path._from,
        _to: path._to,
        label: path.label || '担保'
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
 * 清空某个族谱群数据
 * @param {String} id 族谱群id
 * @return {Function} dispatch
 */
export function hideClusterChart (id) {
  return (dispatch, getState) => {
    const chartData = {}
    dispatch({
      type: GUARANTEE_CLUSTER_CHART,
      chartData
    })
  }
}

/**
 * 清空所有族谱群数据
 * @return {Object} action
 */
export function clearClusterChart () {
  return (dispatch, getState) => {
    dispatch({
      type: GUARANTEE_CLUSTER_CHART,
      chartData: {}
    })
    dispatch({
      type: 'GET_CLUSTER_CHART_DATA_SUCCESS',
      chartData: {}
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
    let url = `${getClusterByEntityPath}?id=${name}`
    fetchData(dispatch, url, (data) => {
      dispatch({
        type: GUARANTEE_CLUSTER_NAME_BY_ENTITY,
        clusterNames: data
      })
    })
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

function postData (dispatch, url, postBody, success, fail) {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postBody)
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

/**
 * 输入要高亮的路径id，高亮路径
 * @param {edges} edges edge ids
 * @return {Object} action
 */
export function selectLinksToHighlight (edges = []) {
  return {
    type: HIGHLIGHT_LINKS,
    edges
  }
}

// reducers

// 族谱簇列表名称
export function guaranteeRiskClusterNames (state = {}, action) {
  if (action.type === GUARANTEE_CLUSTER_NAMES) {
    return {
      names: action.clusterNames,
      total: action.total
    }
  } else {
    return state
  }
}

export function guaranteeClusterItem (state = {}, action) {
  if (action.type === GUARANTEE_CLUSTER) {
    const path = action.clusterItem.data.path
    const ids = []
    const clusterItems = []
    path.forEach((path) => {
      if (!ids.includes(path._from)) {
        clusterItems.push({
          _id: path._from,
          name: path.src_name || path._from
        })
        ids.push(path._from)
      }
      if (!ids.includes(path._to)) {
        clusterItems.push({
          _id: path._to,
          name: path.dst_name || path._to
        })
        ids.push(path._to)
      }
    })
    return {
      id: action.clusterItem.cid,
      // 重建图vertexes
      data: clusterItems
    }
  } else {
    return state
  }
}

export function guaranteeClusterChartData (state = {}, action) {
  if (action.type === GUARANTEE_CLUSTER_CHART) {
    return Object.assign({}, action.chartData)
  } else {
    return state
  }
}

/**
 * 通过企业名称获取族谱群中心企业 id
 * @param {String} state center id
 * @param {Object} action action
 * @return {String} id
 */
export function clusterNameRes (state = [], action) {
  if (action.type === GUARANTEE_CLUSTER_NAME_BY_ENTITY) {
    return action.clusterNames
  } else {
    return state
  }
}

export function highlightLinkIds (state = [], action) {
  if (action.type === HIGHLIGHT_LINKS) {
    return action.edges
  } else {
    return state
  }
}

export function pathTypeMap (state = [], action) {
  return {
    // 'mutual_guarantee': '互保',
    // 'joint_guarantee': '多客户间联保',
    // 'chain_guarantee': '多客户间担保链',
    // 'radial_guarantee': '发散',
    'circle': '关联担保'
  }
}

export function guaranteePathCount (state = {}, action) {
  if (action.type === GUARANTEE_PATH_COUNT) {
    return action.count
  } else {
    return state
  }
}

/**
 * 担保路径
 * @param {Object} state state
 * @param {Object} action action
 * @return {Object} 担保路径，key 为路径类别
 */
export function guaranteePaths (state = {}, action) {
  if (action.type === GET_GUARANTEE_PATHS_SUCCESS) {
    return action.guaranteePaths
  } else {
    return state
  }
}
