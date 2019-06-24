/**
 * @desc: {力图绘制组件, canvas}
 * @author: xieyuzhong
 * @Date: 2018-12-17 16:20:50
 * @Last Modified by: xieyuzhong
 * @Last Modified time: 2019-01-18 18:38:35
 *
 *  调用方式:
 *  const force = new ForceCanvas(<element>, {
 *    data: chartData // { vertexes: [], edges: [] }
 *  })
 *  force.init()
 *
 * <element>:
 *  可为 DOM 元素，也可为 d3 selection
 *
 * 配置参数:
 * {
 *   data: { vertexes: [...], edges: [...] } // 必传
 *   r,
 *   distance
 * }
 */
import * as d3 from 'd3'

const SQRT2 = Math.sqrt(2)
// 使得传入的scale值默认都缩小 0.5 倍，即传入scale为 1 默认转换为 0.5 的视图效果
const adaptScale = 0.5

const _default = {
  width: window.innerWidth,
  height: window.innerHeight,
  data: { vertexes: [], edges: [] },
  theme: 'light', // 默认浅色主题
  edgeColor: '#BDBDBD',
  radius: 15, // 节点默认大小
  vertexColor: '#FF9D13',
  lineWidth: 1,
  boldLineWidth: 2, // 数据需要鼠标悬浮时高亮路径时的路径线条粗细
  fontSize: 10,
  fontFamily: 'PingFang SC, Microsoft YaHei, Helvetica, Arial, Verdana, sans-serif',
  displayTextThreshold: 1.5 * adaptScale,  // 字体展示的缩放阈值，默认放大到1.5倍时才展示节点中的文字
  arrowLength: 5,  // 箭头斜边长度
  arrowDt: Math.PI / 6,  // 箭头斜边与边的夹脚
  // 深浅主题对应的节点颜色
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
  },
  // 指示标签颜色配置
  tagMap: {
    // 是否黑名单
    is_blacklist: {
      color: '#000',
      shiftX: '-'
    },
    is_black: {
      color: '#000',
      shiftX: '-'
    },
    is_Black: {
      color: '#000',
      shiftX: '-'
    },
    // 是否行内客户
    belong_inner: {
      color: '#60A1F1',
      shiftX: '0'
    },
    // 是否异常状态
    is_abnormal_status: {
      color: '#D0021B',
      shiftX: '+'
    }
  },
  onRenderEnd: () => {},
  onClickVertex: () => {},
    // COMPANY_COLOR: '#63A3EF',
    // PERSON_COLOR: '#9BCB70'
}

class ForceCanvas {
  constructor (ele, options) {
    this.options = Object.assign({}, _default, options)
    this.ele = ele.node ? ele.node() : ele
    this.canvas = d3.select(this.ele)
    this.ctx = this.ele.getContext('2d')
    this.chart = this.options.data

    this.transform = d3.zoomIdentity
  }

  init () {
    this
      ._preprocessData()
      ._initChartLayer()
      ._initForce()
      .render()
      .bindEvents()
  }

  _preprocessData () {
    const degreeMap = {}
    this.chart.edges.forEach((e) => {
      e.source = e._from
      e.target = e._to
      degreeMap[e._from + e._to] = (degreeMap[e._from + e._to] || 0) + 1
      degreeMap[e._to + e._from] = (degreeMap[e._to + e._from] || 0) + 1
      e.degreeIdx = degreeMap[e._from + e._to]
    })
    this.chart.edges.forEach((e) => {
      e.degree = degreeMap[e._from + e._to]
    })

    this.chart.vertexes.forEach((v) => {
      // 储存节点类型：公司 || 自然人
      v._type = v._type || (v._id.includes('/') && v._id.split('/')[0])
      // 储存节点大小
      v.radius = this.getRadius(v)
    })

    return this
  }

  _initChartLayer () {
    const options = this.options
    this.canvas.attr('width', options.width)
      .attr('height', options.height)

    return this
  }

  _initForce () {
    const options = this.options
    this.simulation = d3.forceSimulation()
      .alphaDecay(0.2)
      .force('link', d3.forceLink().id((d) => d._id).distance((d) => this.getDistance(d)))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(options.width / 2, options.height / 2))
      .force('collision', d3.forceCollide().radius((d) => d.radius * 3 / 4)) // 节点斥力

