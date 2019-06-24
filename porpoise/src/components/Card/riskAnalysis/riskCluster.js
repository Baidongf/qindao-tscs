import React from 'react'
import { connect } from 'react-redux'
import Layout from '../Layout'
import Triangle from '../../partials/Triangle'
import Checkbox from '../../partials/Checkbox'
import SearchSuggested from '../../SearchSuggested'
import { getCompanyCluster, getCompanyClusterByName,
  selectCenterClusterNode } from 'actions/Card'
import { getClusterNames, getCompanyClusterItem, getClusterChart, toggleCard } from 'routes/RiskAnalysis/modules/riskAnalysis'
import { hideClusterChart } from 'actions/Chart'
import { LP_PARAMS } from 'config'
import PropTypes from 'prop-types'

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
      checkStatus: {}, // 族谱群勾选状态,
      checkedClusterId: '',
      clusterPanelStatus: true,
      showSpecifiedCluster: false,
      noSpecifiedCluster: false,
      searchName: ''
    }

    this.clusterItems = {}
    this.belong = LP_PARAMS['Company_cluster']['belongBank']

    this.handleChecked = this.handleChecked.bind(this)
    this.toggleClusterPanel = this.toggleClusterPanel.bind(this)
    this.inputHandler = this.inputHandler.bind(this)
    this.searchHandler = this.searchHandler.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  /** 初次进入时，获取族谱群列表 */
  componentWillMount () {
    this.props.getClusterNames()
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
   * 展开，收起族谱群子列表
   * @param {String} id 族谱群id
   */
  toggleClusterItem (id) {
    const clusterToggleStatus = this.state.clusterToggleStatus
    clusterToggleStatus[id] = !clusterToggleStatus[id]
    this.setState({
      clusterToggleStatus
    })
    // 如果展开的是之前未打开过的族谱群，则去请求数据
    if (clusterToggleStatus[id] && !this.clusterItems[id]) {
      this.props.getCompanyClusterItem(id)
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
    let checkStatus = this.state.checkStatus
    if (isChecked) {
      this.props.getClusterChart(id)
      checkStatus[id] = true
      this.setState({
        checkStatus,
        checkedClusterId: id
      })
      this.props.toggleCard('risk_index')
    } else {
      this.props.hideClusterChart(id)
      checkStatus[id] = false
      this.setState({
        checkStatus,
        checkedClusterId: ''
      })
      this.props.toggleCard('hide_card')
    }
  }

  /**
   * 选中展开的族谱群点在屏幕中央显示
   * @param {String} id vertex id
   * @param {String} centerId id of center company of the company
   * @return {void} return nothing
   */
  selectCenterClusterNode (id, centerId) {
    if (!this.state.checkStatus[centerId]) return
    this.props.selectCenterClusterNode(id)
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
   * @return {Object} jsx
   */
  render () {
    // 族谱群中心企业名称
    let clusterNames = []
    if (this.state.showSpecifiedCluster) {
      clusterNames = this.props.clusterNames.filter((cluster) => cluster.id === this.props.companyClusterId)
    } else {
      clusterNames = this.props.clusterNames
    }
    // 族谱群列表
    let ClusterList = null
    if (this.state.noSpecifiedCluster && this.state.showSpecifiedCluster) {
      ClusterList = (
        <div>族谱群中不存在该企业,
          <a href={`/graph/?company=${this.state.searchName}&type=Graph`} target='_blank'> 跳转至企业详情</a>
        </div>
      )
    } else {
      ClusterList = clusterNames.map((v) => {
        const cluster = this.clusterItems[v.id] || []
        const ClusterItem = cluster.map((item) => {
          return (
            <li key={item._id}
              className={item['belong_gdrc'] ? 'company-belong' : 'company-not-belong'}
              onClick={(id, centerId) => this.selectCenterClusterNode(item._id, v.id)}>
              {item.name}
            </li>
          )
        })
        return (
          <li key={v.id}
            className={this.state.checkedClusterId === v.id ? 'checked-cluster-item cluster-item' : 'cluster-item'}>
            <Checkbox
              isChecked={this.state.checkedClusterId === v.id}
              label={v.name + '（' + v.num + '）'}
              name={v.id} // 这里需要知道 id
              handleChecked={this.handleChecked} />
            <span onClick={() => this.toggleClusterItem(v.id)} className='triangle-wrapper'>
              <Triangle isOpen={this.state.clusterToggleStatus[v.id]} />
            </span>
            <ol className={this.state.clusterToggleStatus[v.id] ? 'cluster-item-ol' : 'hide'}>
              {ClusterItem}
            </ol>
          </li>
        )
      })
    }

    const CardHeader = (
      <div className='card-header' onClick={this.toggleClusterPanel}>
        <h2 className='name'>预授信客户核查</h2>
        <span className='triangle-wrapper'>
          <Triangle isOpen={this.state.clusterPanelStatus} />
        </span>
      </div>
    )

    const CardBody = (
      <div>
        <SearchSuggested selectSuggest={this.inputHandler}
          handleChange={this.handleChange}
          searchHandler={this.searchHandler} />
        <p className='nowStyle2'>注:
          <i className='company-not-belong'>蓝色</i>代表行外企业;
          <i className='company-belong'>绿色</i>是行内企业;
        </p>
        <p className='nowStyle2'>
          <i className='company-graylist'>灰色</i>是灰名单企业;
          <i className='company-blacklist'>黑色</i>是黑名单企业;
        </p>
        <ul className='description-list scroll-style cluster-list'>
          {ClusterList}
        </ul>
      </div>
    )

    return (
      <Layout
        cardHeader={CardHeader}
        foldCardHeader={CardHeader}
        cardBody={CardBody}
        isCardUnfold={this.state.clusterPanelStatus}
        name='预授信客户核查'
        customClass='risk-analysis company-cluster' />
    )
  }
}

CompanyCluster.propTypes = {
  clusterNames: PropTypes.array,
  clusterItem: PropTypes.object,
  getCompanyCluster: PropTypes.func,
  getClusterChart: PropTypes.func,
  getCompanyClusterItem: PropTypes.func,
  hideClusterChart: PropTypes.func,
  selectCenterClusterNode: PropTypes.func,
  getCompanyClusterByName: PropTypes.func,
  companyClusterId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

/**
 * react-redux state
 * @param {Object} state state
 * @return {Object} state
 */
const mapStateToProps = function (state) {
  return {
    clusterNames: state.clusterNames,
    clusterItem: state.clusterItem,
    companyClusterId: state.companyClusterId
  }
}

/**
 * react-redux dispatch
 * @param {Object} dispatch diapatch
 * @return {Object} dispatch
 */
const mapDispatchToProps = (dispatch) => {
  return {
    getClusterNames: () => dispatch(getClusterNames()),
    getCompanyCluster: () => dispatch(getCompanyCluster()),
    getCompanyClusterItem: (id) => dispatch(getCompanyClusterItem(id)),
    getCompanyClusterByName: (id) => dispatch(getCompanyClusterByName(id)),
    getClusterChart: (id) => dispatch(getClusterChart(id)),
    hideClusterChart: (id) => dispatch(hideClusterChart(id)),
    selectCenterClusterNode: (id) => dispatch(selectCenterClusterNode(id)),
    toggleCard: (type) => dispatch(toggleCard(type)),
    toggleCardType: (type) => dispatch(toggleCardType(type))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyCluster)
