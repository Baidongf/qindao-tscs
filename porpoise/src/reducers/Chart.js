import undoable, { includeAction } from 'redux-undo'

export function renderChartStatus (state = { status: '' }, action) {
  switch (action.type) {
    case 'GET_CHART_DATA_FAIL':
      return { status: 'fail', msg: action.msg }
    case 'GET_CARD_DATA_FAIL':
      return { status: 'fail', msg: action.msg }
    case 'SET_RENDER_CHART_STATUS':
      return { status: action.status }
    default:
      return state
  }
}

const initExpandChartData = { vertexes: [], edges: [] }
export function expandChartData (state = initExpandChartData, action) {
  if (action.type == 'GET_EXPAND_CHART_DATA_SUCCESS') {
    return action.data
  } else if (action.type == 'CLEAR_EXPAND_DATA') {
    return initExpandChartData
  } else {
    return state
  }
}

export function curNode (state = {}, action) {
  if (action.type == 'SET_CURNODE') {
    return Object.assign({}, action.vertex)
  } else {
    return state
  }
}

export function curEdge (state = {}, action) {
  if (action.type == 'SET_CUREDGE') {
    return Object.assign({}, action.edge)
  } else {
    return state
  }
}

export function isTreeGraph (state = false, action) {
  if (action.type == 'TOGGLE_GRAPH_TYPE') {
    return action.isTree
  } else {
    return state
  }
}

export function isPhotoGraph (state = false, action) {
  if (action.type == 'TOGGLE_PHOTO_TYPE') {
    return action.isPhoto
  } else {
    return state
  }
}

export function clusterChartData (state = {}, action) {
  if (action.type === 'GET_CLUSTER_CHART_DATA_SUCCESS') {
    return Object.assign({}, action.chartData)
  } else {
    return state
  }
}

export function reRenderChart (state = false, action) {
  if (action.type === 'SET_RE_RENDER_CHART') {
    return action.reRenderChart
  } else {
    return state
  }
}

/**
 * 获取群体关系格式化后的初始数据
 * @param {Object} state state
 * @param {Object} action action
 * @return {Object} init merge chart data
 */
export function mergeChartData (state = { vertexes: [], edges: [] }, action) {
  if (action.type === 'SET_MERGE_CHART_DATA') {
    return action.data
  } else {
    return state
  }
}

/**
 * 格式化之后的图数据
 * @param {Object} state state
 * @param {Object} action action
 * @return {Object} formatted chart data {vertexes: [], edges: []}
 */
export function originChartData (state = { vertexes: [], edges: [] }, action) {
  if (action.type === 'SET_FORMAT_CHART_DATA') {
    return action.data
  } else {
    return state
  }
}

/** 展示在图中的数据，重构中，部分使用 */
export function displayChartData (state = { vertexes: [], edges: [] }, action) {
  if (action.type === 'SET_DISPLAY_CHART_DATA') {
    return action.data
  } else {
    return state
  }
}
export const undoableOriginChartData = undoable(originChartData, { filter: includeAction(['SET_FORMAT_CHART_DATA']) })

/**
 * 当前对图谱的操作状态
 * @param {String} state init / expand
 * @param {Object} action action
 * @return {String} chart operation status
 */
export function operateChartStatus (state = '', action) {
  if (action.type === 'SET_OPERATE_CHART_STATUS') {
    return action.status
  } else {
    return state
  }
}

export function expandAllModalStatus (state = {}, action) {
  if (action.type === 'SET_EXPAND_ALL_MODAL_STATUS') {
    return action.data
  } else {
    return state
  }
}

// 是否节点过多
export function nodeStatus (state = false, action) {
  if (action.type === 'SET_NODE_STATUS') {
    return action.isNodeMax
  } else {
    return state
  }
}
