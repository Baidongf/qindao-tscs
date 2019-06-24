import {
  CHART_COMPANY_PATH, PERSON_FAMILIARS_PATH, PERSON_MERGE_SUGGESTED,
  EXPAND_PATH, CLUSTER_ITEM_PATH, INDIV_TRANSFER_CHART_PATH, LP_PARAMS, BELONG_BANK,
  GET_RELATION_LIST_PATH, EXPORT_RELATION_PATH
} from 'config'
import { edgeDigRelations } from 'graph.config'
import { toggleCardType } from 'actions/Card'
import { GraphUtil } from 'components/Chart/GraphUtil'
import chartService from 'services/chart'
import relationGroupService from 'services/relationGroup'
import { authorizedFetch } from './Global'
import doraemon from 'services/utils'
import { ActionCreators } from 'redux-undo'

const clusterParam = LP_PARAMS.Company_cluster

/**
 * 获取首屏图数据
 * - 首次打开时读取缓存, 切换筛选条件时不读缓存
 * - 落地页查看图谱读取图挖掘数据
 * - 读取缓存时单独读取行内数据
 * @param  {Object} options 筛选条件
 * @return {Function} dispatch
 */
export function getChartData (options) {
  return async (dispatch, getState) => {
    dispatch(setRenderChartStatus('pending'))
    const state = getState()
    const query = state.location.query
    const body = {
      options: options,
      company: query.company || state.initCompanyName
    }

    // api/graph/company 做了缓存, 只用于首次打开图谱; 如果已经有了 curNode, 则不是首次打开, 不查缓存
    // 截图专用页, 不读缓存
    let url = CHART_COMPANY_PATH
    // if (query.operation !== 'snapshot' && !state.curNode._id) {
    if (!state.curNode._id) {
      url += '?read_cache=true'
    } else {
      url += '?read_cache=false'
    }

    let data = { vertexes: [], edges: [] }
    try {
      data = await authorizedFetch(url, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        mode: 'cors',
        body: JSON.stringify(body)
      })
      if (data.status !== 0) throw Error(data.msg)
      data = data.data
    } catch (e) {
      console.error(e)
      dispatch(getChartDataFail('获取图谱失败'))
    }
    if(!data.vertexes) return

    const curNode = data.vertexes.find((v) => v.name === body.company)
    dispatch(setCurNode(curNode))
    dispatch(clearExpandData())

    /** 数据合并 */
    if (url.includes('read_cache=true') || query.operation === 'snapshot') {
      await mergeBelongBankData(dispatch, data, state)
      if (query.lp_type === 'Edge_dig') {
        await mergeEdgeDigData(dispatch, data, state)
      }
    }

    dispatch(setReRenderChart(true))
    const chartData = chartService.preprocess(data, curNode._id, getState())
    await chartService.getMergePerson(chartData.vertexes, chartData.edges, getState().FilterOptions)
    chartData.vertexes = chartService.getUniqueById(chartData.vertexes)
    chartData.edges = chartService.getUniqueById(chartData.edges)
    dispatch(setOriginChartData(chartData.vertexes, chartData.edges))

    const leavesId = relationGroupService.getLeavesId({ vertexes: chartData.vertexes, edges: chartData.edges })
    const mergeData = relationGroupService.mergeRelation(chartData.vertexes, chartData.edges, curNode._id, leavesId)
    relationGroupService.mergeMultiRelation(mergeData.edges)
    dispatch(updateMergeChartData(mergeData.mergeChartData.vertexes, mergeData.mergeChartData.edges))
    dispatch(setDisplayChartData(mergeData.vertexes, mergeData.edges))
  }
}

/**
 * 合并行内图数据
 * @param {Object} dispatch dispatch
 * @param {Object} data chart data
 * @param {Object} state redux state
 */
async function mergeBelongBankData (dispatch, data, state) {
  /** 获取行内数据配置 */
  let belongBankRelation = await getBelongBankRelation(dispatch, state)
  const options = {
    edges: []
  }
  belongBankRelation.forEach((r) => {
    options.edges.push({
      class: r.target_table,
      visible: r.is_selected === 1 && r.is_show === 1,
      trace_depth: 1,
      cn_name: r.name
    })
  })

  /** 获取行内数据 */
  let belongBankChartData = await getChartByOptions(dispatch, options, state)
  mergeChartData(data, belongBankChartData)
}

async function mergeEdgeDigData (dispatch, data, state) {
  const options = {
    edges: []
  }
  edgeDigRelations.forEach((r) => {
    options.edges.push({
      class: r,
      visible: true,
      trace_depth: 1
    })
  })

  let edgeDigChartData = await getChartByOptions(dispatch, options, state, false)
  mergeChartData(data, edgeDigChartData)
}