    return this
  }

  render () {
    this.simulation.nodes(this.chart.vertexes)
      .on('tick', this.draw.bind(this))
      .on('end', () => {
        this.chart.vertexes.forEach((v) => {
          v.fx = v.x
          v.fy = v.y
        })
        this.options.onRenderEnd()
      })

    this.simulation.force('link')
      .links(this.chart.edges)

    return this
  }

  draw (opts = {}) {
    Object.assign(this.options, opts)
    const { ctx, options, chart } = this
    ctx.save()
    ctx.clearRect(0, 0, options.width, options.height)
    this.ctx.beginPath()
    this.ctx.rect(0, 0, options.width, options.height)
    this.ctx.fillStyle = this.getBackgroundColor(options.theme)
    this.ctx.fill()

    ctx.translate(this.transform.x, this.transform.y)
    ctx.scale(this.transform.k, this.transform.k)

    chart.edges.forEach((e) => {
      this.drawEdge(e)
        .drawArrow(e)
        .drawEdgeLabel(e)
    })
    chart.vertexes.forEach((v) => {
      this.drawVertex(v)
        .drawVertexText(v)
        .drawLabel(v)
        .highlightCurrentVertex(v)
    })
    ctx.restore()
  }

  _calcShiftPos = (pos, edge) => {
    const { degree, degreeIdx } = edge
    const shiftPos = { x: pos.x, y: pos.y }
    if ((degree + 1) / 2 === degreeIdx) { // 只有一条边或奇数条边的中间那条，大多数情况
      return shiftPos
    }
    const alpha = Math.atan(Math.abs(edge.target.y - edge.source.y) / Math.abs(edge.target.x - edge.source.x))
    let shift = this.options.radius / 2  // 偏移距离，两点之间超过 5 条边会有问题
    if (degree === 2) {
      shift = this.options.radius
    } else if (degree === 3) {
      shift = this.options.radius / 3 * 2
    }
    const d = (degreeIdx - ((degree + 1) / 2)) * shift
    const flag = (edge.target.y - edge.source.y) * (edge.target.x - edge.source.x) < 0 ? 1 : -1
    shiftPos.x += Math.sin(alpha) * d * flag
    shiftPos.y += Math.cos(alpha) * d
    return shiftPos
  }

  drawEdge (d) {
    const { ctx } = this

    const srcShiftPos = this._calcShiftPos(d.source, d)
    const dstShiftPos = this._calcShiftPos(d.target, d)

    ctx.beginPath()
    ctx.moveTo(srcShiftPos.x, srcShiftPos.y)
    ctx.lineTo(dstShiftPos.x, dstShiftPos.y)
    ctx.strokeStyle = this.getEdgeColor(d)
    ctx.lineWidth = this.getEdgeWidth(d)
    ctx.stroke()

    return this
  }

  drawArrow (d) {
    const { ctx, options } = this

    const srcShiftPos = this._calcShiftPos(d.source, d)
    const dstShiftPos = this._calcShiftPos(d.target, d)

    ctx.beginPath()
    const alpha = Math.atan2(dstShiftPos.x - srcShiftPos.x, dstShiftPos.y - srcShiftPos.y)
    const dt = options.arrowDt  // 箭头与边的夹角
    const arrowLength = options.arrowLength
    // 边的终点减去节点半径，为箭头绘制起点
    const endX = dstShiftPos.x - (Math.sin(alpha) * d.target.radius)
    const endY = dstShiftPos.y - (Math.cos(alpha) * d.target.radius)
    ctx.moveTo(endX, endY)
    ctx.lineTo(endX - (Math.sin(alpha - dt) * arrowLength), endY - (Math.cos(alpha - dt) * arrowLength))
    ctx.lineTo(endX - (Math.sin(alpha + dt) * arrowLength), endY - (Math.cos(alpha + dt) * arrowLength))
    ctx.fillStyle = this.getEdgeColor(d)
    ctx.fill()

    return this
  }

  drawEdgeLabel (d) {
    const { ctx, options, transform } = this
    // 放大倍数到达 1.5 时才展示线条上的label
    if (transform.k < options.displayTextThreshold) {
      return this
    }

    const srcShiftPos = this._calcShiftPos(d.source, d)
    const dstShiftPos = this._calcShiftPos(d.target, d)

    ctx.save()
    ctx.font = options.fontSize + 'px ' + options.fontFamily
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const dy = dstShiftPos.y - srcShiftPos.y
    const dx = dstShiftPos.x - srcShiftPos.x
    if (dx > 0) {
      ctx.translate(srcShiftPos.x, srcShiftPos.y)
      ctx.rotate(Math.atan2(dy, dx))
    } else {
      ctx.translate(dstShiftPos.x, dstShiftPos.y)
      ctx.rotate(Math.PI + Math.atan2(dy, dx))
    }
    const middleX = Math.sqrt((dx * dx) + (dy * dy)) / 2
    const textWidth = options.fontSize * d.label.length
    // 文字背景
    ctx.fillStyle = this.getBackgroundColor(options.theme)
    ctx.fillRect(middleX - (textWidth / 2), -options.fontSize / 2, textWidth, options.fontSize)
    // 文字
    ctx.fillStyle = this.getEdgeColor(d)
    ctx.fillText(d.label, middleX, 0)
    ctx.restore()

    return this
  }

  drawVertex (d) {
    const { ctx } = this

    const radius = d.radius
    const vertexColor = this.getVertexColor(d)
    ctx.beginPath()
    ctx.moveTo(d.x + radius, d.y)
    ctx.arc(d.x, d.y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = vertexColor
    ctx.fill()
    ctx.strokeStyle = this.getVertexStrokeColor(d)
    ctx.stroke()

    return this
  }

  drawVertexText (d) {
    const { ctx, options, transform } = this
    // 除了核心公司文字一直显示外其他都是放大到1.5倍时才展示
    if ((transform.k < options.displayTextThreshold) && !(utils.isTrue(d.is_core))) {
      return this
    }

    const textContainerWidth = d.radius * SQRT2
    const textNumPerLine = 4 // 节点中每一行的文字个数阈值
    const fontSize = textContainerWidth / textNumPerLine
    const lineNum = 3 // 节点文字行数阈值
    let name = d.name
    let nameStack = []

    if (name.length < textNumPerLine) {
      nameStack = ['', name, '']
    } else {
      for (let i = 0; i < lineNum; i++) {
        let subName = name.substr(0, textNumPerLine)
        name = name.slice(textNumPerLine)
        if (i === lineNum - 1 && name) {
          subName = subName.substr(0, subName.length - 1) + '...'
        }
        nameStack.push(subName)
      }
    }

    ctx.font = fontSize + 'px ' + options.fontFamily
    ctx.fillStyle = d.is_fade ? utils.fadeColor('#fff', 0.2) : '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'ideographic'
    nameStack.forEach((name, i) => {
      ctx.fillText(name, d.x, d.y - textContainerWidth / 6 + i * textContainerWidth / 3)
    })

    return this
  }

  // 绘制指示标签
  drawLabel (d) {
    const { ctx } = this
    // 标签纵坐标
    const labelY = d.y + d.radius / 2 + d.radius / 2 * 0.3
    // 标签高度
    const labelHeight = labelY + d.radius * 0.2
    // 标签宽度
    const labelWidth = d.radius * 0.1
    // 同一级标签偏移量
    const labelShift = labelWidth * 2
    Object.keys(_default.tagMap).forEach((type) => {
      if (d[type] && d[type] !== 'false') {
        let labelColor = _default.tagMap[type].color
        ctx.beginPath()
        let labelX = _default.tagMap[type].shiftX === '0' ? d.x : (_default.tagMap[type].shiftX === '-' ? d.x - labelShift : d.x + labelShift)
        ctx.moveTo(labelX, labelY)
        ctx.lineTo(labelX - labelWidth, labelHeight)
        ctx.lineTo(labelX + labelWidth, labelHeight)
        ctx.fillStyle = labelColor
        ctx.fill()
      }
    })
    return this
  }

  // 点击节点
  highlightCurrentVertex (d) {
    if (!d.is_current) {
      return
    }

    const { ctx } = this

    const radius = d.radius
    let vertexColor = this.getVertexColor(d)
    ctx.beginPath()
    ctx.fillStyle = utils.fadeColor(vertexColor, 0.3)
    const shift = radius / 5
    // 模仿节点高亮的开花效果
    ctx.moveTo(d.x + radius, d.y - (shift * SQRT2))
    ctx.arc(d.x, d.y - (shift * SQRT2), radius, 0, 2 * Math.PI)
    ctx.moveTo(d.x + radius + shift, d.y + shift)
    ctx.arc(d.x + shift, d.y + shift, radius, 0, 2 * Math.PI)
    ctx.moveTo(d.x + radius - shift, d.y + shift)
    ctx.arc(d.x - shift, d.y + shift, radius, 0, 2 * Math.PI)
    ctx.fill()

    return this
  }

  getBackgroundColor (theme) {
    const themeMap = {
      light: '#f6f7f7',
      deep: '#191a2c'
    }

    return themeMap[theme] || '#fff'
  }

  getDistance (d) {
    if (d.source._id.includes('Person') || d.target._id.includes('Person')) {
      return 50
    }
    return 100
  }

  getEdgeColor (d) {
    if (d.color) {
      return d.color
    }

    let color = this.options.edgeColor
    if (d.is_fade) {
      color = utils.fadeColor(color, 0.2)
    }

    return color
  }

  getEdgeWidth (d) {
    let width = this.options.lineWidth
    if (d.mouseover) {
      width = this.options.boldLineWidth
    }

    return width
  }

  getRadius (d) {
    let radius = this.options.radius
    // 除了集团派系核心、行内客户、上市公司外，其它节点只展示一个小点
    if (d._id.includes('Company')) {
      radius = utils.isTrue(d.is_core) ? 60 : ((d.is_listed && d.is_listed !== 'false') || (d.belong_inner && d.belong_inner !== 'false') ? 30 : 20)
    }

    return radius
  }

  getVertexColor (d) {
    if (d.color) {
      return d.color
    }

    let color = _default[this.options.theme].PERSON_COLOR
    if (d._id.includes('Company')) {
      color = utils.isTrue(d.is_core) ? _default[this.options.theme].GROUP_CORE_COLOR : (utils.isTrue(d.is_listed) ? _default[this.options.theme].LISTED_COMPANY_COLOR : _default[this.options.theme].NOT_LISTED_COMPANY_COLOR)
    }
    if (d.is_fade) {
      color = utils.fadeColor(color, 0.2)
    }

    return color
  }

  getVertexStrokeColor (d) {
    if (d.strokeColor) {
      return d.strokeColor
    }

    let color = '#bdbdbd'
    if (d.is_fade) {
      color = utils.fadeColor(color, 0.2)
    }

    return color
  }

  bindEvents () {
    const zoomListener = d3.zoom()
      .scaleExtent([0.5 * adaptScale, 2 * adaptScale])
      .on('zoom', this.onZoom.bind(this)) // 监听放大缩小操作
    this.canvas.call(
      d3.drag()
        .container(this.ele)
        .subject(this._getTargetVertex.bind(this))
        .on('start', this.onDragStart.bind(this))
        .on('drag', this.onDrag.bind(this))
        .on('end', this.onDragEnd.bind(this))
    ).call(zoomListener)

    const config = {
      x: this.options.width / 5 * 2,
      y: this.options.height / 5 * 2,
      scale: 1  // 默认缩放比例
    }
    const t = d3.zoomIdentity.translate(config.x, config.y).scale(config.scale * adaptScale)
    this.canvas.call(zoomListener.transform, t)

    this.canvas.on('mousemove', this.onMousemove.bind(this))

    this.canvas.on('click', this.onClick.bind(this))

    /** 自定义事件 */
    d3.select('body').on('canvas_zoom', () => {
      // debugger
      const scale = d3.event.detail.scale || 1 // 缩放比例
      const t = d3.zoomIdentity.translate(this.transform.x, this.transform.y).scale(scale * adaptScale)
      this.canvas.call(zoomListener.transform, t)
    })

    return this
  }

  _getTargetVertex () {
    const x = this.transform.invertX(d3.event.x)
    const y = this.transform.invertY(d3.event.y)

    for (let i = 0; i < this.chart.vertexes.length; i++) {
      const v = this.chart.vertexes[i]
      const dx = x - v.x
      const dy = y - v.y
      if (dx * dx + dy * dy < v.radius * v.radius) {
        v.x = this.transform.applyX(v.x)
        v.y = this.transform.applyY(v.y)

        return v
      }
    }

    return null
  }

  onClick () {
    const target = this._getTargetVertex()
    // 点击节点以外的地方
    if (!target) {
      this.chart.vertexes.forEach((v) => {
        v.is_current = false
        v.is_fade = false
      })
      this.chart.edges.forEach((e) => {
        e.is_fade = false
      })
      this.draw()
      return
    }

    // 高亮节点、路径以及左侧对应的卡片信息
    this.options.onClickVertex && this.options.onClickVertex(target)
  }

  onZoom () {
    this.transform = d3.event.transform
    // 实时 dispatch 放大倍数的值，使得放大缩小按钮的 scale 值和手动的 scale 值保持一致
    let scale = d3.event.transform.k * adaptScale * 4 // 即将传出去的值扩大两倍，0.5的视图效果传出去的 scale 是 1
    this.options.setZoomStatus({
      scale: scale,
      isMaxScale: scale >= 2,
      isMinScale: scale <= 0.5
    })
    this.draw()
  }

  onDragStart () {
    if (!d3.event.active) {
      this.simulation.alphaTarget(0.01).restart()
    }
    d3.event.subject.fx = this.transform.invertX(d3.event.x)
    d3.event.subject.fy = this.transform.invertY(d3.event.y)
  }

  onDrag () {
    d3.event.subject.fx = this.transform.invertX(d3.event.x)
    d3.event.subject.fy = this.transform.invertY(d3.event.y)
  }

  onDragEnd () {
    if (!d3.event.active) {
      this.simulation.alphaTarget(0)
    }
    d3.event.subject.fx = this.transform.invertX(d3.event.x)
    d3.event.subject.fy = this.transform.invertY(d3.event.y)
  }

  onMousemove () {
    /** 边的 mouseover 事件 */
    // this.onMouseoverEdge() // 鼠标移动会一直导致重绘，待优化 1. debounce, 2. 只有移到边上才重绘，空白处不触发重绘
  }

  onMouseoverEdge () {
    /** 高亮选中的边 */
    let findMouseover = false
    this.chart.edges.forEach((e) => {
      if (findMouseover) {
        e.mouseover = false
        return  // 跳出本次循环
      }
      if (utils.isInEdge(e.source, e.target, d3.event)) {
        e.mouseover = true
        findMouseover = true
      } else {
        e.mouseover = false
      }
    })
    this.draw()
  }
}

