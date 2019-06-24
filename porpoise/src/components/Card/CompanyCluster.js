import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Layout from './Layout'
import Triangle from '../partials/Triangle'
import Checkbox from '../partials/Checkbox'
import SearchSuggested from '../SearchSuggested'
import { getCompanyCluster, getCompanyClusterByName, toggleCardType } from 'actions/Card'
import { getClusterChart, hideClusterChart } from 'actions/Chart'
import { LP_PARAMS } from 'config'
import PropTypes from 'prop-types'

import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'

/**
 * 族谱群
 */
class CompanyCluster extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor (props) {
    super(props)
    this.state = {
      clusterToggleStatus: {},
      selectedClusterId: '', // 族谱群勾选状态,
      clusterPanelStatus: true,
      showSpecifiedCluster: false,
      noSpecifiedCluster: false,
      searchName: '',
      curPage: 1,
    }

    this.pageSize = 10
    this.clusterItems = {}
    this.belong = LP_PARAMS['Company_cluster']['belongBank']

    this.handleChecked = this.handleChecked.bind(this)
    this.toggleClusterPanel = this.toggleClusterPanel.bind(this)
    this.inputHandler = this.inputHandler.bind(this)
    this.searchHandler = this.searchHandler.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.paginate = this.paginate.bind(this)
  }

  /** 初次进入时，获取族谱群列表 */
  componentWillMount () {
    this.props.toggleCardType('hide-card')
  }

  /**
   * 如果获取到了新的族谱群，则将其放入 clusterItems 对象
   * @param {Object} nextProps nextProps
   * @param {Object} nextState nextState
   */
  componentWillReceiveProps (nextProps, nextState) {
    if (this.props.clusterItem !== nextProps.clusterItem) {
      this.clusterItems[nextProps.clusterItem.id] = nextProps.clusterItem.data
    }
    if (this.props.companyClusterId !== nextProps.companyClusterId) {
      this.setState({
        showSpecifiedCluster: true,
        noSpecifiedCluster: nextProps.companyClusterId === -1
      })
    }
  }

  /**
   * 展开、收起族谱群卡片
   */
  toggleClusterPanel () {
    this.setState({ clusterPanelStatus: !this.state.clusterPanelStatus })
  }

  /**
   * 展开，收起族谱群图
   * @param {String} id 族谱群id
   * @param {Boolean} isChecked 展开，收起标记位
   */
  handleChecked (id, isChecked) {
    if (isChecked) {
      this.props.getClusterChart(id)
      this.setState({
        selectedClusterId: id
      })
    } else {
      this.props.hideClusterChart(id)
      this.props.toggleCardType('hide-card')
      this.setState({
        selectedClusterId: ''
      })
    }
  }

  /**
   * 点击搜索提示列表事件
   * @param {String} name company name
   */
  inputHandler (name) {
    if (!name) {
      this.setState({
        showSpecifiedCluster: false
      })
      this.props.getCompanyCluster((this.state.curPage - 1) * this.pageSize, this.pageSize)
      return
    }
    this.props.getCompanyClusterByName(name)
    this.setState({
      searchName: name,
      showSpecifiedCluster: true
    })
  }

  /**
   * 只对输入被删除至空时响应，用于恢复展示所有族谱列表
   * @param {String} name company name
   */
  handleChange (name) {
    if (name === '') {
      this.inputHandler(name)
    }
  }

  /**
   * 点击搜索按钮事件
   * @param {String} name company name
   */
  searchHandler (name) {
    this.props.getCompanyClusterByName(name)
    this.setState({
      searchName: name,
      showSpecifiedCluster: true
    })
  }

  /**
   * 分页
   * @param {Number} page 页码
   */
  paginate (page) {
    this.setState({
      curPage: page
    })
    this.props.getCompanyCluster((page - 1) * this.pageSize, this.pageSize)
  }

  /**
   * @return {Object} jsx
   */
  render () {
    // 族谱群中心企业名称
    let clusterNames = []
    clusterNames = this.props.clusterNamesObj.clusterNames

    // 族谱群列表
    let ClusterList = null
    if (this.state.noSpecifiedCluster && this.state.showSpecifiedCluster) {
      ClusterList = (
        <div>族谱群中不存在该企业,
          <a className='company-link'
            href={`/graph?company=${this.state.searchName}&type=Graph`} target='_blank'> 跳转至企业详情</a>
        </div>
      )
    } else {
      ClusterList = clusterNames.map((v) => {
        return (
          <li key={v.cluster_cid}
            className={this.state.selectedClusterId === v.cluster_cid
              ? 'checked-cluster-item cluster-item' : 'cluster-item'}>
            <Checkbox
              isChecked={this.state.selectedClusterId === v.cluster_cid}
              label={v.cluster_name}
              name={v.cluster_cid} // 这里需要知道 id
              handleChecked={this.handleChecked} />
          </li>
        )
      })
    }

    const CardHeader = (
      <div className='card-header'>
        <h2 className='name'>
          <span className='active cluster'>
            关联族谱
          </span>
          <span> / </span>
          <span className='guarantee'>
            <Link to='/graph/guarantee_risk'>关联担保</Link>
          </span>
        </h2>
        <span className='triangle-wrapper' onClick={this.toggleClusterPanel}>
          <Triangle isOpen={this.state.clusterPanelStatus} />
        </span>
      </div>
    )

    const CardBody = (
      <div>
        <SearchSuggested selectSuggest={this.inputHandler}
          handleChange={this.handleChange}
          searchHandler={this.searchHandler}
          placeholder='输入企业名，查询包含该企业的族谱' />
        <ul className='description-list scroll-style cluster-list'>
          {ClusterList}
        </ul>
        {
          this.state.noSpecifiedCluster && this.state.showSpecifiedCluster ? null : (
            <Pagination
              onChange={this.paginate}
              current={this.state.curPage}
              total={this.props.clusterNamesObj.total}
              pageSize={this.pageSize}
            />
          )
        }
      </div>
    )

    return (
      <Layout
        cardHeader={CardHeader}
        foldCardHeader={CardHeader}
        cardBody={CardBody}
        isCardUnfold={this.state.clusterPanelStatus}
        name='族谱群详情'
        customClass='company-cluster' />
    )
  }
}

CompanyCluster.propTypes = {
  clusterNamesObj: PropTypes.object,
  clusterItem: PropTypes.object,
  getCompanyCluster: PropTypes.func,
  getClusterChart: PropTypes.func,
  hideClusterChart: PropTypes.func,
  getCompanyClusterByName: PropTypes.func,
  companyClusterId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  toggleCardType: PropTypes.func,
}

/**
 * react-redux state
 * @param {Object} state state
 * @return {Object} state
 */
const mapStateToProps = function (state) {
  return {
    clusterNamesObj: state.clusterNamesObj,
    clusterItem: state.clusterItem,
    companyClusterId: state.companyClusterId,
    clusterChartData: state.clusterChartData,
  }
}

/**
 * react-redux dispatch
 * @param {Object} dispatch diapatch
 * @return {Object} dispatch
 */
const mapDispatchToProps = (dispatch) => {
  return {
    getCompanyCluster: (offset, count) => dispatch(getCompanyCluster(offset, count)),
    getCompanyClusterByName: (id) => dispatch(getCompanyClusterByName(id)),
    getClusterChart: (id) => dispatch(getClusterChart(id)),
    hideClusterChart: (id) => dispatch(hideClusterChart(id)),
    toggleCardType: (type) => dispatch(toggleCardType(type)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyCluster)