/**
 * 新老图数据合并
 * @param {Object} data chart data
 * @param {Object} newData new chart data
 */
function mergeChartData (data, newData) {
  newData.vertexes && data.vertexes.push(...newData.vertexes)
  newData.edges && data.edges.push(...newData.edges)
}

/**
 * 获取行内数据配置列表
 * @param {Object} dispatch dispatch
 * @param {Object} state redux state
 * @return {Array} 行内数据配置列表
 */
export async function getBelongBankRelation (dispatch, state = {}) {
  let belongBankRelation = state.belongBankRelation // 初始值为null
  if (belongBankRelation) return belongBankRelation

  try {
    belongBankRelation = await authorizedFetch(GET_RELATION_LIST_PATH)
    if (belongBankRelation.status) {
      throw Error(belongBankRelation.msg)
    }
    belongBankRelation = belongBankRelation.data || []
  } catch (e) {
    belongBankRelation = []
  }
  belongBankRelation.push(...[{
    is_multi: 1,
    is_selected: 0,
    is_show: 1,
    name: '担保',
    target_table: 'guarantee'
  }, {
    is_multi: 1,
    is_selected: 0,
    is_show: 1,
    name: '转账',
    target_table: 'money_flow'
  }]) // 两条固定的行内关系
  dispatch(setBelongBankRelation(belongBankRelation))

  return belongBankRelation
}

/**
 * 获取行内配置，并增加至全局筛选条件中
 * @return {Function} thunk
 */
export function addBelongBankRelationToGlobal () {
  return async (dispatch, getState) => {
    const belongBankRelation = await getBelongBankRelation(dispatch)
    const options = {
      edges: []
    }
    belongBankRelation.forEach((r) => {
      options.edges.push({
        class: r.target_table,
        visible: r.is_selected === 1 && r.is_show === 1,
        trace_depth: 1,
        cn_name: r.name,
        is_multi: r.dont_merge  // 接口是否对两个节点间的相同类型的边进行去重
      })
    })

    const globalOptions = getState().FilterOptions
    globalOptions.edges.push(...options.edges)
    dispatch({
      type: 'CHANGE_FILTER_OPTIONS',
      options: globalOptions
    })
  }
}

/**
 * 获取行内图数据
 * @param {Object} dispatch dispatch
 * @param {Object} options 筛选条件, 只包含要新增的关系
 * @param {Object} state redux state
 * @param {Boolean} updateOption 是否要更新全局options
 * @return {Object} chart data
 */
async function getChartByOptions (dispatch, options, state, updateOption = true) {
  /** 更新全局筛选条件 */
  if (updateOption) {
    const globalOptions = state.FilterOptions
    globalOptions.edges.push(...options.edges)  // 只有首次读取缓存的时候才会调用, 不用考虑重复问题
    dispatch({
      type: 'CHANGE_FILTER_OPTIONS',
      options: globalOptions
    })
  }

  const body = {
    options: options,
    company: state.location.query.company || state.initCompanyName
  }
  let data = { vertexes: [], edges: [] }
  try {
    data = await authorizedFetch(`${CHART_COMPANY_PATH}?read_cache=false`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      mode: 'cors',
      body: JSON.stringify(body)
    })
    if (data.status) throw Error(data.msg)
    data = data.data
  } catch (e) {}

  return data
}

function setBelongBankRelation (belongBankRelation) {
  sessionStorage.setItem('belongBankRelation', JSON.stringify(belongBankRelation))
  return {
    type: 'GET_BELONG_BANK_RELATION_SUCCESS',
    data: belongBankRelation
  }
}

/**
 * 设置当前对图谱的操作名称
 * init: 首次打开 / expand: 展开 / select_merge_data: 选择聚合列表中的数据显示于图中
 * change_fitler_options: 更换筛选条件 / show_origin: 啥都不做，直接显示图 【找关系、疑似可融合。。。】
 * @param {String} status status
 * @return {Object} action object
 */
export function setOperateChartStatus (status) {
  return {
    'type': 'SET_OPERATE_CHART_STATUS',
    status
  }
}

/**
 * 清空展开的图数据
 * @return {Object} action object
 */
function clearExpandData () {
  return {
    type: 'CLEAR_EXPAND_DATA'
  }
}

/**
 * 设置图谱是否需要重新渲染。变动筛选条件时需要
 * @param  {Boolean} reRenderChart 是否需要重新渲染
 * @return {Object} action object
 */
