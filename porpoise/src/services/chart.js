/** 图数据通用处理方法 */

import { LP_PARAMS } from 'config'
import relationGroupService from './relationGroup'
import { edgeDigRelations, eventRelations } from 'graph.config'
import { GraphUtil } from 'components/Chart/GraphUtil'

/**
 * 通过 _id 对数据进行去重
 * - 相同 id 的数据间属性会进行融合，后面的覆盖前面的
 * @param {Array} data [{ _id: xxx }, { _id: yyy }]
 * @return {Array} unique data
 */
function getUniqueById (data) {
  const uniqueIds = new Set(data.map((d) => d._id))
  const uniqueData = []
  uniqueIds.forEach((id) => {
    const dataToMerge = data.filter((v) => (v._id === id))
    uniqueData.push(Object.assign({}, ...dataToMerge))
  })
  return uniqueData
}

/**
 * 如果两个节点之间同时存在同方向的 invest 和 tradable_share，删除 invest 边
 * @param {Object} edges edges
 */
function _uniqTradableShareAndInvest (edges) {
  const hasTradableShare = new Set()
  edges.forEach((edge) => {
    if (edge._id.includes('tradable_share')) {
      hasTradableShare.add(edge._from + edge._to)
    }
  })
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i]
    if (hasTradableShare.has(edge._from + edge._to) && edge._id.includes('invest')) {
      edges.splice(i, 1)
      i--
    }
  }
}

/**
 * 对点进行格式化
 * @param {Object} chartData { vertexes: [], edges: [] }
 * @return {Array} 经过处理后的点
 */
function _formatNodes (chartData) {
  const vertexes = chartData.vertexes || []
  return vertexes.map((vertex) => {
    vertex._type = vertex._id.split('/')[0]
    return vertex
  })
}

/**
 * 对边进行格式化，定义需要用到的属性
 * @param {Object} chartData { vertexes: [], edges: [] }
 * @param {Array} belongBankRelation 行内配置
 * @return {Array} 经过处理后的边
 * @return {Array} formated edges
 */
function _formatEdges (chartData, belongBankRelation) {
  const vertexes = chartData.vertexes || []
  const edges = chartData.edges || []

  /** 行内配置 */
  const belongBank = LP_PARAMS['Company_cluster'].belongBank
  let belongNodeIds = []
  if (belongBank) {
    belongNodeIds = vertexes.filter((vertex) => vertex[belongBank]).map((vertex) => vertex._id)
  }
  const relationMap = new Map()
  belongBankRelation && belongBankRelation.forEach((relation) => {
    relationMap.set(relation.target_table, relation)
  })

  return edges.map((l) => {
    const type = (l._id.split('/') && l._id.split('/')[0]) || ''
    let label = l.label
    let isMulti = l.isMulti
    const relationPropMap = {
      party_bid: { label: '甲方' },
      sue_relate: { label: '起诉' },
      plaintiff_relate: { label: '同为原告' },
      defendant_relate: { label: '同为被告' }
    }
    if (type in relationPropMap) {
      label = relationPropMap[type].label
      isMulti = true
    }

    const edge = {
      source: l._to,
      target: l._from,
      __from: l._from,
      __to: l._to,
      _id: l._id.includes('/') ? l._id : `edge/${l._id}`,
      _from: l._from,
      _to: l._to,
      label: label,
      type,         // 会在 setLinkTypes 中被转化为群体关系中的边
      _type: type,  // 原始类型
      hasShown: l.hasShown,
      rule: l.rule,
      isTwoWay: l.isTwoWay,
      isMulti: isMulti,
      belongBank: belongNodeIds.includes(l._from) && belongNodeIds.includes(l._to),
      concertTarget: l.rule && l._id.includes('concert') ? l.concertTarget || l.target : undefined,  // 会和target 冲突，重备份一个
      data: l // 所有原始图数据
    }

    const relationConfig = relationMap.get(type)
    if (relationConfig) {
      edge.label = edge.label ||
        (relationConfig.comment ? l[relationConfig.comment_name] : relationConfig.comment_name)  // 行内数据 label
      edge.isMulti = relationConfig.is_multi === 1  // 行内数据，是否多条边融合成一条
    }

    return edge
  })
}

/**
 * 对图数据进行预处理
 * @param {Object} data { vertexes: [], edges: [] }
 * @param {Object} centerNodeId id of center vertex
 * @param {Object} state redux state
 * @return {Object} data { vertexes: [], edges: [] }
 */
function preprocess (data, centerNodeId, state) {
  const chartData = Object.assign({}, data)

  let vertexes = _formatNodes(chartData)
  let edges = _formatEdges(chartData, state.belongBankRelation)

  _uniqTradableShareAndInvest(edges)  // 两个点之间如果同时连有 tradable_share 和 invest，删除 invest
  relationGroupService.setLinkTypes(edges, centerNodeId)

  vertexes = getUniqueById(vertexes)
  edges = getUniqueById(edges)

  return {
    vertexes,
    edges
  }
}

function cutConcertExplainNodesAndEdges (vertexes, edges, rule) {
  const requiredTypeMap = {
    'Rule9': ['family'],
    'Rule10': ['family'],
    'Rule12': ['family']
  }

  if (!Object.keys(requiredTypeMap).includes(rule)) {
    return {
      vertexes,
      edges
    }
  }

  const requiredLinks = edges.filter((l) => requiredTypeMap[rule].some((type) => l._id.includes(type)))
  const legalNodes = vertexes.filter((v) => {
    return !v._id.includes('Person') || requiredLinks.some((l) => [l._from, l._to].includes(v._id))
  })
  const legalLinks = edges.filter((l) => legalNodes.some((v) => [l._from, l._to].includes(v._id)))

  return {
    vertexes: legalNodes,
    edges: legalLinks
  }
}

/**
 * 删除离群点
 * @param {Array} vertexes 节点数组
 * @param {Array} edges 边数组
 */
function delOutlier (vertexes, edges) {
  const linkedVertexIds = new Set()
  edges.forEach((e) => {
    linkedVertexIds.add(e._from)
    linkedVertexIds.add(e._to)
  })
  for (let i = 0; i < vertexes.length; i++) {
    if (!linkedVertexIds.has(vertexes[i]._id)) {
      vertexes.splice(i, 1)
      i--
    }
  }
}

/**
 * 对人进行展开，获取可融合人
 * @param {Object} vertexes 点
 * @param {Object} edges 边
 * @param {Object} filterOptions 筛选条件
 * @param {Object} isExpand 是否为展开阶段，展开时只要开启了可融合就要执行人物搜索
 */
export async function getMergePerson (vertexes, edges, filterOptions, isExpand) {
  let shouldSearch = [...edgeDigRelations, ...eventRelations]
    .some((type) => _isEdgeVisible(filterOptions, type)) || isExpand
  if (shouldSearch && _isEdgeVisible(filterOptions, 'person_merge')) {
    await GraphUtil.getMergePerson(vertexes, edges, filterOptions, isExpand)
  }
}

/**
* options 中边 visible 是否为 true
* @param  {Object} filterOptions 筛选条件
* @param  {String} edgeClassName 边名称
* @return {Boolean} is edge visible
*/
function _isEdgeVisible (filterOptions, edgeClassName) {
  const edge = filterOptions.edges.find((e) => e.class === edgeClassName) || {}
  return edge.visible
}

const chartService = {
  preprocess,
  getUniqueById,
  cutConcertExplainNodesAndEdges,
  delOutlier,
  getMergePerson
}

export default chartService
