/**
 * @desc: {处理图数据的工具函数。此文件中的函数陆续迁入 services 中，不再写在组件内}
 * @author: xieyuzhong
 * @Date: 2018-12-04 15:40:51
 * @Last Modified by: xieyuzhong
 * @Last Modified time: 2018-12-04 15:41:49
 */

import { LP_PARAMS, EXPAND_PATH } from 'config'
import { authorizedFetch } from 'actions/Global'
import chartService from 'services/chart'
import { mergeEdgeMap, edgeDigRelations, eventRelations,
  digRelationThreshold, mainRelationThreshold } from 'graph.config'

let expandedPerson = {}
let lastStoreTypes = []
let personNames = [] // 所有人物点的名称
const expandEdgesTypes = ['person_merge', ...edgeDigRelations, ...eventRelations]

export const GraphUtil = {
  getUnique: function (data) {
    let uniqueIds = []
    let uniqueData = []
    data.forEach((v, idx) => {
      if (!uniqueIds.includes(v._id)) {
        uniqueIds.push(v._id)
      }
    })
    uniqueIds.forEach((id) => {
      const dataToMerge = data.filter((v) => (v._id === id))
      uniqueData.push(Object.assign({}, ...dataToMerge))
    })
    return uniqueData
  },

  /**
   * 如果两个节点之间同时存在同方向的 invest 和 tradable_share，删除 invest 边
   * @param {Object} edges edges
   */
  uniqTradableShareAndInvest (edges) {
    const hasTradableShare = {}
    edges.forEach((edge) => {
      if (edge._id.includes('tradable_share')) {
        hasTradableShare[`${edge._from}${edge._to}`] = true
      }
    })
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i]
      if (hasTradableShare[`${edge._from}${edge._to}`] && edge._id.includes('invest')) {
        edges.splice(i, 1)
        i--
      }
    }
  },

  setPersonNames: function (vertexes) {
    vertexes.forEach((vertex) => {
      if (vertex._id.includes('Person') && !personNames.includes(vertex.name)) {
        personNames.push(vertex.name)
      }
    })
  },

  clearPersonNames: function () {
    personNames = []
  },

  getMergePerson: async function (vertexes, edges, options, isExpand) {
    let storeTypes = []
    expandEdgesTypes.forEach((option) => {
      if (isVisible(options, option)) {
        storeTypes.push(option)
      }
    })
    // 如果缓存条件改变，清空缓存
    if (lastStoreTypes.join() !== storeTypes.join()) {
      expandedPerson = {}
    }
    let personIds = []     // 将要展开的 id
    let expandedNames = Object.keys(expandedPerson)    // 已展开的人名列表

    vertexes.forEach((v) => {
      if (v._type !== 'Person') return
      if (expandedNames.includes(v.name)) {   // 缓存命中, 直接提取
        edges.push(...expandedPerson[v.name].edges)
        vertexes.push(...expandedPerson[v.name].vertexes)
      } else if (isVisible(options, 'family')) { // 缓存未命中, 亲属关系打开, 展开
        personIds.push(v._id)
      } else if (isVisible(options, 'person_merge')) {    // 缓存未命中, 亲属关系未打开, 可融合打开, 如果是同名人, 展开
        if (personNames.includes(v.name) && (isLinkToExpandEdges(v) || isExpand)) {
          personIds.push(v._id)
        } else {
          personNames.push(v.name)
        }
      }
    })
    if (!personIds.length) return

    let body = { options: JSON.parse(JSON.stringify(options)) }
    body.options.ids = personIds
    // 只需要进行可融合查询
    body.options.edges.forEach((edge) => {
      if (edge.class !== 'person_merge') {
        edge.visible = false
      }
      // 亲属关系需要对人按亲属关系展开
      if (edge.class === 'family' && isVisible(options, 'family')) {
        edge.visible = true
      }
    })
    let headers = new Headers({
      'Content-Type': 'application/json'
    })
    const params = {
      method: 'POST',
      headers: headers,
      mode: 'cors',
      body: JSON.stringify(body)
    }
    // 对重名人展开，加入待融合列表
    try {
      let data = await authorizedFetch(EXPAND_PATH, params)
      if (data.status) throw Error(data.msg)
      data = data.data
      if (storeTypes.includes('family')) {
        this._filterSingleFamilyIdNodes(data.vertexes, data.edges)
      }
      data = this.preprocessChartData(data)
      this.setExpandedPersonCache(data, storeTypes)
      let expandedEdges = data.edges.filter((v) => storeTypes.some((type) => v._id.includes(type)))
      let expandedEdgeIds = expandedEdges.map((e) => e._to).concat(expandedEdges.map((e) => e._from))
      edges.push(...expandedEdges)
      vertexes.push(...data.vertexes.filter((v) => v._type === 'Person' || v._type === 'Family_id')
        .filter((v) => expandedEdgeIds.includes(v._id)))
    } catch (e) {
      // 异常处理; 如果出错，直接融合同名人
      let uniquePerson = {}
      for (let i = 0; i < vertexes.length; i++) {
        if (!vertexes[i]._id.includes('Person')) continue

        if (!Object.keys(uniquePerson).includes(vertexes[i].name)) {
          uniquePerson[vertexes[i].name] = vertexes[i]
        } else {
          let mergeId = vertexes[i]._id
          edges.forEach((edge) => {
            if (edge._from === mergeId) {
              edge._from = uniquePerson[vertexes[i].name]._id
            } else if (edge._to === mergeId) {
              edge._to = uniquePerson[vertexes[i].name]._id
            }
          })
          vertexes.splice(i, 1)
          i--
        }
      }
    }

    /**
     * 选出要被展示的边
     * @param {Object} options filter options
     * @param {String} className class name
     * @return {Boolean} 该类型的边是否要被展示
     */
    function isVisible (options, className) {
      const e = options.edges.find((v) => v.class === className) || {}
      return e.visible
    }

    /**
     * 点是否和展开得到的边相连
     * @param {Object} vertex vertex
     * @return {Boolean} 点是否和展开所得的边相连
     */
    function isLinkToExpandEdges (vertex) {
      return edges.filter((edge) => expandEdgesTypes.includes(edge._id.split('/')[0]))
        .some((edge) => [edge._from, edge._to].includes(vertex._id))
    }
  },

  // 异常处理, 排除只有一条亲属关系与family_id 相连的情况
  _filterSingleFamilyIdNodes: function (vertexes, edges) {
    const familyIdNodes = vertexes.filter((vertex) => vertex._type === 'Family_id')
    familyIdNodes.forEach((vertex) => {
      let singleEdgeIdx = []
      edges.forEach((edge, idx) => {
        if (edge._from === vertex._id || edge._to === vertex._id) {
          singleEdgeIdx.push(idx)
        }
      })
      if (singleEdgeIdx.length === 1) {
        edges.splice(singleEdgeIdx[0], 1)
        vertexes = vertexes.filter((v) => v._id !== vertex._id)
      }
    })
  },

  setExpandedPersonCache: function (data, storeTypes) {
    data.vertexes.forEach((v) => {
      if (!v._id.includes('Person')) return
      if (!expandedPerson[v.name]) expandedPerson[v.name] = { edges: [], vertexes: [] }
      expandedPerson[v.name].vertexes.push(v)
      expandedPerson[v.name].edges.push(...data.edges.filter((e) => {
        const isInStoreTypes = storeTypes.some((v) => e._id.includes(v))
        return e._from === v._id && isInStoreTypes
      }))
    })

    // 亲属 Family_id 节点需要绑定至相应的人上
    data.vertexes.filter((v) => v._id.includes('Family_id')).forEach((v) => {
      data.edges.filter((e) => e._to === v._id).forEach((e) => {
        const person = data.vertexes.find((v) => v._id === e._from)
        expandedPerson[person.name].vertexes.push(v)
        expandedPerson[person.name].edges.push(e)
      })
    })
    lastStoreTypes = storeTypes
  },

  /**
   * @desc 对一个图的边和点,进行融合处理
   *
   * @param { Array } vertexes 图的点
   * @param { Array } edges 边
   * @param { Object } originChartData 原始图数据
   * @param { Object } curNode 当前点，防止当前点被融合掉
   * 没有返回值,处理结果直接作用在传入的 vertexes & edges
   *
   * */
  mergeNodesAndEdges: function (vertexes, edges, originChartData, curNode, delOutlier = true) {
    /**
     * @desc 从图的边数组中获取可融合的边,并以数组的格式返回同时将这些可融合的边从源数组中删除
     *
     * @param {Array} edgesArr 图的边数组
     * @return {Array} 具有融合属性的边
     *
     * */
    function getAndDelMergeEdge (edgesArr) {
      let newArr = []
      let i
      for (i = 0; i < edgesArr.length; i++) {
        if (edgesArr[i]._id.indexOf('person_merge/') !== -1) {
          newArr.push(edgesArr[i])
          edgesArr.splice(i, 1)
          i--
        }
      }
      return newArr
    }
    /**
     * @desc 根据若干条可融合的边组成的图, 划分出该图所有的连通分量(极大连通子图),连通分量的信息以modules数组的形式返回
     *
     * @param {Array} mergableEdges 包含所有可融合的边,这些边的信息可以构成一个图
     *
     * @return {Array} 返回一个图的连通分量信息
     * */
    function divideConnectedComponents (mergableEdges) {
      /**
       * @desc (递归函数)将一条可融合的边的节点信息, 记录到连通分量module内
       * @param {Object} edgeObj edges
       * @param {Object} module module
       * */
      function setNodesSet (edgeObj, module) {
        let j
        let tmpEdge

        module.vertexes[edgeObj._from] = true
        module.vertexes[edgeObj._to] = true

        // 每个要融合的连通分量module,其融合点可以任意取一条融合边上的点
        if (!module.mergeNodeId) {
          const vList = originChartData.vertexes.filter((vertex) => vertex._id === edgeObj._from || vertex._id === edgeObj._to) // 待选的融合结果点
          let v = null  // 最终融合结果点
          if (curNode) {
            v = vList.find((vertex) => vertex._id === curNode._id)
          }
          v = v || vList[0]
          if (v) {
            module.mergeNodeId = v._id
          }
        }
        for (j = 0; j < mergableEdges.length; j++) {
          if (mergableEdges[j]._from in module.vertexes || mergableEdges[j]._to in module.vertexes) {
            tmpEdge = mergableEdges.splice(j, 1)[0]
            j--
            module.edges.push(tmpEdge)
            if (tmpEdge._id.indexOf('person_merge') !== -1) {
              setNodesSet(tmpEdge, module)
            }
          }
        }
      }

      // 每个元素都是一个图的连通分量(边由融合边构成)
      let modules = []
      let module = null

      while (mergableEdges.length !== 0) {
        let i = 0

        // 如果是可融合边(实际上这个判断必然为true)
        if (mergableEdges[i]._id.indexOf('person_merge') !== -1) {
          // 创建一个连通分量
          module = {
            vertexes: {}, // 格式为{id_1: true, id_2, true, ...}, id_n是融合点n的id,表示该融合点在当前连通分量上
            edges: [], // 格式为[{...}, {....}, {...}, ...],每一个数组元素对应一条可融合边
            mergeNodeId: '', // 每个连通分量上的所有点,都会融合为一个点,这个点可以任意从连通分量上取一个
            disMergableEdges: [] // 格式为[{...}, {....}, {...}, ...],每一个数组元素对应一个和当前连通分量连接的非融合边
          }
          setNodesSet(mergableEdges[i], module)
          modules.push(module)
        }
      }
      return modules
    }

    let mergableEdges = getAndDelMergeEdge(edges)
    let modules = divideConnectedComponents(mergableEdges)

    // 在edges中进行点融合(对于非融合且含有融合点的边,修改其出度或入度,以达到融合点的目的)
    for (let index = 0; index < edges.length; index++) {
      let edgeObj = edges[index]
      let _from, _to, i, l

      // 如果不是可融合边
      if (edgeObj._id.indexOf('person_merge/') === -1) {
        _from = edgeObj._from
        _to = edgeObj._to

        for (i = 0, l = modules.length; i < l; i++) {
          let copyObj = Object.assign({}, edgeObj)
          if (_from in modules[i].vertexes) {
            modules[i].disMergableEdges.push(copyObj)
            edgeObj._from = modules[i].mergeNodeId
            edgeObj.source = modules[i].mergeNodeId
            break
          }
          if (_to in modules[i].vertexes) {
            modules[i].disMergableEdges.push(copyObj)
            // 改动数据源的边
            edgeObj._to = modules[i].mergeNodeId
            edgeObj.target = modules[i].mergeNodeId
            break
          }
        }
      }
    }

    // 在nodes内进行点融合(每个连通分量module仅保留一个)
    for (let i = 0; i < vertexes.length; i++) {
      for (let j = 0, l = modules.length; j < l; j++) {
        if (vertexes[i]._id in modules[j].vertexes) {
          if (vertexes[i]._id !== modules[j].mergeNodeId) {
            vertexes.splice(i, 1)
            i--
          } else {
            vertexes[i].mergeNodesId = Object.assign({}, modules[j].vertexes)
            delete vertexes[i].mergeNodesId[modules[j].mergeNodeId]
          }
          break
        }
      }
    }

    if (delOutlier) {
      chartService.delOutlier(vertexes, edges)
    }
  },

  /**
   * 如果两条一致行动关系边都有rule属性（非rule3），且from, to相同，合并
   * @param {Array} edges edges
   */
  uniqueConcertEdges (edges) {
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
  },

  /**
   * 设置群体关系中各条边的 type
   * @param {Array} vertexes vertexes
   * @param {Array} edges edges
   * @param {String} centerNodeId id of init center name (name in url)
   */
  setLinkTypes: function (vertexes, edges, centerNodeId) {
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
  },

  /**
   * 设置群体关系中各条边的 type，version 2，暂时从兰州迁移过来
   * @param {Array} links links
   * @param {String} centerNodeId id of init center name (name in url)
   */
  setLinkTypes2: function (links, centerNodeId) {
    links.forEach((link) => {
      link.type = link._id.split('/')[0]
      // invest -> shareholder
      if (link._id.includes('invest') && link._to === centerNodeId) {
        link.type = 'shareholder'
      }
      // tradable_share -> invest / shareholder
      if (link._id.includes('tradable_share') && centerNodeId) {
        link.type = link._to === centerNodeId ? 'shareholder' : 'invest'
      }
      // win_bid / publish_bid / agent_bid -> bid
      if (link._id.includes('bid')) {
        link.type = 'bid'
      }
      if (link._id.includes('guarantee') && centerNodeId) {
        link.type = link._from === centerNodeId ? 'out_guarantee' : 'in_guarantee'
      }
      if (link._id.includes('money_flow') && centerNodeId) {
        link.type = link._from === centerNodeId ? 'out_money_flow' : 'in_money_flow'
      }
      // actual_controller -> in/out_actual_controller
      if (link._id.includes('actual_controller') && centerNodeId) {
        link.type = link._from === centerNodeId ? 'out_actual_controller' : 'in_actual_controller'
      }
      // control_shareholder -> in/out_control_shareholder
      if (link._id.includes('control_shareholder') && centerNodeId) {
        link.type = link._from === centerNodeId ? 'out_control_shareholder' : 'in_control_shareholder'
      }
      link[`type_to_${centerNodeId}`] = link.type // 相对于该中心节点的type，一条边对不同的中心节点有不同的type
    })
  },

  /**
   * 设置群体关系点，用于将过多的点聚合成一个点
   * @param {Array} vertexes vertexes
   * @param {Array} edges edges
   * @param {String} centerNodeId id of init center name (name in url)
   * @return {Object} vertexes, edges and mergeChartData
   */
  mergeRelation: function (vertexes, edges, centerNodeId) {
    /**
     * 判断一条边是否应该被聚合
     * @param {Object} edge edge
     * @param {String} type type
     * @return {Boolean} should be merge
     */
    function shouldLinkMerge (edge, type) {
      // 和有亲属关系的点相连的边不被聚合
      if (familyVertexIds.includes(edge._from) || familyVertexIds.includes(edge._to)) return false

      if (!edge._id.includes('mergeEdge') && [edge._from, edge._to].includes(centerNodeId) && !edge.hasShown) {
        if (type === 'bid' && ['agent_bid', 'publish_bid', 'win_bid'].includes(edge.type)) {
          return true
        }
        if (type === 'concert' && edge._id.includes('concert')) {
          return !!edge.rule
        }
        return edge.type === type
      }
      return false
    }

    const mergeNumMap = {} // {'invest': 100}
    const mergeChartData = { vertexes: [], edges: [] }
    const familyVertexIds = []
    if (!edges.length) return { vertexes, edges, mergeChartData }

    // 清除之前和中心节点相连的聚合点
    const removeMergeNodeIds = []
    edges = edges.filter((edge) => {
      if (edge._id.includes('family')) {
        familyVertexIds.push(edge._from.includes('Person') ? edge._from : edge._to)
      }
      if (edge._id.includes('mergeEdge') && edge._from === centerNodeId) {
        removeMergeNodeIds.push(edge._to)
        return false
      }
      return true
    })
    vertexes = vertexes.filter((vertex) => !removeMergeNodeIds.includes(vertex._id))

    // 计算每个节点的度数
    const nodeDegree = {}
    vertexes.forEach((vertex) => {
      nodeDegree[vertex._id] = vertex.degree
    })

    // 要聚合的边
    Object.keys(mergeEdgeMap).forEach((type) => {
      const edgeLength = edges.filter((edge) => shouldLinkMerge(edge, type)).length
      if (edgeLength > mergeEdgeMap[type].threshold) {
        mergeNumMap[type] = edgeLength
      }
    })

    // 聚合
    const linkMerged = {}
    Object.keys(mergeNumMap).forEach((type) => {
      edges = edges.filter((edge) => {
        if (shouldLinkMerge(edge, type)) {
          nodeDegree[edge._from]--
          nodeDegree[edge._to]--
          linkMerged[edge._id] = true // 该边已经被合并
          return false
        }
        // 没有rule的一致行动关系直接忽略
        if (type === 'concert' && edge.type === 'concert' && !edge.rule) {
          nodeDegree[edge._from]--
          nodeDegree[edge._to]--
          return false
        }
        linkMerged[edge._id] = false  // 没有被合并的，以后也不许被合并；否则会少边
        return true
      })

      // 聚合点
      const idPostfix = centerNodeId.split('/')[1]
      const mergeNodeId = `${type}_mergeNode/${idPostfix}`
      const mergeNode = {
        _id: mergeNodeId,
        name: `${mergeEdgeMap[type].label}(${mergeNumMap[type]})`,
        mergeNum: mergeNumMap[type]
      }
      vertexes.push(mergeNode)

      // 聚合边；mergeEdge 无方向，从中央节点指向聚合点
      const mergeLink = {
        _id: `${type}_mergeEdge/${idPostfix}`,
        _from: centerNodeId,
        _to: mergeNodeId,
        source: centerNodeId,
        target: mergeNodeId
      }
      nodeDegree[mergeNodeId] = nodeDegree[mergeNodeId] ? nodeDegree[mergeNodeId] + 1 : 1
      nodeDegree[mergeLink._from]++
      edges.push(mergeLink)

      mergeChartData.vertexes.push(mergeNode)
      mergeChartData.edges.push(mergeLink)
    })
    // 设置边是否被合并标记位
    edges.forEach((edge) => {
      if (!linkMerged[edge._id]) {
        edge.hasShown = true
      }
    })

    // 清除没有边与之相连的点
    vertexes = vertexes.filter((vertex) => nodeDegree[vertex._id])

    return {
      vertexes: vertexes,
      edges: edges,
      mergeChartData: mergeChartData
    }
  },

  /**
 * 将过多的同类型叶子点聚合成一个点
 * @param {Array} nodes nodes
 * @param {Array} links links
 * @return {Object} nodes, links and mergeChartData
 */
  mergeLeaves: function (nodes, links) {
    /** remove merged links and nodes */
    nodes = nodes.filter((n) => !n._id.includes('mergeNode'))
    links = links.filter((l) => !l._id.includes('mergeEdge'))

    /** 挑出所有的叶子节点（只和另一个点相连的节点） */
    const nodeMap = new Map(nodes.map((n) => [n._id, n]))
    const linkMap = new Map(links.map((l) => [l._id, l]))
    const adjMap = this.calcAdjMap(nodeMap, linkMap)
    const leafLinks = new Set()
    const leafNodes = new Set()

    adjMap.forEach((d, key) => {
      if (d.relateNodes.size === 1) {
        leafNodes.add(key)
        d.relateLinks.forEach((l) => {
          leafLinks.add(l)
        })
      }
    })

    /** 从 nodes 和 links 中去除叶子结点和相关边 */
    nodes = nodes.filter((n) => !leafNodes.has(n._id))
    links = links.filter((l) => !leafLinks.has(l._id))

    /** 对叶子结点和相关边进行聚合 */
    const leafRelateNodes = new Set()
    leafNodes.forEach((n) => {
      const relateNode = adjMap.get(n).relateNodes
      leafRelateNodes.add([...relateNode][0])
    })

    const mergeChartData = { nodes: [], links: [] }
    const minThreshold = Math.min(mainRelationThreshold, digRelationThreshold)
    leafRelateNodes.forEach((n) => {
      const relateData = adjMap.get(n)
      if (relateData.relateLinks.size < minThreshold) {
        return
      }

      /** 重新对子图以 leafRelateNode 为中心生成 type */
      const subLeafLinkId = [...relateData.relateLinks].filter((l) => leafLinks.has(l))
      this.setLinkTypes2(subLeafLinkId.map((l) => linkMap.get(l)), n)

      const typeCount = {}
      subLeafLinkId.forEach((l) => {
        const link = linkMap.get(l)
        const type = link.type
        if (typeCount[type]) {
          typeCount[type].count++
          typeCount[type].linkIds.add(l)
        } else {
          typeCount[type] = {
            count: 1,
            linkIds: new Set([l])
          }
        }
      })
      Object.keys(typeCount).forEach((e) => {
        if (mergeEdgeMap[e].threshold > typeCount[e].count) {
          return
        } else {
          const idPostfix = n.split('/')[1]
          const mergeNodeId = `${e}_mergeNode/${idPostfix}`
          const mergeNode = {
            _id: mergeNodeId,
            name: `${mergeEdgeMap[e].label}(${typeCount[e].count})`,
            mergeNum: typeCount[e].count
          }

          // 聚合边；mergeEdge 无方向，从中央节点指向聚合点
          const mergeLink = {
            _id: `${e}_mergeEdge/${idPostfix}`,
            _from: n,
            _to: mergeNodeId,
            source: n,
            target: mergeNodeId
          }
          mergeChartData.nodes.push(mergeNode)
          mergeChartData.links.push(mergeLink)

          typeCount[e].linkIds.forEach((id) => leafLinks.delete(id))
        }
      })
    })
    const remainLeafNode = new Set()
    leafLinks.forEach((l) => {
      const link = linkMap.get(l);
      [link._from, link._to].forEach((id) => {
        if (leafNodes.has(id)) {
          remainLeafNode.add(id)
        }
      })
    })

    /** 将聚合后的结果放入 nodes 和 links 中 */
    nodes = nodes.concat(mergeChartData.nodes)
    links = links.concat(mergeChartData.links)
    remainLeafNode.forEach((n) => {
      nodes.push(nodeMap.get(n))
    })
    leafLinks.forEach((l) => {
      links.push(linkMap.get(l))
    })

    // 名字适配，从兰州迁移过来
    return {
      vertexes: nodes,
      edges: links,
      mergeChartData: {
        vertexes: mergeChartData.nodes,
        edges: mergeChartData.links
      }
    }
  },

  calcAdjMap: function (nodeMap, linkMap) {
    const adjMap = new Map()
    linkMap.forEach((l) => {
      [l._from, l._to].forEach((nodeId) => {
        const relateId = nodeId === l._from ? l._to : l._from
        if (adjMap.has(nodeId)) {
          const relateData = adjMap.get(nodeId)
          relateData.relateNodes.add(relateId)
          relateData.relateLinks.add(l._id)
        } else {
          adjMap.set(nodeId, {
            relateNodes: new Set([relateId]),
            relateLinks: new Set([l._id])
          })
        }
      })
    })
    return adjMap
  },

  /**
   * 对图数据进行预处理
   * note: 调用时需要 .bind(this)  // 是否有更好的办法？
   * @param {Object} data { vertexes: [], edges: [] }
   * @param {Object} centerNodeId id of center vertex
   * @return {Object} data { vertexes: [], edges: [] }
   */
  preprocessChartData (data, centerNodeId) {
    /**
     * 对点进行格式化
     * @param {Object} vertexes vertexes
     * @return {Array} 经过处理后的点
     */
    function formatNodeData (vertexes) {
      return vertexes.map((vertex) => {
        vertex._type = vertex._id.split('/')[0]
        return vertex
      })
    }

    /**
     * 对边进行格式化，定义需要用到的属性
     * @param  {Object} edges edges
     * @return {Array} 经过处理后的边
     */
    function formatEdgeData (edges) {
      let belongNodeIds = []
      if (belongBank) {
        belongNodeIds = vertexes.filter((vertex) => vertex[belongBank]).map((vertex) => vertex._id)
      }

      return edges.map((edge) => ({
        source: edge._to,
        target: edge._from,
        _from: edge._from,
        _to: edge._to,
        _id: edge._id.includes('/') ? edge._id : `edge/${edge._id}`,
        label: edge.label,
        rmb_label: edge.rmb_label,
        type: edge._id.split('/')[0], // 会在 setLinkTypes 中被转化为群体关系中的边
        _type: edge._id.split('/')[0],
        hasShown: edge.hasShown,
        rule: edge.rule,
        isTwoWay: edge.isTwoWay,
        belongBank: belongNodeIds.includes(edge._from) && belongNodeIds.includes(edge._to),
        concertTarget: edge.rule && edge._id.includes('concert')
          ? edge.concertTarget || edge.target : undefined  // 会和target 冲突，重备份一个
      }))
    }

    const belongBank = LP_PARAMS['Company_cluster'].belongBank
    const chartData = Object.assign({}, data)
    let edges = chartData.edges || []
    let vertexes = chartData.vertexes || []

    edges.forEach((e) => {
      if (!e._id.includes('/')) {
        e._id = 'group/' + e._id  // 防止出现边的 id 开头不为 abc/ 的情况
      }
    })

    vertexes = formatNodeData(vertexes)
    edges = formatEdgeData(edges)
    this.uniqTradableShareAndInvest(edges)  // 两个点之间如果同时连有 tradable_share 和 invest，删除 invest
    this.setLinkTypes(vertexes, edges, centerNodeId)

    return {
      vertexes,
      edges
    }
  },

  cutConcertExplainNodesAndEdges (vertexes, edges, rule) {
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
  },

  /**
   * 将两点之间的同类型多条边聚合成一条
   * @param {Array} edges 边数组
   */
  mergeMultiRelation (edges) {
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
}
