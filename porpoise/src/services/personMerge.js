import { EXPAND_PATH } from 'config'
import { authorizedFetch } from 'actions/Global'
import { edgeDigRelations } from 'graph.config'

/** 图中的人名 */
const graphPersonNames = {
  names: new Set(),
  save: function (vertexes) {
    vertexes.forEach((vertex) => {
      if (vertex._id.includes('Person')) {
        this.names.add(vertex.name)
      }
    })
  },
  clear: function () {
    this.names.clear()
  }
}

/** 可融合人 */
const mergePerson = {
  expandCache: new Map(), // 姓名: 图数据
  storeTypes: [],
  lastStoreTypes: [],
  expandEdgesTypes: ['person_merge', ...edgeDigRelations],

  /** 获取待展开的 person id set */
  _getToExpandPersonIds: function (vertexes, edges, isExpand) {
    const personIds = new Set()     // 将要展开的 id

    vertexes.forEach((v) => {
      if (v._type !== 'Person') return

      if (this.expandCache.has(v.name)) {   // 缓存命中, 直接提取
        const expandData = this.expandCache.get(v.name)
        edges.push(...expandData.edges)
        vertexes.push(...expandData.vertexes)
      } else if (this.storeTypes.includes('family')) { // 缓存未命中, 亲属关系打开, 展开
        personIds.add(v._id)
      } else if (this.storeTypes.includes('person_merge')) {    // 缓存未命中, 亲属关系未打开, 可融合打开, 如果是同名人, 展开
        if (graphPersonNames.names.has(v.name) && (this._isLinkToExpandEdges(v, edges) || isExpand)) {
          personIds.add(v._id)
        }
      } else {
        graphPersonNames.save(v.name)
      }
    })

    return personIds
  },

  /** 对人进行可融合查询 */
  _expandPerson: async function (vertexes, edges, personIds) {
    if (!personIds.size) return

    const body = {
      options: {
        edges: [{
          class: 'person_merge',  // 只需要进行可融合查询
          visible: true,
          trace_depth: 1
        }],
        ids: [...personIds]
      }
    }
    // 亲属关系需要对人按亲属关系展开
    if (this.storeTypes.includes('family')) {
      body.options.edges.push({
        class: 'family',
        visible: true,
        trace_depth: 1
      })
    }

    const params = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      mode: 'cors',
      body: JSON.stringify(body)
    }

    // 对重名人展开，加入待融合列表
    try {
      let data = await authorizedFetch(EXPAND_PATH, params)
      if (data.status) throw Error(data.msg)
      data = data.data
      if (this.storeTypes.includes('family')) {
        this._filterSingleFamilyIdNodes(data.vertexes, data.edges)
      }
      const chartData = preprocessChartData(data)
      this._setCache(data, this.storeTypes)
      edges.push(...chartData.edges)
      vertexes.push(...chartData.vertexes)
    } catch (e) {
      // 异常处理; 如果出错，直接融合同名人
      let uniquePerson = new Map()
      for (let i = 0; i < vertexes.length; i++) {
        const v = vertexes[i]
        if (!v._id.includes('Person')) continue

        if (!uniquePerson.has(v.name)) {
          uniquePerson.set(v.name, v)
        } else {
          edges.forEach((edge) => {
            if (edge._from === v._id) {
              edge._from = uniquePerson.get(v.name)._id
            } else if (edge._to === v._id) {
              edge._to = uniquePerson.get(v.name)._id
            }
          })
          vertexes.splice(i, 1)
          i--
        }
      }
    }
  },

  /** 获取可融合人及相连节点 */
  getMergePerson: async function (vertexes, edges, options, isExpand) {
    // 如果缓存条件改变，清空缓存
    this.storeTypes = []
    this.expandEdgesTypes.forEach((type) => {
      if (this._isEdgeVisible(options, type)) {
        this.storeTypes.push(type)
      }
    })
    if (this.lastStoreTypes.join() !== this.storeTypes.join()) {
      this.expandCache.clear()
    }

    const personIds = this._getToExpandPersonIds(vertexes, edges, isExpand)
    this._expandPerson(vertexes, edges, personIds)
  },

  _isEdgeVisible: function (options, className) {
    return options.edges.find((e) => e.class === className).visible
  },

  /** 点是否和展开得到的边相连 */
  _isLinkToExpandEdges: function (vertexes, edges) {
    return edges.filter((e) => this.expandEdgesTypes.includes(e._id.split('/')[0]))
      .some((e) => [e._from, e._to].includes(vertex._id))
  },

  // 异常处理, 排除只有一条亲属关系与family_id 相连的情况
  _filterSingleFamilyIdNodes: function (vertexes, edges) {
    const familyIdNodes = vertexes.filter((v) => v._type === 'Family_id')
    familyIdNodes.forEach((vertex) => {
      let singleEdgeIdx = []
      edges.forEach((e, idx) => {
        if (e._from === vertex._id || e._to === vertex._id) {
          singleEdgeIdx.push(idx)
        }
      })
      if (singleEdgeIdx.length === 1) {
        edges.splice(singleEdgeIdx[0], 1)
        let vertexId = vertexes.find((v) => v._id === vertex._id)
        vertexes.splice(vertexId, 1)
      }
    })
  },

  _setCache: function (data, storeTypes) {
    data.vertexes.forEach((v) => {
      if (!v._id.includes('Person')) return
      if (!this.expandCache.has(v.name)) {
        this.expandCache.set(v.name, { edges: [], vertexes: [] })
      }
      this.expandCache.get(v.name).vertexes.push(v)
      this.expandCache.get(v.name).edges.push(...data.edges.filter((e) => {
        const isInStoreTypes = this.storeTypes.some((v) => e._id.includes(v))
        return e._from === v._id && isInStoreTypes
      }))
    })
  
    // 亲属 Family_id 节点需要绑定至相应的人上
    data.vertexes.filter((v) => v._id.includes('Family_id')).forEach((v) => {
      data.edges.filter((e) => e._to === v._id).forEach((e) => {
        const person = data.vertexes.find((v) => v._id === e._from)
        this.expandCache.get(person.name).vertexes.push(v)
        this.expandCache.get(person.name).edges.push(e)
      })
    })
    this.lastStoreTypes = this.storeTypes
  }
}

/**
 * @desc 对一个图的边和点,进行融合处理
 *
 * @param { Array } vertexes 图的点
 * @param { Array } edges 边
 * 没有返回值,处理结果直接作用在传入的 vertexes & edges
 *
 * */
function mergeNodesAndEdges (vertexes, edges) {
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
        module.mergeNodeId = vertexes.some((vertex) => vertex._id === edgeObj._from) ? edgeObj._from : edgeObj._to
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
}
