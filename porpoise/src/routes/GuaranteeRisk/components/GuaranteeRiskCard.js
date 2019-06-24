import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import GuaranteeList from './GuaranteeList'
import Layout from 'components/Card/Layout'
import Triangle from 'components/partials/Triangle'
import SearchSuggested from 'components/SearchSuggested'
import { selectCenterClusterNode, toggleCardType } from 'actions/Card'
import { getGuaranteePaths, getCluster, getClusterChart, hideClusterChart,
  getPathsByName, getGuaranteePath, getGuaranteePathCount, clearClusterChart, selectLinksToHighlight } from '../modules/guaranteeRisk'
import PropTypes from 'prop-types'

import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import './GuaranteeRiskCard.scss'

/**
 * 担保风险分析卡片
 */
class GuaranteeRiskCard extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor (props) {
    super(props)
    this.state = {
      clusterToggleStatus: {},
      clusterPanelStatus: true,
      showSpecifiedCluster: false,
      noSpecifiedCluster: false,
      searchName: '',
      guaranteeEachOther: [],
      curPage: {},
      pathStatus: {},
      selectedPathId: '',
    }

    this.clusterItems = {}
    this.pageSize = 10

    this.handleChecked = this.handleChecked.bind(this)
    this.toggleClusterPanel = this.toggleClusterPanel.bind(this)
    this.inputHandler = this.inputHandler.bind(this)
    this.searchHandler = this.searchHandler.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.selectEntity = this.selectEntity.bind(this)
    this.paginate = this.paginate.bind(this)
    this.clearChart = this.clearChart.bind(this)
    this.togglePathPanel = this.togglePathPanel.bind(this)
  }

  /** 初次进入时，获取担保列表 */
  componentWillMount () {
    if (!this.props.clusterNames.names) {
      Object.keys(this.props.pathTypeMap).forEach((pathType) => {
        this.props.getGuaranteePaths(pathType, 0, this.offset)
        this.state.curPage[pathType] = 1  // 初始化页码
      })
    }
    if (!this.props.guaranteePathCount.length) this.props.getGuaranteePathCount()
    this.clearChart()
  }

  /**
   * 如果获取到了新的担保，则将其放入 clusterItems 对象
   * @param {Object} nextProps nextProps
   * @param {Object} nextState nextState
   */
  componentWillReceiveProps (nextProps, nextState) {
    if (this.props.clusterItem !== nextProps.clusterItem) {
      this.clusterItems[nextProps.clusterItem.id] = nextProps.clusterItem.data
    }
    if (this.props.clusterNameRes !== nextProps.clusterNameRes) {
      this.setState({
        showSpecifiedCluster: true,
        noSpecifiedCluster: nextProps.clusterNameRes.length === 0
      })
    }
  }

  /**
   * 展开、收起担保卡片
   */
  toggleClusterPanel () {
    this.setState({ clusterPanelStatus: !this.state.clusterPanelStatus })
  }

  /**
   * 展开，收起担保图
   * @param {String} id 担保id
   * @param {Boolean} isChecked 展开，收起标记位
   * @param {Array} selectedPath 选中的路径
   */
  handleChecked (id, isChecked, selectedPath) {
    if (isChecked) {
      this.props.getClusterChart(id)
      this.props.toggleCardType('Company_cluster')
      this.props.selectLinksToHighlight(selectedPath)
      this.setState({
        selectedPathId: id
      })
    } else {
      this.props.hideClusterChart(id)
      this.props.toggleCardType('hide_card')
      this.props.selectLinksToHighlight([])
      this.setState({
        selectedPathId: ''
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
      Object.keys(this.props.pathTypeMap).forEach((pathType) => {
        this.props.getGuaranteePaths(pathType, (this.state.curPage[pathType] - 1) * this.pageSize, this.offset)
      })
      this.props.getGuaranteePathCount()
      return
    }
    this.props.getPathsByName(name)
    this.setState({
      searchName: name,
      showSpecifiedCluster: true
    })
  }

  /**
   * 只对输入被删除至空时响应，用于恢复展示所有担保列表
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
    this.props.getPathsByName(name)
    this.setState({
      searchName: name,
      showSpecifiedCluster: true
    })
  }

  /**
   * 选中某个实体，将其移至屏幕中央 & 显示和它相关的担保路径
   * @param {String} id entity id
   */
  selectEntity (id) {
    this.props.getGuaranteePath(id)
    this.props.selectCenterClusterNode(id)
    this.props.toggleCardType('guarantee_path')
  }

  /**
   * 分页处理
   * @param {Number} page 页码
   * @param {Number} pageSize 页面大小
   * @param {String} pathType 路径类别
   */
  paginate (page, pageSize, pathType) {
    this.props.getGuaranteePaths(pathType, (page - 1) * pageSize, pageSize)
    const curPage = this.state.curPage
    curPage[pathType] = page
    this.setState({
      curPage
    })
  }

  clearChart () {
    this.props.clearClusterChart()
    this.props.toggleCardType('hide_card')
  }

  togglePathPanel (pathType) {
    let pathStatus = this.state.pathStatus
    pathStatus[pathType] = !pathStatus[pathType]
    this.setState({
      pathStatus
    })
  }

  /**
   * @return {Object} jsx
   */
  render () {
    const CardHeader = (
      <div className='card-header'>
        <h2 className='name'>
          <span className='cluster'>
            <Link to='/graph/lp/?lp_type=Company_cluster&origin=bigdata_lp'>关联族谱</Link>
          </span>
          <span> / </span>
          <span className='active guarantee'>
            关联担保
          </span>
        </h2>
        <span className='triangle-wrapper' onClick={this.toggleClusterPanel}>
          <Triangle isOpen={this.state.clusterPanelStatus} />
        </span>
      </div>
    )

    const GuaranteeListProps = {
      getCluster: this.props.getCluster,
      data: this.props.clusterNames.names || [],
      clusterNameRes: this.props.clusterNameRes,
      handleChecked: this.handleChecked,
      companyClusterId: this.props.companyClusterId,
      clusterItems: this.clusterItems,
      noSpecifiedCluster: this.state.noSpecifiedCluster,
      showSpecifiedCluster: this.state.showSpecifiedCluster,
      selectEntity: this.selectEntity,
      clearChart: this.clearChart,
      selectedPathId: this.state.selectedPathId,
    }

    const CardBody = (
      <div>
        <SearchSuggested selectSuggest={this.inputHandler}
          handleChange={this.handleChange}
          searchHandler={this.searchHandler}
          placeholder='输入企业名，查询包含该企业的关联担保' />
        <div className='scroll-style guarantee-data'>
          {
            Object.keys(this.props.pathTypeMap).map((pathType) => (
              <div key={pathType} className='clearfix'>
                {/* <p className='guarantee-type-title' onClick={() => this.togglePathPanel(pathType)}>
                  {this.props.pathTypeMap[pathType]} ({this.props.guaranteePathCount[pathType]}个)
                  <span className='triangle-wrapper'>
                    <Triangle isOpen={this.state.pathStatus[pathType]} />
                  </span>
                </p> */}
                {
                  this.state.pathStatus[pathType] || true ? (
                    <div>
                      <GuaranteeList {...GuaranteeListProps}
                        paths={this.props.guaranteePaths[pathType]} />
                      {
                        this.state.showSpecifiedCluster ? null : (
                          <Pagination
                            onChange={(page, pageSize) => this.paginate(page, pageSize, pathType)}
                            current={this.state.curPage[pathType]}
                            total={this.props.guaranteePathCount[pathType]}
                            pageSize={this.pageSize}
                          />
                        )
                      }
                    </div>
                  ) : null
                }
              </div>
            ))
          }
        </div>
      </div>
    )

    return (
      <Layout
        cardHeader={CardHeader}
        foldCardHeader={CardHeader}
        cardBody={CardBody}
        isCardUnfold={this.state.clusterPanelStatus}
        name='担保详情'
        customClass='guarantee-risk' />
    )
  }
}

GuaranteeRiskCard.propTypes = {
  clusterNames: PropTypes.object,
  clusterItem: PropTypes.object,
  getGuaranteePaths: PropTypes.func,
  getClusterChart: PropTypes.func,
  getCluster: PropTypes.func,
  hideClusterChart: PropTypes.func,
  selectCenterClusterNode: PropTypes.func,
  getPathsByName: PropTypes.func,
  companyClusterId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  getGuaranteePath: PropTypes.func,
  toggleCardType: PropTypes.func,
  pathTypeMap: PropTypes.object,
  guaranteePathCount: PropTypes.object,
  getGuaranteePathCount: PropTypes.func,
  clusterNameRes: PropTypes.array,
  clearClusterChart: PropTypes.func,
  guaranteePaths: PropTypes.object,
  selectLinksToHighlight: PropTypes.func,
}

/**
 * react-redux state
 * @param {Object} state state
 * @return {Object} state
 */
const mapStateToProps = function (state) {
  return {
    clusterNames: state.guaranteeRiskClusterNames || {},
    clusterItem: state.guaranteeClusterItem,
    clusterNameRes: state.clusterNameRes,
    pathTypeMap: state.pathTypeMap || {},
    guaranteePathCount: state.guaranteePathCount || {},
    guaranteePaths: state.guaranteePaths
  }
}

/**
 * react-redux dispatch
 * @param {Object} dispatch diapatch
 * @return {Object} dispatch
 */
const mapDispatchToProps = (dispatch) => {
  return {
    getGuaranteePaths: (pathType, offset, count) => dispatch(getGuaranteePaths(pathType, offset, count)),
    getCluster: (id) => dispatch(getCluster(id)),
    getPathsByName: (name) => dispatch(getPathsByName(name)),
    getClusterChart: (id) => dispatch(getClusterChart(id)),
    hideClusterChart: (id) => dispatch(hideClusterChart(id)),
    selectCenterClusterNode: (id) => dispatch(selectCenterClusterNode(id)),
    getGuaranteePath: (id) => dispatch(getGuaranteePath(id)),
    toggleCardType: (type) => dispatch(toggleCardType(type)),
    getGuaranteePathCount: () => dispatch(getGuaranteePathCount()),
    clearClusterChart: () => dispatch(clearClusterChart()),
    selectLinksToHighlight: (path) => dispatch(selectLinksToHighlight(path)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GuaranteeRiskCard)
