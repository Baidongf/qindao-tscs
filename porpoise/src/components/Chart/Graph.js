import React from 'react'
import { connect } from 'react-redux'
import { GraphUtil } from './GraphUtil'
import chartService from 'services/chart'
import doraemon from 'services/utils'
import relationGroupService from 'services/relationGroup'
import {
  setRenderChartStatus, setCurNode, updateMergeChartData,
  setMergeChartData, setOriginChartData
} from 'actions/Chart'
import { cleanMergeData } from 'actions/Card'
import { setZoomStatus } from 'actions/InitOperateBtn'
import { groupIconMap, riskStatus, objTypes, edgeDigRelations, eventRelations, edgeColorTypes } from 'graph.config'
import { LP_PARAMS } from 'config'
import * as d3 from 'd3'
import PropTypes from 'prop-types'

// import { url } from 'inspector';

/**
 * 绘制图谱
 */
class Graph extends React.Component {
  /**
   * @param  {Object} props props
   */
  constructor (props) {
    super(props)

    this.state = {
      showGraph: false
    }
    this.belongBank = LP_PARAMS['Company_cluster'].belongBank
    this.clickedNode = null
    this.dragingNode = null
    this.clickAgain = false
    this.vertexes = [] // 用于画图的点
    this.edges = []

    this.selectNode = this.selectNode.bind(this)
  }

  /**
   * @param  {Object} nextProps next props
   * @param  {Object} nextState next state
   */
  async componentWillReceiveProps (nextProps, nextState) {
    if (this.props.operateChartStatus !== nextProps.operateChartStatus) {
      const { operateChartStatus } = nextProps
      // 初次打开图谱
      if (operateChartStatus === 'init') {
        this.init()
      }
      // 展开 & 连续展开
      // note: 可能连续进行的操作都会加上时间戳后缀, 防止 nextProps 和 this.props 的状态相同
      if (operateChartStatus.includes('expand_single')) {
        this.expand()
      }
      // 改变筛选条件
      if (operateChartStatus === 'change_filter_options') {
        this.props.cleanMergeData()  // 清空已勾选显示的聚合数据
        // 画图在 operateChartStatus = 'init' 中完成
      }
      // 直接展示，不做任何处理
      if (operateChartStatus.includes('show_origin')) {
        this.showOrigin(nextProps.originChartData)
      }
      if (operateChartStatus.includes('show_history')) {
        this.showHistory(nextProps.originChartData)
      }
      // 勾选聚合列表中的数据显示于图中
      if (operateChartStatus.includes('select_merge_data')) {
        this.insertMergeDataAndRender(nextProps.selectedMergeData)
      }
      // 一致行动关系图谱解释
      if (operateChartStatus.includes('show_concert_explain')) {
        const rule = operateChartStatus.split('/')[1]
        this.showConcertExplain(nextProps.originChartData, rule)
      }
    }

    // 族谱群选中、取消时触发
    if (this.props.clusterChartData !== nextProps.clusterChartData) {
      this.renderClusterData(nextProps.clusterChartData)
    }
    // 担保族谱群选中、取消时触发
    if (this.props.guaranteeClusterChartData !== nextProps.guaranteeClusterChartData) {
      this.renderClusterData(nextProps.guaranteeClusterChartData)
      // 高亮路径
      // this.highlightLinkPaths(nextProps.highlightLinkIds)
    }
    // 当切换选中的要至于屏幕中央的族谱群点时，执行居中操作
    if (this.props.centerClusterNode !== nextProps.centerClusterNode) {
      this.setCenterClusterNode(nextProps.centerClusterNode.id)
    }
    // 当选中自然人列表的图中显示按钮时，显示对应showType需要展示的边
    if (this.props.personClusterNode !== nextProps.personClusterNode) {
      console.log(this.edges, this.vertexes)
      this.selectNodePath(nextProps.personClusterNode.id, nextProps.personClusterNode.showType)
    }
  }

  componentDidUpdate (prevProps) {
    // 直接展示图谱，重构中
    if (prevProps.displayChartData !== this.props.displayChartData) {
      this.displayChart()
    }
  }

  componentDidMount () {
    const { reduxLocation, clusterChartData } = this.props
    if (reduxLocation.pathname.includes('/cluster/detail')) {
      this.renderClusterData(clusterChartData)
    }
  }

  /**
   * 对人进行展开
   * @param {Object} vertexes 点
   * @param {Object} edges 边
   * @param {Object} isExpand 是否为展开阶段，展开时只要开启了可融合就要执行人物搜索
   */
  async getMergePerson (vertexes, edges, isExpand) {
    let shouldSearch = [...edgeDigRelations, ...eventRelations].some((edge) => this._isEdgeVisible(edge)) || isExpand
    if (shouldSearch && this._isEdgeVisible('person_merge')) {
      await GraphUtil.getMergePerson(vertexes, edges, this.props.filterOptions, isExpand)
    }
  }

  /**
   * options 中边 visible 是否为 true
   * @param  {String} edgeClassName 边名称
   * @return {Boolean} is edge visible
   */
  _isEdgeVisible (edgeClassName) {
    const edge = this.props.filterOptions.edges.find((e) => e.class === edgeClassName) || {}
    return edge.visible
  }

  /**
   * 根据边的类型进行聚合
   */
  mergeRelation () {
    const mergeData = relationGroupService.mergeRelation(this.vertexes, this.edges, this.props.curNode._id)
    // const mergeData = GraphUtil.mergeRelation(this.vertexes, this.edges, this.props.curNode._id)
    this.props.updateMergeChartData(mergeData.mergeChartData.vertexes, mergeData.mergeChartData.edges)
    this.vertexes = mergeData.vertexes
    this.edges = mergeData.edges
    GraphUtil.mergeMultiRelation(this.edges)  // 将两个节点之间的同类型的多条边聚合成一条
    this.setIndex() // 因为聚合了一些点，需要重新计数
  }