function setReRenderChart (reRenderChart) {
  return {
    type: 'SET_RE_RENDER_CHART',
    reRenderChart: reRenderChart
  }
}

/**
 * 展开节点
 * @param {Object} vertex 当前展开节点
 * @param {Object} options 筛选条件
 * @return {Function} dispatch
 */
export function expand (vertex, options) {
  return async (dispatch, getState) => {
    const url = EXPAND_PATH
    let headers = new Headers({
      'Content-Type': 'application/json'
    })
    let body = { options: Object.assign({}, options) }
    body.options.ids = [vertex._id]
    if (vertex._id.includes('Company')) body.company = vertex.name
    const params = {
      method: 'POST',
      headers: headers,
      mode: 'cors',
      body: JSON.stringify(body)
    }
    try {
      dispatch(setRenderChartStatus('pending'))
      let data = await authorizedFetch(url, params)
      if (data.status) throw Error(data.msg)
      dispatch(setReRenderChart(false))

      const originChartData = getState().originChartData
      const chartData = chartService.preprocess(data.data, vertex._id, getState())
      dispatch(getExpandChartDataSuccess(chartData))
      const curNode = chartData.vertexes.find((v) => v._id === vertex._id)
      dispatch(setCurNode(curNode))

      let newNodes = chartData.vertexes.concat(originChartData.vertexes)
      let newLinks = chartData.edges.concat(originChartData.edges)
      await chartService.getMergePerson(newNodes, newLinks, options, true)
      newNodes = chartService.getUniqueById(newNodes)
      newLinks = chartService.getUniqueById(newLinks)

      GraphUtil.mergeNodesAndEdges(newNodes, newLinks, { vertexes: newNodes, edges: newLinks }, curNode)
      dispatch(setOriginChartData(newNodes, newLinks))

      const mergeData = relationGroupService.mergeExpandAllData(newNodes, newLinks)
      relationGroupService.mergeMultiRelation(mergeData.edges)
      dispatch(updateMergeChartData(mergeData.mergeChartData.vertexes, mergeData.mergeChartData.edges))
      dispatch(setDisplayChartData(mergeData.vertexes, mergeData.edges))
    } catch (e) {
      console.error(e)
      dispatch(getChartDataFail('获取图谱失败'))
    }
  }
}

/**
 * 获取关联原因
 * @param {String} id id
 * @param {String} target target id
 * @return {Function} dispatch
 */
export function getConnectReason (id, target) {
  return (dispatch) => {
    const url = target ? `${PERSON_FAMILIARS_PATH}?id=${id}&target=${target}` : `${PERSON_FAMILIARS_PATH}?id=${id}`
    fetchChartData(dispatch, url)
    dispatch(addBelongBankRelationToGlobal())
  }
}

/**
 * 查看疑似可融合
 * @param {String} person1 person1 id
 * @param {String} person2 person2 id
 * @return {Function} dispatch
 */
export function getMergeSuggestedReason (person1, person2) {
  return (dispatch) => {
    const url = `${PERSON_MERGE_SUGGESTED}?person1=${person1}&person2=${person2}`
    fetchChartData(dispatch, url)
    dispatch(addBelongBankRelationToGlobal())
  }
}

/**
 * 获取族谱群图数据
 * 接口改变，废弃
 * @param  {String} id 族谱群id
 * @return {Function} dispatch
 */
export function getClusterChart_old (id) {
  return (dispatch, getState) => {
    const url = `${CLUSTER_ITEM_PATH}/?cid=${id}&result_type=graph&domain_name=${clusterParam.domain_name}&type=zupu`
    fetchChartData(dispatch, url, (data) => {
      const chartData = {}
      const newData = GraphUtil.preprocessChartData(data)
      newData.vertexes && newData.vertexes.forEach((v) => v[BELONG_BANK] = true)  // 需求，族谱中企业均展示为行内企业，绿色icon
      chartData[id] = newData
      dispatch({
        type: 'GET_CLUSTER_CHART_DATA_SUCCESS',
        chartData
      })
      dispatch(toggleCardType('Company_cluster'))
    })
  }
}

export function getClusterChart (groupName, type) {
  return (dispatch, getState) => {
    const query = getState().location.query
    groupName = groupName || query.group_name
    type = type || query.type
    const url = `${CLUSTER_ITEM_PATH}?group_name=${encodeURIComponent(groupName)}&result_type=graph&type=${type}`
    fetchChartData(dispatch, url, async (data) => {
      const chartData = {}
      const newData = GraphUtil.preprocessChartData(data)
      let id = 'cluster'
      newData.vertexes && newData.vertexes.forEach((v) => {
        if (v.name === groupName) {
          id = v._id
        }
        v[BELONG_BANK] = true
      })  // 需求，族谱中企业均展示为行内企业，绿色icon
      chartData[id] = newData
      dispatch({
        type: 'GET_CLUSTER_CHART_DATA_SUCCESS',
        chartData
      })
      dispatch(toggleCardType('Company_cluster'))
    })
  }
}

