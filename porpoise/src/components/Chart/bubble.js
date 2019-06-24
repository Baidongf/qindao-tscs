import React from 'react'
import { connect } from 'react-redux'
import { setRenderChartStatus } from 'actions/Chart'
import { setZoomStatus } from 'actions/InitOperateBtn'
// import { edgeColorTypes } from 'graph.config'
import * as d3 from 'd3'

const INIT_MSG = '当前节点过多，已为您切换展现方式，点击节点查看关联详情'

class BubbleGraph extends React.Component {
  constructor (props) {
    super(props)

    // 二维数组，外层元素表示路径的集合，里层元素表示图node对象
    this.nodeInPath = []

    // 邻接表,结构体如this.vertexes，只是在每个 node对象内新增一个siblings(<Array>)属性用于记录相邻的点
    this.adjacencyList = []

    // 用于记录图节点id在邻接表对应的index位置
    this.noIdIndexMap = {}

    // 用于记录查找到的所有边对象
    this.pathsEdges = []

    // 用于记录当前选中图的中心节点
    this.coreNode = null
    this.clickedNode = null
    this.r = 35
    this.state = {
      initMsg: this.props.isNodeMax ? INIT_MSG : '',
      showGraph: false,
      shortestPathLength: 0,
      theme: this.props.theme
    }
    this.options = {
      // COMPANY_COLOR: '#63A3EF',
      // PERSON_COLOR: '#9BCB70'
      light: {
        GROUP_CORE_COLOR: '#FF5251',
        NOT_LISTED_COMPANY_COLOR: '#0988FF',
        LISTED_COMPANY_COLOR: '#2AD3C5',
        PERSON_COLOR: '#FF9D13'
      },
      deep: {
        GROUP_CORE_COLOR: '#E64A49',
        NOT_LISTED_COMPANY_COLOR: '#087AE6',
        LISTED_COMPANY_COLOR: '#26BEB1',
        PERSON_COLOR: '#E68D11'
      }
    }

    // 用于记录两个node间的连接边的数目
    this.linksNumMap = {}
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.theme !== nextProps.theme) {
      this.setState({
        theme: nextProps.theme
      })
      // 因为图表的渲染要由svg变成canvas，所以暂且不改动这里的颜色，因此切换主题不实时渲染图表
      // this.start(nextProps.clusterChartData)
    }

    if (this.props.clusterChartData !== nextProps.clusterChartData) {
      this.start(nextProps.clusterChartData)
      this.setState({
        initMsg: INIT_MSG
      })
    }
    // 当切换选中的要至于屏幕中央的族谱群点时，执行居中操作
    if (this.props.centerClusterNode !== nextProps.centerClusterNode) {
      this.autoClick(nextProps.centerClusterNode.id)
    }