  /**
   * 画图
   */
  go () {
    try {
      this.initCanvas()
        .initChartLayers()
        .renderChart()
        .bindEvents()
    } catch (e) {
      if (e.message.includes('missing:')) {   // 如果缺少某个点, 删除所有和这个点有关的边
        const missNodeId = e.message.split('missing: ')[1] || ''
        this.edges = this.edges.filter((l) => l._from !== missNodeId && l._to !== missNodeId)
        this.go()
      } else {
        console.error(e)
        this.props.setRenderChartStatus('fail')
      }
    }
  }

  /**
   * 初始化画布
   * @return {Object} this
   */
  initCanvas () {
    d3.selectAll('svg > *').remove()
    this.svg = d3.select('svg')
    this.width = this.svg.attr('width')
    this.height = this.svg.attr('height')
    this.r = 30
    this.rSmall = 0.75 * this.r
    this.imageWidth = 25
    this.centerIdList = []

    return this
  }

  /**
   * 设置svg结构
   * @return {Object} this
   */
  initChartLayers () {
    this.svg.append('g')
    // .attr('class', 'zoom-layer')
    this.svg.append('g')
      .attr('class', 'chart-layer')
      .append('g')
      .attr('class', 'links')
    this.svg.select('.chart-layer')
      .append('g')
      .attr('class', 'nodes')

    return this
  }

