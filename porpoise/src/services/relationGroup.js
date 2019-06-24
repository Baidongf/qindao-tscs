import { mergeEdgeMap } from 'graph.config'
import chartService from './chart'

/**
 * 如果两条一致行动关系边都有rule属性（非rule3），且from, to相同，合并
 * @param {Array} edges edges
 */
function uniqueConcertEdges (edges) {
  const fromToArray = []
  const noDirectionArray = []
  for (let i = 0; i < edges.length; i++) {
    if (edges[i].type !== 'concert') continue

    const fromTo = edges[i]._from + edges[i]._to
    const toFrom = edges[i]._to + edges[i]._from
    // 无方向线, 真实的 concert 边
    if (edges[i].rule) {
      if (fromToArray.includes(fromTo)) {
        edges.splice(i, 1)
        i--
      } else {
        fromToArray.push(fromTo, toFrom)
      }
    } else {  // 有方向线, 后端构造的 concert 边, 用于连接 from/to and target
      if (noDirectionArray.includes(fromTo)) {
        edges.splice(i, 1)
        i--
      } else {
        noDirectionArray.push(fromTo)
      }
    }
  }
}

/**
 * 设置群体关系中各条边的 type
 * @param {Array} edges edges
 * @param {String} centerNodeId id of init center name (name in url)
 */
function setLinkTypes (edges, centerNodeId) {
  edges.forEach((edge) => {
    edge.type = edge.type || edge._id.split('/')[0]
    // invest -> shareholder
    if (edge._id.includes('invest') && edge._to === centerNodeId) {
      edge.type = 'shareholder'
    }
    // tradable_share -> invest / shareholder
    if (edge._id.includes('tradable_share') && centerNodeId) {
      edge.type = edge._to === centerNodeId ? 'shareholder' : 'invest'
    }
    // win_bid / publish_bid / agent_bid -> bid
    if (['agent_bid', 'publish_bid', 'win_bid'].includes(edge.type)) {
      edge.type = 'bid'
    }
    // actual_controller -> in/out_actual_controller
    if (edge._id.includes('actual_controller') && centerNodeId) {
      edge.type = edge._from === centerNodeId ? 'out_actual_controller' : 'in_actual_controller'
    }
    if (edge.type.includes('sue_relate') && centerNodeId) {
      edge.type = edge._from === centerNodeId ? 'out_sue_relate' : 'in_sue_relate'
    }
    if (edge.type.includes('party_bid') && centerNodeId) {
      edge.type = edge._from === centerNodeId ? 'out_party_bid' : 'in_party_bid'
    }
    // control_shareholder -> in/out_control_shareholder
    if (edge._id.includes('control_shareholder') && centerNodeId) {
      edge.type = edge._from === centerNodeId ? 'out_control_shareholder' : 'in_control_shareholder'
    }
  })
}

/**
 * 设置群体关系点，用于将和中心节点相连的叶子节点中超过阈值的一类关系聚合
 * 重构版
 * @param {Array} vertexes vertexes
 * @param {Array} edges edges
 * @param {String} centerNodeId center node id
 * @param {Array} leavesId leaves id, only leaves can be merged
 * @return {Object} vertexes, edges and mergeChartData
 */
function mergeRelation (vertexes, edges, centerNodeId, leavesId) {
  const mergeChart = {
    vertexes: Object.assign([], vertexes),
    edges: Object.assign([], edges),
    mergeChartData: { vertexes: [], edges: [] }
  }

  /** 计算和中心节点相邻每个节点的出入度 */
  const linkedNodeDegree = []

  edges.forEach((e) => {
    if (e._from === centerNodeId || e._to === centerNodeId) {
      const linkedId = e._from === centerNodeId ? e._to : e._from
      if (leavesId && !leavesId.includes(linkedId)) {
        return
      }
      linkedNodeDegree.push({
        _id: linkedId,
        edge: e,
        degree: 0
      })
    }
  })

  /** 和中心节点相邻的叶子结点的类型映射 */
  const leavesTypeMap = new Map()
  linkedNodeDegree.forEach((item) => {
    if (leavesTypeMap.has(item.edge.type)) {
      const typeVal = leavesTypeMap.get(item.edge.type)
      typeVal.count = typeVal.count + 1
      typeVal.edges.push(item.edge)
    } else {
      leavesTypeMap.set(item.edge.type, {
        count: 1,
        edges: [item.edge]
      })
    }
  })

  /** 遍历每个类型，超出阈值则聚合 */
  leavesTypeMap.forEach((val, type) => {
    const threshold = mergeEdgeMap[type] && mergeEdgeMap[type].threshold
    if (threshold && val.count > threshold) {
      const mergedEdgeIds = new Set()
      const mergedVertexIds = new Set()
      val.edges.forEach((e) => {
        mergedEdgeIds.add(e._id)
        if (centerNodeId === e._from) {
          mergedVertexIds.add(e._to)
        } else {
          mergedVertexIds.add(e._from)
        }
      })
      mergeChart.edges = mergeChart.edges.filter((e) => !mergedEdgeIds.has(e._id))

      const idPostfix = centerNodeId.split('/')[1]
      const mergeNodeId = `${type}_mergeNode/${idPostfix}`
      const mergeNode = {
        _id: mergeNodeId,
        name: `${mergeEdgeMap[type].label}(${val.count})`,
        mergeNum: val.count,
        mergedVertexIds: [...mergedVertexIds]
      }
      mergeChart.vertexes.push(mergeNode)

      const mergeLink = {
        _id: `${type}_mergeEdge/${idPostfix}`,
        _from: centerNodeId,
        _to: mergeNodeId,
        source: centerNodeId,
        target: mergeNodeId,
        mergedEdgeIds: [...mergedEdgeIds]
      }
      mergeChart.edges.push(mergeLink)

      mergeChart.mergeChartData.vertexes.push(mergeNode)
      mergeChart.mergeChartData.edges.push(mergeLink)
    }
  })
  mergeChart.vertexes = chartService.getUniqueById(mergeChart.vertexes)
  chartService.delOutlier(mergeChart.vertexes, mergeChart.edges)

  return mergeChart
}