/**
 * 清空族谱群数据
 * @param {String} id 族谱群id
 * @return {Function} dispatch
 */
export function hideClusterChart (id) {
  return (dispatch, getState) => {
    const chartData = getState().clusterChartData
    delete chartData[id]
    dispatch({
      type: 'GET_CLUSTER_CHART_DATA_SUCCESS',
      chartData
    })
  }
}

export function getIndivTransferChart (id) {
  return (dispatch) => {
    const url = `${INDIV_TRANSFER_CHART_PATH}/?collection=personal_money_flow&depth=1&id=${id}&isMergeEdge=true`
    fetchChartData(dispatch, url)
  }
}

/**
 * 公共方法，获取图数据
 * @param {Object} dispatch diaptch
 * @param {String} url url
 * @param {Function} cb callback
 */
async function fetchChartData (dispatch, url, cb) {
  try {
    dispatch(setRenderChartStatus('pending'))
    let data = await authorizedFetch(url)
    if (data.status) throw Error(data.msg)
    if (cb) {
      cb(data.data)
    } else {
      const chartData = GraphUtil.preprocessChartData(data.data)
      dispatch(setOriginChartData(chartData.vertexes, chartData.edges))

      dispatch(setOperateChartStatus('show_origin' + Date.now()))
    }
  } catch (e) {
    dispatch(getChartDataFail(e.message))
  }
}

/**
 * 设置图谱渲染所处阶段, pending, drawing, success
 * @param {String} status 渲染图阶段
 * @return {Object} action object
 */
export function setRenderChartStatus (status) {
  return {
    type: 'SET_RENDER_CHART_STATUS',
    status
  }
}

/**
 * 设置图谱数据获取失败原因
 * @param {String} msg msg
 * @return {Object} action object
 */
export function getChartDataFail (msg) {
  return {
    type: 'GET_CHART_DATA_FAIL',
    msg
  }
}

/**
 * 获取展开的图数据
 * @param {Object} data 展开图数据
 * @return {Object} action object
 */
export function getExpandChartDataSuccess (data) {
  return {
    type: 'GET_EXPAND_CHART_DATA_SUCCESS',
    data
  }
}

/**
 * 设置当前点
 * @param {Object} vertex 点
 * @return {Object} action object
 */
export function setCurNode (vertex) {
  return {
    type: 'SET_CURNODE',
    vertex
  }
}

/**
 * 设置当前边
 * @param {Object} edge 边
 * @return {Object} action object
 */
export function setCurEdge (edge) {
  return {
    type: 'SET_CUREDGE',
    edge
  }
}

/**
 * 设置当前图谱结构
 * @param {Boolean} isTree 是否为树形图
 * @return {Object} dispatch
 */
export function toggleGraphType (isTree) {
  return (dispatch) => {
    dispatch(setReRenderChart(false))
    dispatch({
      type: 'TOGGLE_GRAPH_TYPE',
      isTree
    })
  }
}
/**
 * 显示截图弹框
 * @param {Boolean} isPhoto 是否显示弹窗
 * @return {Object} dispatch
 */
export function togglePhotoType (isPhoto) {
  return (dispatch) => {
    dispatch({
      type: 'TOGGLE_PHOTO_TYPE',
      isPhoto
    })
  }
}

/**
 * 设置群体关系被聚合的图数据
 * @param {Object} vertexes vertexes
 * @param {Object} edges edges
 * @return {Object} action object
 */
export function updateMergeChartData (vertexes, edges) {
  return (dispatch, getState) => {
    const mergeData = getState().mergeChartData
    update(vertexes, 'vertexes')
    update(edges, 'edges')

    dispatch({
      type: 'SET_MERGE_CHART_DATA',
      data: {
        vertexes: mergeData.vertexes,
        edges: mergeData.edges
      }
    })

    function update (data, type) {
      data.forEach((v) => {
        let found = false
        mergeData[type].forEach((n) => {
          if (n._id === v._id) {
            found = true
            Object.assign(n, v)
          }
        })
        if (!found) {
          mergeData[type].push(v)
        }
      })
    }
  }
}

export function setMergeChartData (vertexes = [], edges = []) {
  return {
    type: 'SET_MERGE_CHART_DATA',
    data: {
      vertexes: vertexes,
      edges: edges
    }
  }
}