    if (this.props.personClusterNode !== nextProps.personClusterNode) {
      this.selectNodePath(nextProps.personClusterNode.id, nextProps.personClusterNode.showType)
    }
  }

  componentDidMount () {
    if (Object.keys(this.props.clusterChartData).length) {
      this.start(this.props.clusterChartData)
    }
  }

  componentWillUnmount () {
    this.simulation && this.simulation.on('tick', null)
  }

  start (chartData) {
    // 开始画图
    this.props.setRenderChartStatus('drawing')
    this.setState({
      showGraph: false
    })
    this.draw(chartData)

    // 画图完成
    this.props.setRenderChartStatus('success')
    this.setState({
      showGraph: true
    })
  }

  normalizePageRank(vertexes) {
    const pageRanks = vertexes.map((v) => v.page_rank || 0)
    pageRanks.sort((a, b) => a > b ? -1 : 1)
    const max = Math.max.apply(null, pageRanks)
    const min = Math.min.apply(null, pageRanks)
    // top5 pageRank 设为 2，其他为 1.2
    let top5 = pageRanks[0]
    if (pageRanks.length > 5) {
      top5 = pageRanks[4]
    }
    vertexes.forEach((v) => {
      if (v.page_rank === undefined) {
        v.pageRank = 1.3
        if (v._id === this.coreNode._id) {
          v.pageRank = 2
        }
        return
      }
      v.pageRank = v.page_rank > top5 ? 2 : 1.3
    })
  }

  /**
   * @desc 往邻接表增加相邻关系
   */
  addSibling(headNodeId, siblingNodeId) {
    if (!this.adjacencyList[this.noIdIndexMap[headNodeId]].siblings) {
      this.adjacencyList[this.noIdIndexMap[headNodeId]].siblings = []
    }
    this.adjacencyList[this.noIdIndexMap[headNodeId]].siblings.push(this.adjacencyList[this.noIdIndexMap[siblingNodeId]])
  }

  findPath(node) {
    let siblings = node.siblings || [] // 数组，相邻节点
    node.exploring = true
    let _this = this
    siblings.forEach(function (sibling) {
      if (sibling.visited || sibling.exploring) return // 防止出现成环的情况

      sibling.pre = node // 记录每次路径探索时节点的上一级节点，用于路径回溯
      if (sibling._id === _this.coreNode._id) { // 抵达起点
        _this.backTrace(sibling)
      } else {
        _this.findPath(sibling)
      }
    })
    node.exploring = false
    node.visited = true
  }

  backTrace(node) {
    let cur = node
    let path = [cur]
    while (cur.pre) { // 终点的 pre 属性为 undefined，循环终止
      path.push(cur.pre)
      cur = cur.pre
    }
    this.nodeInPath.push(path)
  }

  /**
   * 定义箭头
   * @param {Object} svg 要添加进的 svg
   * @param {String} id 箭头 id
   * @param {Number} refX refX 位置
   * @param {String} pathDescr path d 元素
   * @param {String} className 箭头 class
   */
  defineArrow(svg, id, refX, pathDescr, className = '') {
    this.svg.append('defs')
      .append('marker')
      .attr('id', id)
      .attr('class', 'arrow-marker ' + className)
      .attr('refX', -refX)
      .attr('refY', 10)
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('markerWidth', 40)
      .attr('markerHeight', 40)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', pathDescr)
  }

  /**
   * 使用 d3 绘制气泡图
   * @param {Object} chartData 图数据 { vertexes: [], edges: [] }
   */
  draw(chartData) {
    this.vertexes = []
    this.edges = []
    const _this = this

    for (let i in chartData) {
      if (chartData.hasOwnProperty(i)) {
        this.vertexes.push(...chartData[i].vertexes)
        this.edges.push(...chartData[i].edges)
      }
    }

    this.edges.forEach((e) => {
      e.source = e._to
      e.target = e._from
    })

    d3.select('svg').html('')

    // 当前只有单选的需求，所以第一个默认为选中的核心节点
    let checkedNodeId = Object.keys(chartData)[0]
    this.vertexes.forEach((node) => {
      if (node._id === checkedNodeId) {
        this.coreNode = node
      }
    })
    if (!this.coreNode) {
      this.coreNode = this.vertexes[0] // 必须要有一个核心企业
    }
    this.normalizePageRank(this.vertexes)

    this.adjacencyList = this.vertexes
    this.adjacencyList.forEach((node, index) => {
      this.noIdIndexMap[node._id] = index
    })

    d3.select('svg').selectAll('g').remove()
    this.svg0 = d3.select('svg.bubble-chart')
    this.svg = this.svg0.append('g').classed('chart-layer', true)
    this.svg.append('g')
      .classed('links', true)
    this.svg.append('g')
      .classed('nodes', true)
    let width = +this.svg.attr('width')
    let height = +this.svg.attr('height')

    const minWidth = Math.sqrt(this.vertexes.length) * this.r * 4
    if (minWidth > width) {
      width = minWidth
      height = minWidth
    }

    /** 注册缩放事件 */
    function zoom () {
      let transformStr = ''
      let scale = d3.event.transform.k
      transformStr = 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') ' +
        'scale(' + scale + ')'
      _this.props.setZoomStatus({
        scale: scale,
        isMaxScale: scale >= 2,
        isMinScale: scale <= 0.5
      })
      _this.svg.attr('transform', transformStr)
    }

    // 注册缩放事件
    this.zoomListener = d3.zoom().scaleExtent([0.5, 2]).on('zoom', zoom)
    // 缩放配置
    this.svg0.call(this.zoomListener)
    // 清空缩放事件
    let t = d3.zoomIdentity.translate(0, 0).scale(1)
    this.svg0.call(this.zoomListener.transform, t)
    /** 缩放事件 end */

    const pack = d3.pack().size([width, height]).padding(3)
    this.root = d3.hierarchy({
        children: this.vertexes
      })
      .sum(function (d) {
        return 1
      })
      .sort(function (a, b) {
        return a.data.pageRank - b.data.pageRank ? -1 : 1
      })
      .each(function (d) {
        let id = d.data._id
        if (id) {
          d.class = (id.indexOf('/') > -1 && id.split('/')[0].toLowerCase())
        }
      })

    let node = this.svg
      .select('.nodes')
      .selectAll('.node')
      .data(pack(this.root).leaves()).enter().append('g').attr('class', 'node')
      .attr('id', (d) => d.data._id)
      .attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })

    this.nodeIdToIndex = {}
    this.root.children.forEach((item, index) => {
      this.nodeIdToIndex[item.data._id] = index
    })

    this.setCenterClusterNode(this.coreNode._id)

    // 气泡
    node.append('circle')
      .attr('r', (d) => {
        if (d.data.pageRank === undefined) {
          if (d.data._id === this.coreNode._id) {
            d.data.pageRank = 2
          } else {
            d.data.pageRank = parseFloat(Math.random().toFixed(1)) + 1 // mock
          }
        }
        return this.r * d.data.pageRank
      })
      .style('fill', (d) => {
        if (d.data._type === 'Company') {
          if (d.data._id === this.coreNode._id) {
            return this.options[this.state.theme].GROUP_CORE_COLOR
          }
          if (d.data.is_listed && d.data.is_listed !== 'false') {
            return this.options[this.state.theme].LISTED_COMPANY_COLOR
          } else {
            return this.options[this.state.theme].NOT_LISTED_COMPANY_COLOR
          }
        } else {
          return this.options[this.state.theme].PERSON_COLOR
        }
      })
      .attr('class', function (d) {
        return d.class
      })
      .classed('node-circle', true)
      .attr('name', function (d) {
        return d.data.name
      })
      .append('title')
      .text((d) => d.data.name)

    // 标识区
    const tagMap = {
      // 黑名单需要测试
      is_blacklist: {
        color: '#000',
        shiftX: -0.3
      },
      is_black: {
        color: '#000',
        shiftX: -0.3
      },
      is_Black: {
        color: '#000',
        shiftX: -0.3
      },
      belong_inner: {
        color: '#60A1F1',
        shiftX: 0
      },
      is_abnormal_status: {
        color: '#D0021B',
        shiftX: 0.3
      }
    }
    Object.keys(tagMap).forEach((type) => {
      node.append('path')
        .attr('d', d3.symbol().type(d3.symbolTriangle).size(60))
        .attr('transform', (d) => `translate(0, ${this.r * d.data.pageRank * 0.75})`)
        .attr('fill', (d) => {
          // console.log(d.data)
          if (d.data[type] && d.data[type] !== 'false') {
            return tagMap[type].color
          } else {
            return 'none'
          }
        })
    })
    // node.append('circle')
    //   .attr('fill', (d) => {
    //     if (d.data[type] && d.data[type] !== 'false') {
    //       return tagMap[type].color
    //     } else {
    //       return 'none'
    //     }
    //   })
    //   .attr('r', (d) => d.r * 0.1)
    //   .attr('cx', (d) => tagMap[type].shiftX * this.r * d.data.pageRank)
    //   .attr('cy', (d) => this.r * d.data.pageRank * 0.8)
    // })
    // node.append('path')
    //   .attr('d', d3.symbol().type(d3.symbolSquare).size(60))
    //   .attr('transform', (d) => `translate(0, ${-this.r * d.data.pageRank * 0.75})`)
    //   .attr('fill', (d) => {
    //     if (d.data._id === this.coreNode._id) {
    //       // 集团核心标示的三角形颜色
    //       return '#FF5251'
    //     } else {
    //       return 'none'
    //     }
    //   })

    node.append('text')
      .attr('class', 'node-name')
      .call(this.formatNodeName.bind(this))
      .selectAll('tspan')
      .data(function (d) {
        return d.data.name.split(/(?=[A-Z][^A-Z])/g)
      })
      .enter()
    // 鼠标悬浮显示节点文字内容
    node.append('title')
    .text(function (d) {
      return d.data.name.split(/(?=[A-Z][^A-Z])/g)
    })
    // 生成邻接表
    this.edges.forEach((edge) => {
      this.addSibling(edge._from, edge._to)
      this.addSibling(edge._to, edge._from)
    })

    for (let i = 0; i < 10; i++) {
      let length = this.r * (1 + (i / 10))
      this.defineArrow(this.svg, 'arrow_' + i, length, 'M20,0 L0,10 L20,20 L15,10 z')
    }

    /** 注册点击事件 */
    this.bindNodeClick()
    this.bindContainerClick()
    /** 点击事件 end */
    // 绑定放大缩小事件
    this.bindZoom()
  }

  bindZoom () {
    /** 自定义事件 */
    d3.select('body').on('bubble_zoom', () => {
      let scale = d3.event.detail.scale || 1 // 缩放比例
      // 以中心结点为中心放大缩小，因此可视宽高减去缩放的中心结点的坐标则可得到正确的偏移量，将中心节点偏移到屏幕中心
      let shiftX = window.innerWidth / 2 - this.centerNode.x * scale
      let shiftY = window.innerHeight / 2 - this.centerNode.y * scale
      let t = d3.zoomIdentity.translate(shiftX, shiftY).scale(scale)
      this.svg.call(this.zoomListener.transform, t)
    })
  }

  bindNodeClick () {
    this.svg0.selectAll('.node').on('click', (e) => {
      this.clickNodeHandler(e)
      d3.event.stopPropagation()
    })
  }
  bindContainerClick() {
    this.svg0.on('click', () => {
      if (d3.event.target.nodeName !== 'svg') return
      this.resetForce()
    })
  }

  resetForce() {
    this.simulation && this.simulation.stop()
    this.start(this.props.clusterChartData)
    this.setState({
      shortestPathLength: 0
    })
    this.props.toggleCardType && this.props.toggleCardType('Company_cluster')
  }

  drawNodeAndLine(nodeSet) {
    this.linksNumMap = {}
    const linkDirection = {}

    this.svg0.selectAll('.node')
      .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
      .classed('node-in-path', false)
      .classed('current-node', false)
    this.svg0.selectAll('.node circle').attr('opacity', 0.2)
    this.svg0.selectAll('.node .node-name').attr('opacity', 0.5)

    this.svg0.selectAll('g.node').sort((a, b) => {
      const isAInPath = [...nodeSet].some((n) => n._id === a.data._id)
      if (isAInPath) {
        const id = a.data._id
        const g = this.svg0.select('.node[id="' + id + '"]')
        g.classed('node-in-path', true)
        g.select('circle').attr('opacity', 1)
        g.select('.node-name').attr('opacity', 1)
        if (id === this.clickedNode._id) {
          g.classed('current-node', true)
        }
      }
      return isAInPath ? 1 : -1
    })

    let _this = this
    this.pathsEdges.forEach(function (edge) {
      if (_this.linksNumMap[edge._from + edge._to] === undefined) {
        _this.linksNumMap[edge._from + edge._to] = _this.linksNumMap[edge._to + edge._from] = 1
        linkDirection[edge._from + edge._to] = linkDirection[edge._to + edge._from] = edge._from
      } else {
        _this.linksNumMap[edge._from + edge._to]++
        _this.linksNumMap[edge._to + edge._from]++
      }
      edge.linkIndex = _this.linksNumMap[edge._from + edge._to]
    })
    this.pathsEdges.forEach(function (edge) {
      edge.linkNum = _this.linksNumMap[edge._from + edge._to]
      edge.labelDirection = linkDirection[edge._from + edge._to] === edge._from ? 1 : 0
    })

    const lineEnter = this.svg0.select('.links')
      .selectAll('g')
      .data(this.pathsEdges)
      .enter()
      .append('g')
    this.lineEnter = lineEnter

    const pathEnter = lineEnter.append('path')
      .attr('linkIndex', (d) => d.linkIndex)
      .attr('linkMap', (d) => d.linkNum)
      .attr('marker-start', (d) => {
        const v = this.root.children.find((c) => c.data._id === d._to)
        let idx = Math.floor((v.data.pageRank - 1) * 10)
        idx = idx < 10 ? idx : 9
        return `url(#arrow_${idx})`
      })
      .classed('line', true)

    lineEnter.append('defs')
      .append('path')
      .attr('id', (d) => d._id.replace('/', '_') + '_reverse')

    // 计算 edge 的 path, 多条路径时计算弧度
    pathEnter.each(function (d, i, g) {
      let fromIndex = _this.nodeIdToIndex[d._to]
      let toIndex = _this.nodeIdToIndex[d._from]
      let x1 = _this.root.children[fromIndex].x
      let y1 = _this.root.children[fromIndex].y
      let x2 = _this.root.children[toIndex].x
      let y2 = _this.root.children[toIndex].y
      _this.setLinkPosition({
        x1,
        x2,
        y1,
        y2,
        d,
        i,
        g
      })
    })

    lineEnter.append('text')
      .attr('class', 'link-name')
      .attr('transform', (d, i, g) => {
        const fromIndex = _this.nodeIdToIndex[d._to]
        const toIndex = _this.nodeIdToIndex[d._from]
        const x1 = _this.root.children[fromIndex].x
        const x2 = _this.root.children[toIndex].x
        const y1 = _this.root.children[fromIndex].y
        const y2 = _this.root.children[toIndex].y
        let r = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
        if (Math.abs(y1 - y2) < r / 2) {
          return 'translate(0, -5)'
        } else if ((x1 > x2 && y1 > y2) ||
          (x1 < x2 && y1 < y2)) {
          return 'translate(5, 0)'
        } else if ((x1 > x2 && y1 < y2) ||
          (x1 < x2 && y1 > y2)) {
          return 'translate(-5, 0)'
        }
      })
      .append('textPath')
      .attr('xlink:href', function (d, i, g) {
        const fromIndex = _this.nodeIdToIndex[d._to]
        const toIndex = _this.nodeIdToIndex[d._from]
        const x1 = _this.root.children[fromIndex].x
        const x2 = _this.root.children[toIndex].x
        if (x1 > x2) {
          return `#${d._id.replace('/', '_')}_reverse`
        }
        return `#${d._id}`
      })
      .attr('startOffset', '52%')
      .text((d) => d.label)
      .attr('style', 'fill: #adadad')

    this.bindDragEvent()

    /** 用 force layout 布局高亮点、边 */
    this.drawForce([...nodeSet], this.pathsEdges)
  }

  selectNodePath(id, showType) {
    this.simulation && this.simulation.stop()
    this.svg0.selectAll('.links g').remove()
    this.pathsEdges = []
    this.clickedNode = this.adjacencyList.find((d) => d._id === id)

    if (id === this.coreNode._id) {
      this.resetForce()
      this.setState({
        shortestPathLength: 0
      })
      return
    }

    const nodeSet = new Set()

    this.pathsEdges = this.edges.filter((e) => {
      return e._from === id && e._id.includes(showType)
    })
    this.vertexes.forEach((v) => {
      if (this.pathsEdges.some((e) => e._to === v._id) || v._id === id) {
        nodeSet.add(v)
      }
    })

    this.drawNodeAndLine(nodeSet)
  }

  clickNodeHandler(e) {
    this.simulation && this.simulation.stop()
    this.props.getNodeInfo && this.props.getNodeInfo(e.data)
    this.svg0.selectAll('.links g').remove()
    const pathEdgeMap = new Map()
    this.pathsEdges = []
    this.linksNumMap = {}
    this.nodeInPath = []
    this.vertexes.forEach((node) => {
      node.visited = false
      node.pre = undefined
    })

    this.clickedNode = e.data
    if (this.clickedNode._id === this.coreNode._id) {
      this.resetForce()
      this.setState({
        shortestPathLength: 0
      })
      return
    }
    this.findPath(this.clickedNode)

    this.setState({
      shortestPathLength: Math.min.apply(null, this.nodeInPath.map((n) => n.length)) - 1,
      initMsg: ''
    })
    // 找出路径上的关系边
    this.nodeInPath.forEach((path) => {
      for (let i = 0, l = path.length; i < l - 1; i++) {
        this.edges.forEach((edge) => {
          if (edge._from === path[i]._id && edge._to === path[i + 1]._id ||
            edge._to === path[i]._id && edge._from === path[i + 1]._id
          ) {
            pathEdgeMap.set(edge._id, edge)
          }
        })
      }
    })
    this.pathsEdges = [...pathEdgeMap.values()]
    const nodeSet = new Set()
    console.log(nodeSet, this.pathsEdges)
    this.nodeInPath.forEach((path) => path.forEach((p) => nodeSet.add(p)))

    this.drawNodeAndLine(nodeSet)
  }

  setLinkPosition ({
    x1,
    x2,
    y1,
    y2,
    d,
    i,
    g
  }) {
    let dx = x2 - x1
    let dy = y2 - y1
    let dr = d.linkNum > 1 ? Math.sqrt((dx * dx) + (dy * dy)) : 0
    let middleIdx = (d.linkNum + 1) / 2

    if (d.linkNum > 1) {
      dr = d.linkIndex === middleIdx ? 0 :
        dr / (Math.log((Math.abs(d.linkIndex - middleIdx) * 0.6) + 1) +
          (1 / (10 * Math.pow(d.linkNum, 2)))) // 秘制调参
    }
    let sweepFlag = d.linkIndex > middleIdx ? 1 : 0
    if (d.labelDirection) sweepFlag = 1 - sweepFlag
    let path = 'M' + x1 + ',' + y1 +
      'A' + dr + ',' + dr + ' 0 0 ' + sweepFlag + ',' + x2 + ',' + y2

    // 自己指向自己
    if (d._from === d._to) {
      path = `M${x1} ${y1} C ${x1} ${y1 - 150},
            ${x1 + 150} ${y1}, ${x1} ${y1}`
    }

    d3.select(g[i])
      .attr('d', path)
      .attr('id', d._id)
      .attr('stroke', '#adadad')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('from', d._from)
      .attr('to', d._to)
    // 增加一条反向的路径, 用于旋转 label
    d3.select('#' + d._id.replace('/', '_') + '_reverse')
      .attr('d', 'M' + x2 + ',' + y2 +
        'A' + dr + ',' + dr + ' 0 0 ' + (1 - sweepFlag) + ',' + x1 + ',' + y1)
  }

  drawForce(nodes, links) {
    const _this = this
    const nodeMap = new Map()
    const linkMap = new Map()
    nodes.forEach((n) => nodeMap.set(n._id, n))
    links.forEach((l) => linkMap.set(l._id, l))
    const linkForce = d3.forceLink(links)
      .distance(350)
      .id((d) => d._id)

    const width = +this.svg0.attr('width')
    const height = +this.svg0.attr('height')
    const centerNode = this.root.children.find((vertex) => vertex.data._id === this.coreNode._id) || {
      x: 0,
      y: 0
    }

    this.simulation = d3.forceSimulation()
      .nodes(nodes)
      .force('links', linkForce)
      .force('charge_force', d3.forceManyBody().strength(-2500))
      .force('center_force', d3.forceCenter(centerNode.x, centerNode.y))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .force('colission', d3.forceCollide(30))
      .on('tick', tickActions.bind(this))

    this.setCenterClusterNode(this.coreNode._id)

    function tickActions() {
      _this.svg0.selectAll('.node').each((d, i, g) => {
        if (nodeMap.has(d.data._id)) {
          const transformStr = `translate(${d.data.x}, ${d.data.y})`
          d3.select(g[i]).attr('transform', transformStr)
        }
      })
      // 调整label和边的距离
      _this.svg0.selectAll('g .link-name').each(function (d, i, g) {
        let r = Math.sqrt(Math.pow(d.source.x - d.target.x, 2) + Math.pow(d.source.y - d.target.y, 2))
        if (Math.abs(d.source.y - d.target.y) < r / 2) {
          d3.select(g[i]).attr('transform', 'translate(0, -5)')
        } else if ((d.source.x > d.target.x && d.source.y > d.target.y) ||
          (d.source.x < d.target.x && d.source.y < d.target.y)) {
          d3.select(g[i]).attr('transform', 'translate(5, 0)')
        } else if ((d.source.x > d.target.x && d.source.y < d.target.y) ||
          (d.source.x < d.target.x && d.source.y > d.target.y)) {
          d3.select(g[i]).attr('transform', 'translate(-5, 0)')
        }
      })
      _this.svg0.selectAll('g .link-name textPath').each(function (d, i, g) {
        // 通过旋转 label, 使文字始终处于 edge 上方
        if (d.source.x > d.target.x) {
          d3.select(g[i]).attr('xlink:href', (d) => '#' + d._id.replace('/', '_') + '_reverse')
        } else {
          d3.select(g[i]).attr('xlink:href', (d) => '#' + d._id)
        }
      })
      _this.svg0.selectAll('.line').each((d, i, g) => {
        this.setLinkPosition({
          x1: d.source.x,
          y1: d.source.y,
          x2: d.target.x,
          y2: d.target.y,
          d,
          i,
          g
        })
      })
    }
  }

  /** 拖拽事件 */
  bindDragEvent() {
    const _this = this
    let startX = 0
    let startY = 0

    function dragStart(d) {
      if (!d3.event.active) _this.simulation && _this.simulation.alphaTarget(0.3).restart()
      d.data.fx = d.data.x
      d.data.fy = d.data.y
      startX = d.data.x
      startY = d.data.y
    }

    function drag(d) {
      d.data.fx = d3.event.x + startX - d.x // event 初始位置为气泡图定位，需要减去偏移
      d.data.fy = d3.event.y + startY - d.y
    }

    function dragEnd(d) {
      if (!d3.event.active) _this.simulation && _this.simulation.alphaTarget(0)
      d.data.fx = null
      d.data.fy = null
    }
    const dragHandler = d3.drag()
      .on('start', dragStart)
      .on('drag', drag)
      .on('end', dragEnd)

    dragHandler(this.svg.selectAll('.node.node-in-path'))
    /** 拖拽事件 end */
  }

  formatNodeName (d) {
    let _this = this

    d.each(function (value, idx, g) {
      let radius = value.r

      let thisText = d3.select(g[idx])

      let fontSize = 6
      if (radius > 40) {
        fontSize = 12
      } else if (radius > 20) {
        fontSize = 8
      } else if (radius > 12) {
        fontSize = 6
      }
      value.calcRes = {
        fontSize: fontSize,
        radius: radius
      }
      _this.setNodeNamePos(radius, fontSize, value, thisText)
    })
  }
  setNodeNamePos (radius, fontSize, value, thisText) {
    let n = Math.floor(Math.sqrt(2) * radius / fontSize) // 每一行的字数, 也是行数, 呈正方形
    const lineNum = n
    n -= 2 // 减两个字，防止超出圆形
    let name = value.data.name || ''
    let dY = name.length > n ? -fontSize : fontSize / 2
    let textStack = []
    let lineHeight = fontSize + 2
    // 文字过长以省略号显示
    while (name.slice(0, n).length + 2 === lineNum) {
      if (lineNum !== 1 && textStack.length === lineNum - 3) {
        name = name.slice(0, n - 3) + '...'
      }
      textStack.push({
        name: name.slice(0, n),
        dx: 0,
        dy: dY
      })
      dY += lineHeight
      name = name.slice(n)
    }
    textStack.push({
      name: name,
      dx: 0,
      dy: dY
    })

    thisText.selectAll('*').remove()
    textStack.forEach(function (v) {
      thisText.append('tspan')
        .text(v.name)
        .attr('y', v.dy)
        .attr('x', v.dx)
        .attr('fill', '#fff')
        .attr('style', 'font-size: ' + fontSize + 'px')
        .attr('text-anchor', 'middle')
    })
  }

  /**
   * 将点击的族谱群中的企业放在屏幕中央
   * @param {String} centerNodeId 要至于中心的族谱点
   */
  setCenterClusterNode (centerNodeId) {
    const vertexes = this.root.children
    const centerNode = vertexes.find((vertex) => vertex.data._id === centerNodeId) || {
      x: 0,
      y: 0
    }
    const shiftX = (window.innerWidth / 2) - centerNode.x
    const shiftY = (window.innerHeight / 2) - centerNode.y
    this.centerNode = centerNode
    let t = d3.zoomIdentity.translate(shiftX, shiftY).scale(1)
    this.svg0.call(this.zoomListener.transform, t)
  }

  autoClick (centerNodeId) {
    this.svg0.select(`.node[id='${centerNodeId}']`).dispatch('click')
  }

  render () {
    const {
      shortestPathLength,
      initMsg
    } = this.state
    const msg = initMsg || (shortestPathLength ? `选中节点名称是集团核心的${shortestPathLength}度关联节点` : '')
    return (
      <div id='chartSVG' >
        <svg className='chart-container bubble-chart'
          fontSize='12'
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ 'display': this.state.showGraph ? 'block' : 'none' }}
        />
        <p className='chart-title' > { msg} </p>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  clusterChartData: state.clusterChartData,
  centerClusterNode: state.centerClusterNode,
  personClusterNode: state.personClusterNode,
  isNodeMax: state.nodeStatus,
  theme: state.setTheme
})

const mapDispatchToProps = {
  setRenderChartStatus,
  setZoomStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(BubbleGraph)