  /**
   * 绑定事件
   * @return {Object} this
   */
  bindEvents () {
    /**
     * dragStart 开始拖拽
     * @param  {Object} d vertex
     */
    function dragStart (d) {
      if (!d3.event.active) _this.simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    /**
     * 拖动
     * @param {Object} d vertex
     */
    function drag (d) {
      if (!_this.draging) {
        _this.draging = true
        _this.dragNode = d
        _this.selectNode(d)
      }
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    /**
     * 结束拖动
     * @param {Object} d vertex
     */
    function dragEnd (d) {
      _this.draging = false

      if (!d3.event.active) _this.simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    /**
     * 点击边
     * @param {Object} e edge
     */
    function selectEdge (e) {
      _this.props.getEdgeInfo(e)
    }

    /**
     * 鼠标 hover 点
     * @param {Object} d vertex
     */
    function mouseOverHandler (d) {
      if (_this.draging) {
        return
      }
      let type = d._id.split('/') && d._id.split('/')[0]
      const target = d3.event.target
      if (!objTypes.includes(type) || _this.props.curNode._id === d._id ||
        (_this.clickedNode && _this.clickedNode._id === d._id)) {
        return
      }

      // 切换至 hover 态 vertex icon
      d3.select(target).attr('xlink:href', (d) => {
        let typePostfix = _this.getNodeType(d)
        return '/graph/' + type + '_hover.svg'
      })
      // 切换 vertex class
      d3.select(target.parentNode).attr('class', 'node hover-node')
    }

    /**
     * 鼠标移开点
     * @param {Object} d vertex
     */
    function mouseOutHandler (d) {
      if (_this.draging) {
        return
      }
      const target = d3.event.target
      // 换回原始 vertex icon
      d3.select(target).attr('xlink:href', (d) => _this.setNodeIcon(d))
      // 切换 vertex class
      d3.select(target.parentNode).attr('class', (d, i, g) => _this.setNodeClass(d, i, g))
    }

    let _this = this

    /** 缩放 */
    function zoom () {
      var transformStr = ''
      var scale = d3.event.transform.k
      transformStr = 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') ' +
        'scale(' + scale + ')'
      _this.props.setZoomStatus({
        scale: scale,
        isMaxScale: scale >= 2,
        isMinScale: scale <= 0.5
      })
      d3.select('g.chart-layer').attr('transform', transformStr)
    }

    // 注册缩放事件
    this.zoomListener = d3.zoom().scaleExtent([0.5, 2]).on('zoom', zoom)
    // 缩放配置
    // this.svg.select('.zoom-layer').attr('width', this.width)
    //   .attr('height', this.height)
    this.svg.call(this.zoomListener)
    // 清空缩放事件
    let t = d3.zoomIdentity.translate(0, 0).scale(1)
    this.svg.call(this.zoomListener.transform, t)

    // 绑定放大缩小事件
    this.bindZoom()
    // 点击事件
    d3.selectAll('svg').on('click', () => {
      if (d3.event && d3.event.target.nodeName === 'svg') {
        this.clickedNode = null
        this.svg.selectAll('.nodes .node').attr('class', (d) => 'node')
        this.svg.selectAll('.node image').attr('xlink:href', (d) => this.setNodeIcon(d))
        d3.selectAll('g .node-name')
          .attr('class', (d) => {
            return 'node-name'
          })

        d3.selectAll('g .link').each((d, i, g) => {
          d3.select(g[i]).attr('class', (d) => _this.setLinkClass(d, g[i]))
        })
        this.hideFluidCircle()
      }
    })
    this.svg.selectAll('.node image').on('click', this.selectNode)
    if (!['/graph/guarantee_risk', '/graph/blacklist_cheat', '/graph/risk_analysis'].includes(this.props.reduxLocation.pathname)) {
      this.svg.selectAll('.node image').on('mouseover', mouseOverHandler)
      this.svg.selectAll('.node image').on('mouseout', mouseOutHandler)
    }
    // 边上点击事件
    this.svg.selectAll('.links .clickable-link').on('click', selectEdge)

    // 拖拽配置
    let dragHandler = d3.drag()
      .on('start', dragStart)
      .on('drag', drag)
      .on('end', dragEnd)

    dragHandler(this.svg.selectAll('.node'))

    return this
  }

  bindZoom () {
    /** 自定义事件 */
    d3.select('body').on('force_zoom', () => {
      let scale = d3.event.detail.scale || 1 // 缩放比例
      // 放大缩小中心偏移量，使得始终图谱中心放大缩小
      let shiftX = -(window.innerWidth * (scale - 1) / 2)
      let shiftY = -(window.innerHeight * (scale - 1) / 2)
      let t = d3.zoomIdentity.translate(shiftX, shiftY).scale(scale)
      this.svg.call(this.zoomListener.transform, t)
    })
  }

  /**
   * 判断点是否属于行内数据
   * @param {Object} vertex vertex
   * @return {Boolean} 是否为行内数据
   */
  isBelongBankNode (vertex) {
    if (!this.belongBank) return false
    return vertex[this.belongBank] && vertex._id.includes('Company')
  }

  /**
   * 选中点
   * @param {Object} d vertex
   */
  selectNode (d) {
    const _this = this
    // curNode 不会立即更新，需要一个内部变量指示当前点
    if (!this.clickAgain && this.clickedNode && this.clickedNode._id === d._id) {
      this.clickAgain = true
      this.clickedNode = null
    } else {
      this.clickAgain = false
      this.clickedNode = d
    }
    this.props.getNodeInfo(d)

    if (['/graph/guarantee_risk'].includes(this.props.reduxLocation.pathname)) {
      return
    }

    if (this.draging) {
      this.clickedNode = null
    }

    this.hideFluidCircle()

    // 高亮选中的点，清除其他点的高亮
    this.svg.selectAll('.nodes .node').attr('class', (d, i, g) => this.setNodeClass(d, i, g))
    this.svg.selectAll('.node image').attr('xlink:href', (d) => this.setNodeIcon(d))

    d3.selectAll('g .node-name')
      .attr('class', (d) => {
        let className = 'node-name'
        if (_this.props.reduxLocation.query.lp_type === 'Company_cluster' && !_this.isBelongBankNode(d)) {
          className += ' node-name-blur'
        }
        if (!_this.clickAgain && _this.props.curNode._id === d._id) {
          className += ' node-name-highlight'
        }
        return className
      })

    d3.selectAll('g .link').each((d, i, g) => {
      d3.select(g[i]).attr('class', (d) => _this.setLinkClass(d, g[i]))
    })
  }

  /**
   * 拖拽点
   * @param {Object} d vertex
   */
  dragNode (d) {
    // const _this = this
    // _this.clickedNode = null
    // _this.dragingNode = d
    // this.svg.selectAll('.nodes .node').attr('class', (d) => {
    //   let className = 'node'
    //   if (_this.dragingNode && _this.dragingNode._id === d._id) {
    //     className += ' drag-node'
    //   }
    //   return className
    // })
    // this.svg.selectAll('.node image').attr('xlink:href', (d) => this.setNodeIcon(d))
    // d3.selectAll('g .link').each((d, i, g) => {
    //   d3.select(g[i]).attr('class', (d) => _this.setLinkClass(d, g[i]))
    // })
  }

  /**
   * 画图
   * @return {Object} this
   */
  renderChart () {
    /**
     * 定义箭头
     * @param {Object} svg 要添加进的 svg
     * @param {String} id 箭头 id
     * @param {Number} refX refX 位置
     * @param {String} pathDescr path d 元素
     * @param {String} className 箭头 class
     */
    function defineArrow (svg, id, refX, pathDescr, className = '', refY = 5) {
      svg.append('defs')
        .append('marker')
        .attr('id', id)
        .attr('class', 'arrow-marker ' + className)
        .attr('refX', -refX + 10)
        .attr('refY', refY)
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('markerWidth', 20)
        .attr('markerHeight', 20)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', pathDescr)
    }

    /**
     * 对节点名称进行格式化
     * @param {Object} text text selection object
     */
    function textWrap (text) {
      text.each(function (d, idx, g) {
        let thisText = d3.select(g[idx])
        const len = 16
        let textStack = []
        let name = d.name || d.case_id || ''
        if (d._type === 'Family_id') {
          name = '互为亲属'
        }
        let y = parseFloat(thisText.attr('y'))
        let lineHeight = 14
        let i = 0
        while (name.slice(0, len).length === len) {
          textStack.push({
            name: name.slice(0, len),
            dx: 0,
            dy: (i++ * lineHeight) + y
          })
          name = name.slice(len)
        }
        textStack.push({
          name: name.slice(0),
          dx: 0,
          dy: (i++ * lineHeight) + y
        })
        if (d.is_abnormal_status || d.is_abnormal_status === 'true') { // 有风险的企业名称后加上经营状态 e.g.'[注销]'
          let textStackName = '[' + (d.business_status || d.status) + ']'
          textStack.push({
            name: textStackName,
            risk: true
          })
          // textStack.push(...[{ name: '[' }, { name: d.business_status || d.status, risk: true }, { name: ']' }])
        }
        textStack.forEach((v) => {
          thisText.append('tspan').text(v.name).attr('y', v.dy)
            .attr('x', v.dx)
            .attr('font-size', 14)
            .attr('class', v.risk ? 'risk-status' : '')
        })
      })
    }

    /** 动态调整位置 */
    function tickActions () {
      let _this = this
      // 移动 vertex 位置
      d3.selectAll('g.node')
        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })

      // 调整label和边的距离
      d3.selectAll('g .link-name').each(function (d, i, g) {
        let r = Math.sqrt(Math.pow(d.source.x - d.target.x, 2) + Math.pow(d.source.y - d.target.y, 2))
        let textLen = 8 // label和边的距离
        if (Math.abs(d.source.y - d.target.y) < r / 2) {
          d3.select(g[i]).attr('transform', `translate(0, -${textLen})`)
        } else if ((d.source.x > d.target.x && d.source.y > d.target.y) ||
          (d.source.x < d.target.x && d.source.y < d.target.y)) {
          d3.select(g[i]).attr('transform', `translate(${textLen}, 0)`)
        } else if ((d.source.x > d.target.x && d.source.y < d.target.y) ||
          (d.source.x < d.target.x && d.source.y > d.target.y)) {
          d3.select(g[i]).attr('transform', `translate(-${textLen}, 0)`)
        }
      })

      d3.selectAll('g .link-name textPath').each(function (d, i, g) {
        // 通过旋转 label, 使文字始终处于 edge 上方
        if (d.source.x > d.target.x) {
          d3.select(g[i]).attr('xlink:href', (d) => '#' + d._id.replace('/', '_') + '_reverse')
        } else {
          d3.select(g[i]).attr('xlink:href', (d) => '#' + d._id)
        }
      })

      // IE bug, marker-start 不能动态更新, 所以每次更新位置时都去除 path 再增加上 (note: 会有性能问题)
      if (window.ActiveXObject || /Trident\/7\./.test(navigator.userAgent)) {
        linkEnter.selectAll('path').remove()
        edge = linkEnter.append('path')
          .attr('class', (d) => _this.setLinkClass(d))
          .attr('linkIndex', (d) => d.linkIndex)
          .attr('linkMap', (d) => d.linkNum)
          .attr('marker-start', (d) => this.getArrow(d, _this))
      }

      // 计算 edge 的 path, 多条路径时计算弧度
      edge.each(function (d, i, g) {
        let dx = d.target.x - d.source.x
        let dy = d.target.y - d.source.y
        let dr = d.linkNum > 1 ? Math.sqrt((dx * dx) + (dy * dy)) : 0
        let middleIdx = (d.linkNum + 1) / 2

        if (d.linkNum > 1) {
          dr = d.linkIndex === middleIdx ? 0
            : dr / (Math.log((Math.abs(d.linkIndex - middleIdx) * 0.6) + 1) +
            (1 / (10 * Math.pow(d.linkNum, 2))))  // 秘制调参
        }
        let sweepFlag = d.linkIndex > middleIdx ? 1 : 0
        if (d.labelDirection) sweepFlag = 1 - sweepFlag
        let path = 'M' + d.source.x + ',' + d.source.y +
          'A' + dr + ',' + dr + ' 0 0 ' + sweepFlag + ',' + d.target.x + ',' + d.target.y

        // 自己指向自己
        if (d._from === d._to) {
          path = `M${d.source.x} ${d.source.y} C ${d.source.x} ${d.source.y - 150},
            ${d.source.x + 150} ${d.source.y}, ${d.source.x} ${d.source.y}`
        }

        d3.select(g[i])
          .attr('d', path)
          .attr('id', d._id)
        // 增加一条反向的路径, 用于旋转 label
        d3.select('#' + d._id.replace('/', '_') + '_reverse')
          .attr('d', 'M' + d.target.x + ',' + d.target.y +
            'A' + dr + ',' + dr + ' 0 0 ' + (1 - sweepFlag) + ',' + d.source.x + ',' + d.source.y)
      })
    }

    edgeColorTypes.forEach((edge) => {
      // 定义箭头
      defineArrow(this.svg, 'arrow_' + edge, this.r + 9, 'M10,0 L0,5 L10,10 L8,5 z', edge)

      // 双向箭头
      defineArrow(this.svg, 'arrowStart_' + edge, this.r - 40, 'M10,0 L0,5 L10,10 L8,5 z', edge)
    })
    defineArrow(this.svg, 'arrow', this.r + 12, 'M10,0 L0,5 L10,10 L8,5 z')
    defineArrow(this.svg, 'arrowStart', this.r - 40, 'M10,0 L0,5 L10,10 L8,5 z')
    // 高亮箭头
    // defineArrow(this.svg, 'arrow_highlight', this.r + 9, 'M10,0 L0,5 L10,10 L8,5 z', 'highlight')
    defineArrow(this.svg, 'arrow_highlight_Company', this.r + 11, 'M10,0 L0,5 L10,10 L8,5 z', 'highlight_company')
    defineArrow(this.svg, 'arrow_highlight_Person', this.r + 11, 'M10,0 L0,5 L10,10 L8,5 z', 'highlight_person')
    defineArrow(this.svg, 'arrow_highlight_black', this.r + 11, 'M10,0 L0,5 L10,10 L8,5 z', 'highlight_black')

    // setup
    let linkForce = d3.forceLink(this.edges)
      .distance(250)
      .id((d) => d._id)
    this.simulation = d3.forceSimulation()
    // .alpha(0.5)  // 默认为 1
      .alphaDecay(0.07)
      .nodes(this.vertexes)
      .force('links', linkForce)
      .force('charge_force', d3.forceManyBody().strength(-2500))
      .force('center_force', d3.forceCenter(this.width / 2, this.height / 2))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .force('collision', d3.forceCollide(1.8 * this.r))
      .on('tick', tickActions.bind(this))
      .on('end', () => {
        // this.scaleChart()
        this.setState({ showGraph: true })
        this.props.setRenderChartStatus('success')
      })

    // add vertexes
    let nodeEnter = this.svg.select('.nodes').selectAll('g')
      .data(this.vertexes)
      .enter()
      .append('g')
      .attr('class', (d) => 'node')
      .attr('node-type', (d) => {
        let type = d._type || (d._id.includes('/') && d._id.split('/')[0]) || 'Company'
        type = type + this.getNodeType(d)
        return type
      })

    nodeEnter.append('circle')
      .attr('r', (d) => d._id.includes('mergeNode') ? this.rSmall : this.r)
      .attr('class', 'circle')

    nodeEnter.append('text')
      .attr('class', (d) => {
        if (this.props.reduxLocation.query.lp_type === 'Company_cluster' && !this.isBelongBankNode(d)) {
          return 'node-name node-name-blur'
        }
        return 'node-name'
      })
      .attr('y', '44')
      .style('text-anchor', 'middle')

    nodeEnter.selectAll('.node-name')
      .call(textWrap)

    nodeEnter.append('image')
      .attr('xlink:href', (d) => this.setNodeIcon(d))
      .attr('width', this.imageWidth)
      .attr('height', this.imageWidth)
      .attr('contextMenuTarget', true)
      .attr('type', (d) => d._type)
      .attr('id', (d) => d._id)
      .attr('name', (d) => d.name)
      .attr('x', -this.imageWidth / 2)
      .attr('y', -this.imageWidth / 2)

    nodeEnter.append('g')
      .attr('class', 'tag-label')
      .each(function (d, i, g) {
        let currentg = d3.select(g[i])
        let node = d3.select(currentg.node().parentNode)
        let text = node.select('.node-name')
        let w = 10 // 标签宽度
        let tagCnt = 0
        let _this = this

        // 暂时隐藏优化增加标签lable

        if (d.belong_inner === true || d.belong_inner === 'true') {
          tagCnt++
          appendTaglabel('belong', '[授信客户]', '#EE5B77', tagCnt)
        }
        if (doraemon.isBlacklist(d)) {
          tagCnt++
          appendTaglabel('blacklist', '[黑名单]', '#EE5B77', tagCnt)
        }
        if (d.is_listed === true || d.is_listed === 'true') {
          tagCnt++
          appendTaglabel('listed', '[上市公司]', '#EE5B77', tagCnt)
        }

        let nodeBBox = node.node().getBBox()
        let xShift = nodeBBox.width / 2 + currentg.node().getBBox().width + 5
        let yShift = nodeBBox.height - text.node().getBBox().height + 2
        currentg.attr('transform', 'translate(' + (-xShift) + ',' + yShift + ')')

        function appendTaglabel (type, label, color, tagCnt) {
          text.append('tspan').text(label).classed(type, true).attr('fill', color)
            .attr('transform', 'translate(' + (tagCnt - 1) * w + ',0)')
        }
      })
    // add edges
    let linkEnter = this.svg.select('.links').selectAll('g')
      .data(this.edges)
      .enter()
      .append('g')
      .attr('class', (d) => {
        const type = d._id.split('/') && d._id.split('/')[0]
        let className = type
        if (this.isEdgeClickable(d)) {
          className += ' clickable-link'
        }
        return className
      })

    var edge = linkEnter.append('path')
      .attr('class', (d) => this.setLinkClass(d))
      .attr('linkIndex', (d) => d.linkIndex)
      .attr('linkMap', (d) => d.linkNum)
      .attr('marker-start', (d) => this.getArrow(d, this))

    // 增加反向路径, 用于旋转 label
    d3.select('defs').selectAll('.reverse-path')
      .data(this.edges)
      .enter()
      .append('path')
      .attr('id', (d) => d._id.replace('/', '_') + '_reverse')

    // add edge text
    linkEnter.append('text')
      .attr('class', (d) => `link-name ${d._id.split('/') && d._id.split('/')[0]}`)
      .append('textPath')
      .attr('xlink:href', (d) => '#' + d._id)
      .attr('startOffset', '50%')
      .text((d) => {
        return d._type === 'guarantee' ? d.rmb_label : d.label
      })

    return this
  }

  /**
   * 计算起点和终点相同边的条数，并加到link属性里
   * 计算每个点的度，并加到 vertex 的 degree 属性中
   * @return {Object} this this
   */
  setIndex () {
    let linkNumMap = {}
    let nodeNumMap = {}
    let linkDirection = {}
    this.edges.forEach(function (edge) {
      if (linkNumMap[edge._from + edge._to] === undefined) {
        linkNumMap[edge._from + edge._to] = linkNumMap[edge._to + edge._from] = 1
        linkDirection[edge._from + edge._to] = linkDirection[edge._to + edge._from] = edge._from
      } else {
        linkNumMap[edge._from + edge._to]++
        linkNumMap[edge._to + edge._from]++
      }

      nodeNumMap[edge._from] = nodeNumMap[edge._from] ? nodeNumMap[edge._from] + 1 : 1
      nodeNumMap[edge._to] = nodeNumMap[edge._to] ? nodeNumMap[edge._to] + 1 : 1
      edge.linkIndex = linkNumMap[edge._from + edge._to]
    })
    this.edges.forEach(function (edge) {
      edge.linkNum = linkNumMap[edge._from + edge._to]
      edge.labelDirection = linkDirection[edge._from + edge._to] === edge._from ? 1 : 0
    })
    this.vertexes.forEach((vertex) => {
      vertex.degree = nodeNumMap[vertex._id]
    })

    return this
  }

  /**
   * 在新开的页面中画图时设置 curNode
   */
  setCurNodeInNewPage () {
    const initCardType = this.props.reduxLocation.query.type || this.props.reduxLocation.query.lp_type
    if (initCardType === 'Graph') return

    let curNode = {}
    if (initCardType === 'Relation') {
      const params = JSON.parse(sessionStorage.getItem(`find${initCardType}Params`))
      curNode = this.props.originChartData.vertexes.find((v) => v.name === params.companyNames.src)
    } else if (initCardType === 'Connection') {
      const params = JSON.parse(sessionStorage.getItem(`connectionParams`))
      curNode = this.props.originChartData.vertexes.find((v) => v._id === params.id)
    } else if (initCardType === 'Merge_suggested') {
      const params = JSON.parse(sessionStorage.getItem('mergeSuggestedParams'))
      curNode = this.props.originChartData.vertexes.find((v) => v._id === params.person1)
    }
    if (['Relation', 'Connection', 'Merge_suggested'].includes(initCardType)) {
      this.props.setCurNode(curNode)
    }
  }

  /**
   * 将点击的族谱群中的企业放在屏幕中央
   * @param {String} centerNodeId 要至于中心的族谱点
   */
  setCenterClusterNode (centerNodeId) {
    const centerNode = this.vertexes.find((vertex) => vertex._id === centerNodeId)
    const shiftX = (window.innerWidth / 2) - centerNode.x
    const shiftY = (window.innerHeight / 2) - centerNode.y
    let t = d3.zoomIdentity.translate(shiftX, shiftY).scale(1)
    this.svg.call(this.zoomListener.transform, t)
    this.selectNode(centerNode)
  }

  /**
   * 给点设置 icon
   * @param {Object} d vertex
   * @return {Object} svg image file
   */
  setNodeIcon (d) {
    const { reduxLocation } = this.props
    let type = d._type || d.entity_type || (d._id.includes('/') && d._id.split('/')[0]) || 'Company'
    if (!this.clickedNode) {
      if (!objTypes.includes(type)) {
        type = 'Company'
      }
      return '/graph/' + type + '.svg'
    }
    if (d3.event && d3.event.target.nodeName === 'svg') {
      if (!objTypes.includes(type)) {
        type = 'Company'
      }
      return '/graph/' + type + '.svg'
    }
    if (groupIconMap[d._type]) {
      return '/graph/' + groupIconMap[type].icon + '.svg'  // 虚拟节点
    }
    if (type.includes('mergeNode')) { // 群体关系聚合点
      return '/graph/mergeNode.svg'
    }
    const typePostfix = this.getNodeType(d)
    if (this.isHighlightNode(d)) {
      return '/graph/' + type + '.svg'
    }
    let blurPostfix = this.isLinkToHighlightNode(d) ? '' : '_blur'
    if (!objTypes.includes(type)) {
      type = 'Company'
    }
    return '/graph/' + type + blurPostfix + '.svg'
  }

  /**
   * 获取企业的类型，黑名单／灰名单／行内企业
   * @param {Object} d vertex object
   * @return {String} type
   */
  getNodeType (d) {
    let typePostfix = this.isBelongBankNode(d) ? '_belong' : ''
    typePostfix = (d.is_greylist === true || d.is_greylist === 'true') ? '_graylist' : typePostfix
    typePostfix = doraemon.isBlacklist(d) ? '_blacklist' : typePostfix
    return typePostfix
  }

  /**
   * 节点是否要高亮
   * @param {Object} vertex vertex
   * @return {Boolean} 是否要高亮
   */
  isHighlightNode (vertex) {
    if (this.clickAgain) {
      return false
    }
    if (this.clickedNode) {
      return vertex._id && vertex._id === this.clickedNode._id
    }
    return false
  }

  /**
   * 节点是否和高亮点相连
   * @param {Object} vertex vertex
   * @return {Boolean} 是否和高亮点相连
   */
  isLinkToHighlightNode (vertex) {
    if (this.clickAgain) {
      return false
    }
    const highlightNodeId = this.clickedNode && this.clickedNode._id
    return !!this.edges.filter((edge) => edge._from === vertex._id || edge._to === vertex._id)
      .find((edge) => edge._from === highlightNodeId || edge._to === highlightNodeId)
  }

  isEdgeClickable (e) {
    return e.isMulti || ['invest', 'officer', 'tradable_share'].includes(e._type)
  }

  /**
   * 设置节点class
   * @param {Object} vertex vertex
   * @param {boolean} clickAgain clickAgain
   * @return {String} class name
   */
  setNodeClass (vertex, index, g) {
    let className = 'node'
    if (this.draging && this.dragNode && this.dragNode._id === vertex._id) {
      return className + ' drag-node'
    }
    if (!this.clickedNode) {
      return 'node'
    }
    if (d3.event && d3.event.target.nodeName === 'svg') {
      return 'node'
    }
    if (this.props.startEndId && this.props.startEndId.startId.includes(vertex._id)) {
      className = className + ' start-node'
    }
    if (this.props.startEndId && this.props.startEndId.endId.includes(vertex._id)) {
      className = className + ' end-node'
    }
    if (this.isHighlightNode(vertex)) {
      this.addFluidCircle(g[index])
      return className + ' current-node'
    }
    if (!this.isLinkToHighlightNode(vertex)) {
      return className + ' blur-node'
    }
    return className
  }

  /**
   * 设置边class
   * @param {Object} edge edge
   * @return {Object} class name
   */
  setLinkClass (edge, link) {
    const type = edge._id && edge._id.split('/')[0]
    let className = `link ${type}`
    const highlightNode = this.clickedNode
    if (highlightNode) {
      if (!this.clickAgain && (edge._from === highlightNode._id || edge._to === highlightNode._id)) {
        // 根据source判断高亮颜色
        let source = edge.source
        let type = source._type || (source._id.includes('/') && source._id.split('/')[0]) || 'Company'
        if (doraemon.isBlacklist(source)) {
          type = 'black'
        }
        className += ' link-highlight ' + type + '-link-highlight'
        d3.select(link).attr('marker-start', (d) => this.getArrow(d, this))
      } else {
        d3.select(link).attr('marker-start', (d) => this.getArrow(d, this))
        className += ' link-blur'
      }
    } else {
      d3.select(link).attr('marker-start', (d) => this.getArrow(d, this))
    }
    if (d3.event && d3.event.target.nodeName === 'svg') {
      d3.select(link).attr('marker-start', (d) => this.getArrow(d, this))
      return `link ${type}`
    }
    // else {
    //   className += ' link-dashed'
    // }
    if (this.isEdgeClickable(edge)) {
      className += ' clickable-link'
    }
    return className
  }

  /**
   * 通过边类别选择箭头
   * @param {String} type edge type
   * @return {String} arrow selector
   */
  getArrow (e, context) {
    const type = e._type || (e._id && e._id.split('/')[0]) || ''
    // 对一致可融合,当有rule字段时,无箭头; 无rule字段时,表明为非rule3关系新增的关系,有箭头
    // 自然人可融合、疑似可融合, 无方向; (person_merge, person_merge_suggest可以统一用person_merge判断)
    // 聚合边，无方向
    // 同为原告、同为被告，无方向
    const noArrow = (type.includes('concert') && e.rule) ||
      ['person_merge', 'mergeEdge', 'plaintiff_relate', 'defendant_relate'].some((t) => type.includes(t))
    if (noArrow) {
      return ''
    }

    const highlightNode = context.clickedNode
    if (highlightNode && !context.clickAgain && (e._from === highlightNode._id || e._to === highlightNode._id)) {
      // 根据source的类型显示不同箭头颜色
      let source = e.source
      // sourceType 为 Company 或者 Person
      let sourceType = source._type || (source._id.includes('/') && source._id.split('/')[0]) || 'Company'
      if (doraemon.isBlacklist(source)) {
        sourceType = 'black'
      }
      return 'url(#arrow_highlight_' + sourceType + ')'
      // return 'url(#arrow_highlight)'
    }
    return 'url(#arrow)'
    // return edgeColorTypes.includes(type) ? `url(#arrow_${type})` : 'url(#arrow)'
  }

  /** 更新点、边样式 */
  updateCurNodeStyle () {
    const svg = d3.select('svg')
    svg.selectAll('.node image').attr('xlink:href', (d) => this.setNodeIcon(d))
    svg.selectAll('.node').attr('class', (d, i, g) => this.setNodeClass(d, i, g))
    svg.selectAll('.link').attr('class', (d) => this.setLinkClass(d))
  }

  /** 选中自然人查看任职／投资路径 **/
  selectNodePath (id, showType) {
    let pathsEdges = []

    this.edges.forEach((e) => {
      if (e._from === id && e._id.includes(showType)) {
        pathsEdges.push(e._id)
      }
    })

    this.highlightLinkPaths(pathsEdges)
  }

  /**
   * 高亮路径
   * @param {Array} edges edges array
   */
  highlightLinkPaths (edges) {
    if (!(edges && edges.length)) return

    this.updateCurNodeStyle()
    const nodeIds = []
    edges.forEach((edge) => {
      const linkItem = this.edges.find((l) => l._id === edge)
      if (!linkItem) {
        throw Error('link not found ' + edge)
      }
      if (!nodeIds.includes(linkItem._from)) {
        nodeIds.push(linkItem._from)
      }
      if (!nodeIds.includes(linkItem._to)) {
        nodeIds.push(linkItem._to)
      }
    })

    const svg = d3.select('svg')
    svg.selectAll('.node image').attr('xlink:href', (d) => {
      const type = (d._id.includes('/') && d._id.split('/')[0]) || 'Company'
      if (nodeIds.includes(d._id)) {
        return '/graph/' + type + '_highlight.svg'
      }
      return '/graph/' + type + '_blur.svg'
    })
    svg.selectAll('.node').attr('class', (d) => {
      let className = 'node ' + d._id.split('/')[0]
      if (nodeIds.includes(d._id)) {
        return className + ' current-node'
      }
      return className + ' blur-node'
    })
    svg.selectAll('.link').attr('class', (d) => {
      let className = 'link ' + d._id.split('/')[0]
      if (edges.includes(d._id)) {
        return className + ' link-highlight'
      }
      return className + ' link-blur'
    })
  }

  /**
   * 缩放图，使之适应屏幕
   */
  scaleChart () {
    let xPos = { min: 0, max: 0 }
    let yPos = { min: 0, max: 0 }
    this.vertexes.forEach((vertex) => {
      xPos = {
        min: xPos.min > vertex.x ? vertex.x : xPos.min,
        max: xPos.max < vertex.x ? vertex.x : xPos.max
      }
      yPos = {
        min: yPos.min > vertex.y ? vertex.y : yPos.min,
        max: yPos.max < vertex.y ? vertex.y : yPos.max
      }
    })
    const innerHeight = window.innerHeight
    const innerWidth = window.innerWidth
    if (innerHeight - 56 < (yPos.max - yPos.min) || innerWidth < (xPos.max - xPos.min)) {
      let scale1 = innerHeight / (yPos.max - yPos.min)
      let scale2 = innerWidth / (xPos.max - xPos.min)
      let scale = scale1 < scale2 ? scale1 : scale2
      let t = d3.zoomIdentity.translate(innerWidth * scale, innerHeight * scale).scale(scale)
      this.svg.call(this.zoomListener.transform, t)
    }
  }

  /** 初始画图 */
  /** 重构中，后面废除，业务逻辑放在 actions 中 */
  async init () {
    this.setState({ showGraph: false })
    this.vertexes = this.props.originChartData.vertexes
    this.edges = this.props.originChartData.edges
    this.setCurNodeInNewPage()
    await this.getMergePerson(this.vertexes, this.edges)
    this.props.setRenderChartStatus('drawing')
    GraphUtil.mergeNodesAndEdges(this.vertexes, this.edges, this.props.originChartData)
    this.edges = GraphUtil.getUnique(this.edges)
    this.vertexes = GraphUtil.getUnique(this.vertexes)
    this.initSourceTarget()
    this.setIndex()
    this.props.setMergeChartData()
    this.mergeRelation()
    GraphUtil.uniqueConcertEdges(this.edges)
    // 再次计算，一致行动关系边会被融合
    this.setIndex()
    this.go()

    // 设置人物节点初始名字列表，以后每次展开都会把展开的人物名字加入该列表
    GraphUtil.setPersonNames(this.vertexes)
  }

  /** 预处理 */
  preprocess () {
    this.setIndex()
  }

  /** 展开 */
  async expand () {
    const { vertexes, edges } = this.props.expandChartData
    const { originChartData, curNode } = this.props

    this.setState({ showGraph: false })
    if (this.props.curNode._id && !this.props.curNode._id.includes('Person')) {
      await this.getMergePerson(vertexes, edges, true)
    }
    this.simulation && this.simulation.stop()
    this.vertexes = vertexes.concat(this.vertexes)
    this.edges = edges.concat(this.edges)
    GraphUtil.mergeNodesAndEdges(this.vertexes, this.edges, originChartData, curNode)
    this.props.setRenderChartStatus('drawing')
    this.initSourceTarget()

    this.edges = GraphUtil.getUnique(this.edges)
    this.vertexes = GraphUtil.getUnique(this.vertexes)
    GraphUtil.uniqueConcertEdges(this.edges)
    this.setIndex()
    this.mergeRelation()
    // 再次计算，一致行动关系边会被融合
    this.setIndex()
    this.go()
  }

  displayChart () {
    const { vertexes, edges } = this.props.displayChartData
    this.vertexes = vertexes
    this.edges = edges
    this.simulation && this.simulation.stop()
    this.props.setRenderChartStatus('drawing')
    this.setIndex().initSourceTarget().go()
  }

  /**
   * 插入融合节点并渲染
   * @param {Object} chartData chart data
   */
  insertMergeDataAndRender (chartData) {
    this.setState({ showGraph: false })
    this.props.setRenderChartStatus('drawing')
    this.vertexes = this.vertexes
      .concat(chartData.vertexes)
    this.edges = this.edges
      .concat(chartData.edges)

    const formatData = chartService.preprocess({
      vertexes: this.vertexes,
      edges: this.edges
    }, this.props.curNode, this.props)
    this.vertexes = formatData.vertexes
    this.edges = formatData.edges
    this.edges = GraphUtil.getUnique(this.edges)
    this.vertexes = GraphUtil.getUnique(this.vertexes)
    GraphUtil.uniqueConcertEdges(this.edges)
    this.setIndex()
    this.go()
  }

  /**
   * 渲染族谱
   * @param {Object} data chart data
   */
  renderClusterData (data) {
    this.setState({ showGraph: false })
    if (!Object.keys(data).length) {
      return
    }

    this.props.setRenderChartStatus('drawing')
    this.vertexes = []
    this.edges = []
    for (let i in data) {
      if (data.hasOwnProperty(i)) {
        this.vertexes.push(...data[i].vertexes)
        this.edges.push(...data[i].edges)
      }
    }
    GraphUtil.uniqueConcertEdges(this.edges)
    this.setIndex()
    this.go()
  }

  /**
   * 直接渲染图
   * @param {Object} originChartData chart data
   */
  showOrigin (originChartData) {
    this.setCurNodeInNewPage()
    this.setState({ showGraph: false })
    this.props.setRenderChartStatus('drawing')
    this.vertexes = originChartData.vertexes
    this.edges = originChartData.edges
    this.edges = GraphUtil.getUnique(this.edges)
    this.vertexes = GraphUtil.getUnique(this.vertexes)
    GraphUtil.mergeNodesAndEdges(this.vertexes, this.edges, originChartData, null, false)
    this.initSourceTarget()
    GraphUtil.uniqueConcertEdges(this.edges)
    this.setIndex()
    this.go()

    GraphUtil.setPersonNames(this.vertexes)
  }

  async showHistory (chartData) {
    this.vertexes = chartData.vertexes
    this.edges = chartData.edges
    this.props.setRenderChartStatus('pending')
    await this.getMergePerson(this.vertexes, this.edges, true)
    this.props.setRenderChartStatus('drawing')
    GraphUtil.mergeNodesAndEdges(this.vertexes, this.edges, this.props.originChartData)
    this.setIndex()
    this.mergeLeaves()
    this.showOrigin({ vertexes: this.vertexes, edges: this.edges })
  }

  addFluidCircle (node) {
    let circle
    circle = node.querySelector('circle.fluid-circle')
    if (circle) {
      circle = d3.select(node).select('.fluid-circle').style('display', 'block')
    } else {
      circle = d3.select(node)
        .insert('circle', '.circle')
        .attr('r', 34)
        .attr('class', 'fluid-circle')
    }
    d3.select(node).select('text').attr('dy', 10)
  }

  hideFluidCircle () {
    d3.selectAll('.fluid-circle').style('display', 'none')
    d3.selectAll('.nodes .node').select('text').attr('dy', 0)
  }

  /**
   * 对叶子节点进行聚合
   */
  mergeLeaves = () => {
    const mergeData = GraphUtil.mergeLeaves(this.vertexes, this.edges)
    this.vertexes = mergeData.vertexes
    this.edges = mergeData.edges
    this.props.setMergeChartData(mergeData.mergeChartData.vertexes, mergeData.mergeChartData.edges)
    this.setIndex() // 因为聚合了一些点，需要重新计数
  }

  /**
   * 显示一致行动关系图谱解释
   * @param {Object} originChartData chart data
   * @param {*} rule rule1 - rule12
   */
  showConcertExplain (originChartData, rule) {
    this.setCurNodeInNewPage()
    this.setState({ showGraph: false })
    this.props.setRenderChartStatus('drawing')
    this.vertexes = originChartData.vertexes
    this.edges = originChartData.edges
    this.edges = GraphUtil.getUnique(this.edges)
    this.vertexes = GraphUtil.getUnique(this.vertexes)
    GraphUtil.mergeNodesAndEdges(this.vertexes, this.edges, originChartData)
    const chartData = GraphUtil.cutConcertExplainNodesAndEdges(this.vertexes, this.edges, rule)
    this.vertexes = chartData.vertexes
    this.edges = chartData.edges
    this.initSourceTarget()
    GraphUtil.cutConcertExplainNodesAndEdges(this.vertexes, this.edges, rule)
    GraphUtil.uniqueConcertEdges(this.edges)
    this.setIndex()
    this.go()

    GraphUtil.setPersonNames(this.vertexes)
  }

  initSourceTarget () {
    // 初始化 source / target
    this.edges.forEach((l) => {
      l.target = l._from
      l.source = l._to
    })

    return this
  }

  /**
   * render
   * @return {Object} jsx
   */
  render () {
    return (
      <div id="chartSVG">
        <svg className="chart-container" fontSize='12'
             width={window.innerWidth} height={window.innerHeight}
             style={{ 'display': this.state.showGraph ? 'block' : 'none' }}/>
      </div>
    )
  }
}

Graph.propTypes = {
  curNode: PropTypes.object,
  expandChartData: PropTypes.object,
  filterOptions: PropTypes.object,
  setRenderChartStatus: PropTypes.func,
  reduxLocation: PropTypes.object,
  getNodeInfo: PropTypes.func,
  setCurNode: PropTypes.func,
  updateMergeChartData: PropTypes.func,
  mergeChartData: PropTypes.object,
  originChartData: PropTypes.object,
  startEndId: PropTypes.object,
  setZoomStatus: PropTypes.func
}

/**
 * map state to props
 * @param {Object} state state
 * @return props
 */
const mapStateToProps = function (state) {
  return {
    renderChartStatus: state.renderChartStatus,
    expandChartData: state.expandChartData,
    curNode: state.curNode,
    filterOptions: state.FilterOptions,
    isTreeGraph: state.isTreeGraph,
    reduxLocation: state.location,
    clusterChartData: state.clusterChartData,
    guaranteeClusterChartData: state.guaranteeClusterChartData,
    reRenderChart: state.reRenderChart,
    centerClusterNode: state.centerClusterNode,
    mergeChartData: state.mergeChartData,
    originChartData: state.undoableOriginChartData.present,
    operateChartStatus: state.operateChartStatus,
    selectedMergeData: state.selectedMergeData,
    highlightLinkIds: state.highlightLinkIds,
    startEndId: state.startEndId,
    belongBankRelation: state.belongBankRelation,
    personClusterNode: state.personClusterNode,
    displayChartData: state.displayChartData
  }
}

/**
 * map dispatch to props
 * @param {Function} dispatch dispatch
 * @return {Object} props
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setRenderChartStatus: (status) => dispatch(setRenderChartStatus(status)),
    setCurNode: (vertex) => dispatch(setCurNode(vertex)),
    updateMergeChartData: (vertexes, edges) => dispatch(updateMergeChartData(vertexes, edges)),
    setOriginChartData: (vertexes, edges) => dispatch(setOriginChartData(vertexes, edges)),
    cleanMergeData: () => dispatch(cleanMergeData()),
    setZoomStatus: (v) => dispatch(setZoomStatus(v)),
    setMergeChartData: (v, e) => dispatch(setMergeChartData(v, e))
  }
}

Graph.defaultProps = {
  curNode: {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph)