/**
 * 设置图数据，群体融合之前，所有格式化之后
 * @param {Object} vertexes vertexes
 * @param {Object} edges edges
 * @return {Object} action object
 */
export function setOriginChartData (vertexes, edges) {
  return {
    type: 'SET_FORMAT_CHART_DATA',
    data: {
      vertexes,
      edges
    }
  }
}

/** 设置要展现在图中的数据，重构中，部分使用 */
export function setDisplayChartData (vertexes, edges) {
  return {
    type: 'SET_DISPLAY_CHART_DATA',
    data: { vertexes, edges }
  }
}

/**
 * 导出节点一度关系
 * @param {Object} curNode 当前节点
 * @param {Object} filterOptions 筛选关系
 * @return {Function} dispatch
 */
export function exportRelation (curNode, filterOptions) {
  return async (dispatch, getState) => {
    const exportOptions = doraemon.deepClone(filterOptions)
    exportOptions.ids = [curNode._id]
    exportOptions.edges.forEach((e) => {
      e.visible = true
    })
    const body = {
      options: exportOptions,
      company: curNode.name
    }
    const params = {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body)
    }
    try {
      let data = await fetch(EXPORT_RELATION_PATH, params)
      data = await data.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(data)
      const date = new Date()
      a.download = `${curNode.name}一度关系${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}.csv`
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(data, a.download)
      } else {
        a.click()
      }
    } catch (e) {
      console.error(e)
    }
  }
}

/**
 * 展开所有叶子结点
 * @param {Object} vertex curNode
 * @return {Function} dispatch
 */
export function expandAll (vertex) {
  return async (dispatch, getState) => {
    const chartData = getState().originChartData
    const leavesId = relationGroupService.getLeavesId(chartData)
    if (!leavesId.length) {
      dispatch(getChartDataFail('无可展开的节点'))
      return
    }

    try {
      await checkExpandAllLimit(leavesId, dispatch)
    } catch (e) {
      return
    }
    const body = { options: Object.assign({}, getState().FilterOptions) }
    body.options.ids = leavesId

    const params = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      mode: 'cors',
      body: JSON.stringify(body)
    }
    try {
      dispatch(setRenderChartStatus('pending'))
      let data = await authorizedFetch(EXPAND_PATH, params)
      if (data.status) throw Error(data.msg)
      dispatch(setReRenderChart(false))

      const originChartData = getState().originChartData
      const chartData = chartService.preprocess(data.data, vertex._id, getState())
      dispatch(getExpandChartDataSuccess(chartData))

      let newNodes = chartData.vertexes.concat(originChartData.vertexes)
      let newLinks = chartData.edges.concat(originChartData.edges)

      const curNode = chartData.vertexes.find((v) => v._id === vertex._id)
      dispatch(setCurNode(curNode))

      await chartService.getMergePerson(newNodes, newLinks, body.options, true)
      newNodes = chartService.getUniqueById(newNodes)
      newLinks = chartService.getUniqueById(newLinks)
      GraphUtil.mergeNodesAndEdges(newNodes, newLinks, originChartData)
      dispatch(setOriginChartData(newNodes, newLinks))
      const mergeData = relationGroupService.mergeExpandAllData(newNodes, newLinks)
      dispatch(updateMergeChartData(mergeData.mergeChartData.vertexes, mergeData.mergeChartData.edges))
      dispatch(setDisplayChartData(mergeData.vertexes, mergeData.edges))
    } catch (e) {
      console.error(e)
      dispatch(getChartDataFail('获取图谱失败'))
    }
  }
}

function checkExpandAllLimit (leavesId, dispatch) {
  if (leavesId.length > 50) {
    const p = new Promise((resolve, reject) => {
      dispatch({
        type: 'SET_EXPAND_ALL_MODAL_STATUS',
        data: {
          show: true,
          resolve,
          reject
        }
      })
    })
    return p
  } else {
    Promise.resolve()
  }
}
export function showHistory (step) {
  return (dispatch, getState) => {
    dispatch(setOperateChartStatus('show_history' + Date.now()))
    dispatch(ActionCreators.jump(step))

    dispatch({
      type: 'SET_FORMAT_CHART_DATA',
      data: getState().undoableOriginChartData.present
    })

    const chartData = getState().undoableOriginChartData.present
    const curNode = chartData.vertexes.find((v) => v.name === getState().relationSrcName) || {}
    dispatch(setCurNode(curNode))
    dispatch(toggleCardType('Company'))
  }
}

// 节点过多状态设置
export function setNodeStatus (isNodeMax) {
  return {
    type: 'SET_NODE_STATUS',
    isNodeMax
  }
}
