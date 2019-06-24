import React from 'react'
import { connect } from 'react-redux'
import { setCurNode } from 'actions/Chart'
import Card from 'components/Card'
import Chart from 'components/Chart'
import { Hint } from 'components/Hint'
import { OperateBtnGroup, OperateBtnContainer, Btns } from 'components/operateBtns'
import SingleCompanyGraph from './singleCompanyGraph'
// import ForceGraph from './forceGraph'
import BubbleGraph from 'components/Chart/bubble'
import FilterModal from './modals/filterModal'
import { setGraphType } from 'actions/InitOperateBtn'
import DownloadModal from './modals/downloadModal'
// import Btn from '../../../../../components/operateBtns/btn';

class ClusterGraph extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      page: ''
    }
  }

  componentDidMount () {
    this.setState({
      page: window.location.search.split('&')[1].split('=')[1]
    })
    this.props.getClusterChart()
  }

  componentDidUpdate(prevProps) {
    if (this.props.isNodeMax !== prevProps.isNodeMax) {
      // 集团派系才根据初始状态判断是否要气泡图，其他一直用网状图
      // 节点数过多展示气泡图，此时默认悬浮按钮显示的应该是气泡图按钮而不是网格图按钮，因此手动更改
      if (this.props.reduxLocation.query.type === 'profile_enterprise_info') {
        this.props.isNodeMax && this.props.setGraphType('bubble')
      }
    }
  }

  getOperateBtns () {
    if (this.props.reduxLocation.query.type === 'profile_enterprise_info') {
      if (this.props.singleCompanyState) {
        return (
          <div>
            <OperateBtnContainer>
              {/* <OperateBtnGroup> */}
                {/* <Btns.ZoomInBtn /> */}
                {/* <Btns.ZoomOutBtn /> */}
              {/* </OperateBtnGroup> */}
              <OperateBtnGroup>
                <Btns.SkinBtn />
                {/* <Btns.DownloadBtn /> */}
                <Btns.LabelBtn />
              </OperateBtnGroup>
              {/* <OperateBtnGroup>
              </OperateBtnGroup> */}
            </OperateBtnContainer>
            <Btns.Progress />
          </div>
        )
      } else {
        return (
          <div>
            <OperateBtnContainer>
              {/* <OperateBtnGroup>
                <Btns.ZoomInBtn />
                <Btns.ZoomOutBtn />
              </OperateBtnGroup> */}
              <OperateBtnGroup>
                <Btns.GraphBtn />
                <Btns.SkinBtn />
                {/* <Btns.DownloadBtn /> */}
                { this.props.graphType === 'bubble' && <Btns.LabelBtn /> }
                <Btns.TipBtn />
              </OperateBtnGroup>
              {/* <OperateBtnGroup>
              </OperateBtnGroup> */}
            </OperateBtnContainer>
            <Btns.Progress />
          </div>
        )
      }
    }
    // 除了集团派系都不用气泡图
    // 担保圈链
    else if (this.props.reduxLocation.query.type === 'risk_guarantee_info') {
      return (
        <div>
          <OperateBtnContainer>
            {/* <OperateBtnGroup>
              <Btns.ZoomInBtn />
              <Btns.ZoomOutBtn />
            </OperateBtnGroup> */}
            <OperateBtnGroup>
              {/* <Btns.GraphBtn /> */}
              {/* <Btns.DownloadBtn /> */}
              <Btns.SkinBtn />
              { this.props.graphType === 'bubble' && <Btns.LabelBtn /> }
              <Btns.TipBtn />
            </OperateBtnGroup>
            {/* <OperateBtnGroup>
            </OperateBtnGroup> */}
          </OperateBtnContainer>
          <Btns.Progress />
        </div>
      )
    }
    // 黑名单和担保圈链
    else {
      return (
        <div>
          <OperateBtnContainer>
            {/* <OperateBtnGroup>
              <Btns.ZoomInBtn />
              <Btns.ZoomOutBtn />
            </OperateBtnGroup> */}
            <OperateBtnGroup>
              {/* <Btns.GraphBtn /> */}
              {/* <Btns.DownloadBtn /> */}
              <Btns.SkinBtn />
              { this.props.graphType === 'bubble' && <Btns.LabelBtn /> }
              <Btns.TipBtn />
            </OperateBtnGroup>
            {/* <OperateBtnGroup>
            </OperateBtnGroup> */}
          </OperateBtnContainer>
          <Btns.Progress />
        </div>
      )
    }
  }

  selectNode = (vertex) => {
    this.props.setCurNode(vertex)
  }

  getClusterGraph () {
    let graph = null
    if (this.props.reduxLocation.query.type === 'profile_enterprise_info') {
      if (this.props.graphType === 'grid') {
        graph = <Chart />
      }
      if (this.props.graphType === 'bubble') {
        graph = (
          <div className='chart-container' ref='chart-container'>
            <BubbleGraph
              getNodeInfo={this.selectNode}
              toggleCardType={this.props.toggleCardType}
            />
          </div>
        )
      }
    } else {
      graph = <Chart />
    }

    return graph
  }

  render () {
    const { status, msg } = this.props.renderChartStatus
    const { setRenderChartStatus, selectCenterClusterNode, singleCompanyChart,
      reduxLocation, clusterChartData, centerClusterNode, centerTreeNode, clusterCompanyFilter } = this.props

    const singleCompanyProps = {
      setRenderChartStatus,
      selectCenterClusterNode,
      singleCompanyChart,
      clusterChartData,
      centerClusterNode,
      centerTreeNode,
      core: reduxLocation.query.group_name
    }

    return (
      <div>
        <Card />
        { this.getClusterGraph() }
        { this.getOperateBtns() }
        <SingleCompanyGraph {...singleCompanyProps} />
        {status === 'success' || status === 'fail' || status === '' ? null : <Hint.Loading status={status} />}
        <Hint.Error show={status === 'fail'} msg={msg} />
        <FilterModal visible={clusterCompanyFilter.visible} />
        <DownloadModal />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  graphType: state.setGraphType,
  reduxLocation: state.location,
  singleCompanyState: state.singleCompanyState,
  isNodeMax: state.nodeStatus,
  clusterCompanyFilter: state.clusterCompanyFilter
})

/**
 * map dispatch to Props
 * @param {Object} dispatch dispatch
 * @return {Object} dispatch
 */
const mapDispatchToProps = {
  setCurNode,
  setGraphType
}

export default connect(mapStateToProps, mapDispatchToProps)(ClusterGraph)