const utils = {
  hexToRgbCache: {},
  /**
   * 判断某个点是否在边上
   * @param { Object } src { x: 起点横坐标, y: 起点纵坐标 }
   * @param  { Object } dst { x: 终点横坐标, y: 终点纵坐标 }
   * @param { Object } cur { x: 当前点横坐标, y: 当前点纵坐标 }
   * @return { Boolean } 是否在边上
   */
  isInEdge: (src, dst, cur) => {
    const epsilon = 0.01 // 斜率阈值，此范围内都认为在边上，调参得到
    return Math.abs((cur.y - src.y) / (cur.x - src.x) -
      (dst.y - cur.y) / (dst.x - cur.x)) < epsilon &&
      (cur.x > src.x && cur.x < dst.x || cur.x < src.x && cur.x > dst.x)
  },
  isTrue: (condition) => condition && condition !== 'false',
  hexToRgb: (hex) => {
    if (utils.hexToRgbCache[hex]) {
      return utils.hexToRgbCache[hex]
    }
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    const rgb = result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
    if (rgb) {
      utils.hexToRgbCache[hex] = rgb
    }
    return rgb
  },
  fadeColor: (color, opacity) => {
    color = utils.hexToRgb(color)
    color = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`

    return color
  }
}

export default ForceCanvas
