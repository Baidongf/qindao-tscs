import React from 'react'
import { connect } from 'react-redux'
import { getCompanyBrief, toggleCardType, selectCenterClusterNode } from 'actions/Card'
import Layout from './Layout'
import { riskStatus } from 'graph.config'
import PropTypes from 'prop-types'

import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'

/** 族谱详情卡片 */
class ClusterDetailCard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      clusterName: '',
      clusterCompany: [],
      paginateClusterCompany: [], // 用于分页显示的族谱企业列表
      curPage: 1,
    }
    this.pageSize = 8

    this.setDetail = this.setDetail.bind(this)
    this.paginate = this.paginate.bind(this)
  }

  componentWillMount () {
    if (this.props.reduxLocation.query.lp_type === 'Company_cluster') { // 族谱
      this.setDetail(this.props.clusterChartData)
    } else if (this.props.reduxLocation.pathname === '/graph/guarantee_risk') { // 担保
      this.setDetail(this.props.guaranteeClusterChartData)
    }
  }

  componentWillReceiveProps (nextProps) {
    // 族谱
    if (this.props.clusterChartData !== nextProps.clusterChartData) {
      this.setDetail(nextProps.clusterChartData)
    }
    // 担保
    if (this.props.guaranteeClusterChartData !== nextProps.guaranteeClusterChartData) {
      this.setDetail(nextProps.guaranteeClusterChartData)
    }
  }

  setDetail (clusterChartData) {
    const clusterId = Object.keys(clusterChartData)[0]
    if (!clusterId) return

    let clusterName = ''
    if (this.props.reduxLocation.query.lp_type === 'Company_cluster') {
      clusterName = this.props.reduxLocation.query.group_name
    } else if (this.props.reduxLocation.pathname === '/graph/guarantee_risk') {
      clusterName = clusterId
    }

    const clusterCompany = clusterChartData[clusterId].vertexes
      .filter((vertex) => vertex._id.includes('Company') || !vertex._id.includes('/')) // A, mock for guarantee mock data
      .map((vertex) => {
        return {
          name: vertex.name,
          business_status: vertex.business_status,
          id: vertex._id,
        }
      })
    const paginateClusterCompany = clusterCompany.slice(0, this.pageSize)
    this.setState({
      clusterName,
      clusterCompany,
      paginateClusterCompany,
    })
  }

  getCompanyBrief (name, id) {
    this.props.getCompanyBrief(name)
    this.props.toggleCardType('Company')
    this.props.selectCenterClusterNode(id)
  }

  paginate (page) {
    this.setState({
      curPage: page,
      paginateClusterCompany: this.state.clusterCompany.slice(this.pageSize * (page - 1), this.pageSize * page)
    })
  }

  render () {
    const { clusterCompany, paginateClusterCompany, clusterName } = this.state

    let txtContent = 'data:text/txt;charset=utf-8,'
    clusterCompany.forEach((company) => {
      txtContent += company.name + '\n'
    })

    const BackBtn = (
      <div className='card-title clearfix' onClick={() => this.props.toggleCardType('Company_cluster')}>
        <i className='back' />
        <h2 className='company-detail-title'>返回</h2>
      </div>
    )

    const CardHeader = (
      <div>
        <div className='clearfix'>
          <h2 className='name'>{clusterName}</h2>
        </div>
        <p className='cluster-num'>
          <span>共{clusterCompany.length || 0}家企业</span>
        {/*  <a className='export-btn' href={encodeURI(txtContent)} download='族谱企业名单.txt'>导出企业名单</a>*/}
        </p>
      </div>
    )

    const CardBody = (
      <div>
        <table className='table cluster-detail'>
          <thead>
            <tr>
              <td><div className='name'>企业名称</div></td>
              <td><div className='status'>经营状态</div></td>
            </tr>
          </thead>
          <tbody className='scroll-style'>
            {paginateClusterCompany.map((v) => {
              return (
                <tr key={v.name}>
                  <td>
                    <div className='name'>
                      <a onClick={() => this.getCompanyBrief(v.name, v.id)}>{v.name}</a>
                    </div>
                  </td>
                  <td>
                    <div title={v.business_status}
                      className={riskStatus.includes(v.business_status) ? 'status danger' : 'status'}>
                      {v.business_status || '--'}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <Pagination
          onChange={this.paginate}
          current={this.state.curPage}
          total={clusterCompany.length}
          pageSize={this.pageSize}
        />
      </div>
    )

    return (
      <Layout
        BackBtn={BackBtn}
        cardHeader={CardHeader}
        cardBody={CardBody}
        name={this.state.clusterName}
        customClass='cluster-card' />
    )
  }
}

ClusterDetailCard.propTypes = {
  clusterChartData: PropTypes.object,
  clusterNamesObj: PropTypes.object,
  toggleCardType: PropTypes.func,
  selectCenterClusterNode: PropTypes.func,
  getCompanyBrief: PropTypes.func,
  guaranteeClusterChartData: PropTypes.object,
  reduxLocation: PropTypes.object,
}

const mapStateToProps = (state) => {
  return {
    personBrief: state.briefData,
    curNode: state.curNode,
    reduxLocation: state.location,
    clusterNamesObj: state.clusterNamesObj,
    clusterChartData: state.clusterChartData,
    guaranteeClusterChartData: state.guaranteeClusterChartData,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCompanyBrief: (name) => dispatch(getCompanyBrief(name)),
    toggleCardType: (cardType) => dispatch(toggleCardType(cardType)),
    selectCenterClusterNode: (id) => dispatch(selectCenterClusterNode(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClusterDetailCard)
