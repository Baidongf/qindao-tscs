import React from 'react'
import { connect } from 'react-redux'
import ComplexStructure from './lib/d3.structure.complex'
import { setZoomStatus } from 'actions/InitOperateBtn'
// import Tips from './tips'

import './singleCompanyGraph.scss'

class SingleCompanyGraph extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showGraph: false,
      innerWidth: 0,
      innerHeight: 0,
    }

    this.singleCompanyChart = null
    this.chart = null
  }
  componentWillMount () {
    this.mounted = true
  }
  componentDidMount () {
    this.setState({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    })
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.singleCompanyChart !== nextProps.singleCompanyChart) {
      this.setState({
        showGraph: false
      })
      if (nextProps.singleCompanyChart) {
        this.singleCompanyChart = nextProps.singleCompanyChart
        this.renderChart(nextProps.singleCompanyChart)
      }
    }
    if (this.props.centerTreeNode !== nextProps.centerTreeNode) {
      this.findTreeNode(nextProps.centerTreeNode.vertex)
    }
  }

  componentWillUnmount () {
    this.mounted = false
    window.removeEventListener('resize', this.handleResize.bind(this))
  }

  handleResize (e) {
    this.mounted && this.setState({
      innerWidth: e.currentTarget.innerWidth,
      innerHeight: e.currentTarget.innerHeight
    })
  }

  findTreeNode (vertex) {
    this.chart.selectNode(vertex)
  }

  matchClusterChartData (data) {
    const chartData = Object.values(this.props.clusterChartData)[0]
    data && data.forEach((element) => {
      if (chartData.vertexes.find((d) => {
        return d._id === element.properties._id
      })) {
        element.properties.is_match = true
      }
      if (element.children) {
        this.matchClusterChartData(element.children)
      }
    })
  }

  renderChart (data) {
    let newData = Object.assign({}, data)
    this.matchClusterChartData(newData.stock.children)
    this.matchClusterChartData(newData.invest.children)
    this.chart = new ComplexStructure({
      data: newData,
      ele: this.refs.singleCompany,
      core: this.props.core,
      setZoomStatus: this.props.setZoomStatus
    })
    this.chart.draw()
    this.props.setRenderChartStatus('success')
    this.setState({
      showGraph: true
    })
  }

  render () {
    const { showGraph, innerWidth, innerHeight } = this.state
    return (
      <div className='single-company-container'>
        <svg ref='singleCompany' className='single-company-graph' id='singleCompany'
          width={innerWidth}
          height={innerHeight}
          style={{ display: showGraph ? 'block' : 'none' }}
        />
        {/* {showGraph ? <Tips /> : null} */}
      </div>
    )
  }
}

const mapDispatch = {
  setZoomStatus
}

export default connect(null, mapDispatch)(SingleCompanyGraph)
