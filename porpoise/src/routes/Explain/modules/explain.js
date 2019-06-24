import { authorizedFetch } from 'actions/Global'
import { setRenderChartStatus, setOriginChartData,
  setOperateChartStatus, getChartDataFail, expand } from 'actions/Chart'
import { findRelation, toggleCardType } from 'actions/Card'
import { setInitCompanyName } from 'actions/InitConfig'
import { GraphUtil } from 'components/Chart/GraphUtil'
import chartService from 'services/chart'
import { API_ADDRESS } from '../../../../global_config'
import { EXPLAIN_PARAMS } from 'config'
import { graphPostBody } from 'graph.config'

const getConcertChartPath = `${API_ADDRESS}/api/graph/explain/concert`
const getActualCtrlPath = `${API_ADDRESS}/api/graph/explain/actual_control`

// ------------------------------------
// Constants
// ------------------------------------
export const CHANGE_FILTER_OPTIONS = 'CHANGE_FILTER_OPTIONS'

// ------------------------------------
// Actions
// ------------------------------------

/**
 * 根据图谱解释类型更新 options 参数
 * @param {Object} query redux location 对象
 * @return {Function} dispatch
 */
export function changeFilterOptions (query) {
  return (dispatch, getState) => {
    const type = query.type
    const params = EXPLAIN_PARAMS[type] || {}
    const { visibleEdges } = params
    const options = JSON.parse(JSON.stringify(getState().FilterOptions))
    if (visibleEdges) {
      options.edges.forEach((edge) => {
        edge.visible = visibleEdges.includes(edge.class)
      })
    }
    if ('shareholder_type' in params) {
      options.filter.edge.invest['shareholder_type'] = params['shareholder_type']
    }
    if (type === 'invest_and_officer') {
      const expandId = query.id || ''
      // 股东对外投资及任职，如果股东是公司的话，不开启高管边
      if (expandId.includes('Company')) {
        options.edges.find((e) => e.class === 'officer').visible = false
        options.filter.edge.officer.position = []
      }
    }
    dispatch({
      type: CHANGE_FILTER_OPTIONS,
      options
    })
  }
}

/**
 * 获取疑似实际控制人图数据
 * @param {Object} param from id; to id; target id; rule number
 * @return {Function} dispatch
 */
export function getConcertChart ({ from, to, target = '', rule }) {
  return async (dispatch, getState) => {
    const url = `${getConcertChartPath}?rule=${rule}&from=${from}&to=${to}&target=${target}`
    try {
      dispatch(setRenderChartStatus('pending'))
      let data = await authorizedFetch(url)
      if (data.status) throw Error(data.msg)

      const chartData = chartService.preprocess(data.data, null, getState())
      dispatch(setOriginChartData(chartData.vertexes, chartData.edges))

      dispatch(setOperateChartStatus(`show_concert_explain/${rule}`))
    } catch (e) {
      dispatch(getChartDataFail(e.message))
    }
  }
}

/**
 * 获取企业派系图谱解释图数据
 * @param {Object} param0 from id; to id
 * @return {Function} dispatch
 */
export function getCompanyFactionChart ({ from, to }) {
  return (dispatch, getState) => {
    const filterOptions = getState().FilterOptions
    dispatch(findRelation([from, to], 5, filterOptions))
    // 恢复初始筛选条件
    dispatch(resetFilterOptions())
  }
}

/**
 * 获取股东／高管对外投资及任职图数据
 * @param {Object} param0 vertex id; vertex name
 * @return {Function} dispatch
 */
export function getInvestAndOfficerChart ({ _id, name = '' }) {
  return (dispatch, getState) => {
    const filterOptions = getState().FilterOptions
    dispatch(expand({ _id, name }, filterOptions))
    if (name) {
      dispatch(setInitCompanyName(name))
      dispatch(toggleCardType('Company'))
    }
    dispatch(resetFilterOptions())
  }
}

/**
 * 获取疑似实际控制人图数据
 * @return {Function} dispatch
 */
export function getActualCtrlChart () {
  return async (dispatch, getState) => {
    const query = getState().location.query
    const url = `${getActualCtrlPath}?rule=${query.rule}&depth_list=${query.depth_list}&from_list=${query.from_list}&to=${query.to}`
    try {
      dispatch(setRenderChartStatus('pending'))
      let data = await authorizedFetch(url)
      if (data.status) throw Error(data.msg)

      const chartData = chartService.preprocess(data.data, null, getState())
      dispatch(setOriginChartData(chartData.vertexes, chartData.edges))

      dispatch(setOperateChartStatus('show_origin' + Date.now()))
    } catch (e) {
      dispatch(getChartDataFail(e.message))
    }
  }
}

/**
 * 恢复初始筛选条件
 * @return {Object} action object
 */
function resetFilterOptions () {
  return {
    type: CHANGE_FILTER_OPTIONS,
    options: graphPostBody.options
  }
}
