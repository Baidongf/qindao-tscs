import React from 'react'
import { connect } from 'react-redux'
import * as d3 from 'd3'
import ForceCanvas from './lib/d3.force.canvas'
import { setRenderChartStatus, setCurNode } from 'actions/Chart'
import { setZoomStatus } from 'actions/InitOperateBtn'
import doraemon from 'services/utils'

class ForceGraph extends React.Component {
  constructor (props) {
    super(props)

    this.chartData = { vertexes: [], edges: [] }
    this.options = { theme: this.props.theme }
    this.curVertex = null
  }

  componentDidMount () {
    const chartData = this.props.clusterChartData
    if (Object.keys(chartData).length) {
      this.renderChart(chartData)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.clusterChartData !== nextProps.clusterChartData) {
      this.renderChart(nextProps.clusterChartData)
    }

    if (this.props.theme !== nextProps.theme) {
      this.options.theme = nextProps.theme
      this.draw(this.options)
    }

    if (this.props.centerClusterNode !== nextProps.centerClusterNode) {
      this.onCenterClusterNodeChange(nextProps.centerClusterNode.id)
    }
    if (this.props.personClusterNode !== nextProps.personClusterNode) {
      this.onCenterClusterNodeChange(nextProps.personClusterNode.id)
    }
  }

  initPosition () {
    this.chartData.vertexes.forEach((v) => {
      ['x', 'y', 'fx', 'fy', 'vx', 'vy', 'siblings'].forEach((key) => {
        delete v[key]
      })
    })
  }

  renderChart (chart) {
    for (let key in chart) {
      this.chartData.vertexes.push(...chart[key].vertexes)
      this.chartData.edges.push(...chart[key].edges)
    }
    this.initPosition()
    this.chartData = doraemon.deepClone(this.chartData)
    this.adjList = this.calcAdjList()
    const groupName = this.props.reduxLocation.query.group_name
    this.chartData.vertexes.forEach((v) => {
      if (v.name === groupName) {
        v.is_core = true  // 标注核心企业
      }
    })
    this.initForce(this.chartData, {
      theme: this.props.theme
    })
  }

  /**
   * 计算邻接表
   * @return {Object} adjList: 邻接表
   * {
   *  <id>: {
   *    linkedObj: {
   *      <linkedVertexId>: {
   *        linkedVertex: {}, // 邻接节点
   *        linkedEdgeSet: <set>  // 和该邻接节点相连的边
   *      }
   *    },
   *    curVertex: {} // 当前节点属性
   *  }
   * }
   */
  calcAdjList () {
    const adjList = new Map()
    const vertexMap = new Map()
    this.chartData.vertexes.forEach((v) => {
      vertexMap.set(v._id, v)
    })
    this.chartData.edges.forEach((e) => {
      [e._from, e._to].forEach((id) => {
        const linkedId = e._from === id ? e._to : e._from
        if (!adjList.has(id)) {
          adjList.set(id, {
            linkedObj: {},
            curVertex: vertexMap.get(id)
          })
        }
        const linkedObj = adjList.get(id).linkedObj
        linkedObj[linkedId] = linkedObj[linkedId] || {
          linkedVertex: vertexMap.get(linkedId),
          linkedEdgeSet: new Set()
        }
        linkedObj[linkedId].linkedEdgeSet.add(e)
      })
    })

    return adjList
  }

  initForce (chartData, options) {
    this.props.setRenderChartStatus('drawing')
    const d3ChartEle = d3.select('#forceCanvas')
    this.force = new ForceCanvas(d3ChartEle, {
      data: chartData,
      width: window.innerWidth,
      height: window.innerHeight,
      theme: options.theme,
      setZoomStatus: this.props.setZoomStatus,
      onRenderEnd: () => {
        this.props.setRenderChartStatus('success')
      },
      onClickVertex: (v) => {
        this.findPathAndReDraw(v)
        this.props.setCurNode(v)
      }
    })
    this.force.init()
  }

  draw (options) {
    this.force && this.force.draw(options)
  }

  onCenterClusterNodeChange (id) {
    if (!id || !this.force) {
      return
    }
    const centerNode = this.chartData.vertexes.find((v) => v._id === id)
    if (centerNode) {
      this.findPathAndReDraw(centerNode)
    }
  }

  // 高亮选中节点、路径并虚化其他节点、路径
  findPathAndReDraw (vertex) {
    if (!vertex) return
    this.chartData.vertexes.forEach((v) => {
      v.is_fade = true
      v.is_current = false
    })
    this.chartData.edges.forEach((e) => {
      e.is_fade = true
    })
    vertex.is_current = true
    vertex.is_fade = false
    this.curVertex = vertex
    this.getLinkedVertexes(vertex, 6) // 5度内关系

    this.draw()
  }

  getLinkedVertexes (vertex, threshold) {
    if (!threshold || isNaN(threshold)) {
      return
    }
    const vertexesStatus = {}
    this.dfsVisit(vertex._id, threshold, vertexesStatus)
  }

  dfsVisit (id, threshold, vertexesStatus, preId) {
    if (!threshold) {
      return
    }
    vertexesStatus[id] = 'exploring'
    const adj = this.adjList.get(id)
    if (preId) {
      adj.curVertex.preId = preId
    }
    if (preId && (doraemon.isTrue(adj.curVertex.is_core) ||
      doraemon.isTrue(adj.curVertex.is_listed) || doraemon.isTrue(adj.curVertex.belong_inner))) {
      const backTraceStatus = {}
      this.backTrace(adj, backTraceStatus)
    }
    const neighbors = adj.linkedObj
    Object.keys(neighbors).forEach((neighborId) => {
      if (!vertexesStatus[neighborId]) {
        this.dfsVisit(neighborId, threshold - 1, vertexesStatus, adj.curVertex._id)
      }
    })
    vertexesStatus[id] = 'visited'
  }

  backTrace (adjObj, backTraceStatus) {
    const preId = adjObj.curVertex.preId
    if (!preId || backTraceStatus[adjObj.curVertex._id] || adjObj.curVertex._id === this.curVertex._id) {
      return
    }
    adjObj.curVertex.is_fade = false
    backTraceStatus[adjObj.curVertex._id] = 'visited'
    adjObj.linkedObj[preId] && adjObj.linkedObj[preId].linkedEdgeSet.forEach((e) => {
      e.is_fade = false
    })
    this.backTrace(this.adjList.get(preId), backTraceStatus)
    adjObj.curVertex.preId = null
  }

  render () {
    return (
      <div className='force-graph-container'>
        {/* <svg width={window.innerWidth} height={window.innerHeight} style={{ display: 'block' }} /> */}
        {/* <canvas style={{ display: 'block' }} id='forceCanvas' /> */}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  reduxLocation: state.location,
  clusterChartData: state.clusterChartData,
  theme: state.setTheme,
  centerClusterNode: state.centerClusterNode,
  personClusterNode: state.personClusterNode
})

const mapDispatchToProps = {
  setRenderChartStatus,
  setCurNode,
  setZoomStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(ForceGraph)