export function mergeExpandAllData (vertexes, edges) {
  const mergeData = {
    mergeChartData: { vertexes: [], edges: [] },
    vertexes,
    edges
  }
  const leavesId = getLeavesId({ vertexes, edges })
  const leavesLinkedNodeIds = getLeavesLinkedNodeId(leavesId, edges)
  leavesLinkedNodeIds.forEach(function (id) {
    setLinkTypes(mergeData.edges, id)
    const mergeOnceData = relationGroupService.mergeRelation(mergeData.vertexes, mergeData.edges, id, leavesId)
    mergeData.mergeChartData.vertexes.push(...mergeOnceData.mergeChartData.vertexes)
    mergeData.mergeChartData.edges.push(...mergeOnceData.mergeChartData.edges)
    mergeData.vertexes = mergeOnceData.vertexes
    mergeData.edges = mergeOnceData.edges
  })

  return mergeData
}

// 获取所有的叶子结点相邻节点
function getLeavesLinkedNodeId (leavesId, edges) {
  const leavesLinkedNodeId = new Set()
  leavesId.forEach(function (id) {
    const linkedEdge = edges.find((e) => e._from === id || e._to === id)
    if (!linkedEdge) return
    const linkedNodeId = linkedEdge._from === id ? linkedEdge._to : linkedEdge._from
    leavesLinkedNodeId.add(linkedNodeId)
  })

  return [...leavesLinkedNodeId]
}

// 获取所有的叶子结点
export function getLeavesId ({ vertexes, edges }) {
  const vertexIdDegreeMap = new Map()
  vertexes.forEach((v) => vertexIdDegreeMap.set(v._id, { degree: 0, linkedId: new Set() }))
  edges.forEach((e) => {
    const from = vertexIdDegreeMap.get(e._from)
    if (from && !from.linkedId.has(e._to)) {
      from.degree = from.degree + 1
      from.linkedId.add(e._to)
    }
    const to = vertexIdDegreeMap.get(e._to)
    if (to && !to.linkedId.has(e._from)) {
      to.degree = to.degree + 1
      to.linkedId.add(e._from)
    }
  })
  const leavesId = []
  vertexIdDegreeMap.forEach((val, id) => {
    if (val.degree === 1) {
      leavesId.push(id)
    }
  })

  return leavesId
}

/**
 * 将两点之间的同类型多条边聚合成一条
 * @param {Array} edges 边数组
 */
export function mergeMultiRelation (edges) {
  const mergeRels = new Set(['money_flow', 'guarantee', 'sue_relate',
    'plaintiff_relate', 'defendant_relate', 'party_bid'])  // 需要聚合的边

  // 行内关系中 is_multi 为 1 的边也要聚合
  const belongBankRelation = JSON.parse(sessionStorage.getItem('belongBankRelation'))
  belongBankRelation.forEach((e) => {
    if (e.is_multi) {
      mergeRels.add(e.target_table)
    }
  })

  const mergedEdge = new Map()

  for (let i = 0; i < edges.length; i++) {
    if (mergeRels.has(edges[i]._type)) {
      let key = edges[i]._from + '-' + edges[i]._to + '-' + edges[i]._type
      if (['plaintiff_relate', 'defendant_relate'].includes(edges[i]._type)) {  // 同为原告、同为被告不考虑方向
        const fromToIds = [edges[i]._from, edges[i]._to].sort((a, b) => a > b ? -1 : 1)
        key = fromToIds.join('-') + edges[i]._type
      }
      if (mergedEdge.has(key)) {
        edges.splice(i, 1)
        i--
        const e = mergedEdge.get(key)
        const nList = /\D*(\d+).*/.exec(e.label) || []
        const n = nList.length > 1 ? parseInt(nList[1]) : 0
        e.label = editLabel(edges[i]._type, n + 1)
      } else {
        edges[i].label = editLabel(edges[i]._type, 1)
        edges[i].isMulti = true
        mergedEdge.set(key, edges[i])
      }
    }
  }

  function editLabel (edgeType, n) {
    const method = {
      'money_flow': (n) => `${n}笔`,
      'guarantee': (n) => `担保${n}笔`,
      'sue_relate': (n) => '起诉',
      'plaintiff_relate': (n) => '同为原告',
      'defendant_relate': (n) => '同为被告',
      'party_bid': (n) => '甲方'
    }
    belongBankRelation.forEach((e) => {
      method[e.target_table] = method[e.target_table] || (() => e.comment_name)
    })

    return (method[edgeType] && method[edgeType](n)) || ''
  }
}

const relationGroupService = {
  setLinkTypes,
  mergeRelation,
  mergeExpandAllData,
  getLeavesId,
  mergeMultiRelation
}

export default relationGroupService
