import React from 'react'
import { connect } from 'react-redux'
import Pagination from 'rc-pagination'
import Force from '../lib/d3.force'
// import ForceCanvas from '../lib/d3.force.canvas';

class RelationDetail extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      moneyOrder: 'normal',
      transferDateOrder: 'down',
      startDateOrder: 'down',
      endDateOrder: 'normal',
      current: 1,
      detail: [],
      isGraph: true
    }

    this.detailObj = {}
    this.pageSize = 5
    this.vertexes = []
    this.chart = null

    this.pageChangeHandler = this.pageChangeHandler.bind(this)
    this.toggleView = this.toggleView.bind(this)
    this.rankClickHandler = this.rankClickHandler.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.capitalCircleDetail !== nextProps.capitalCircleDetail) {
      this.detailObj = nextProps.capitalCircleDetail
      // 默认按交易日期来排序
      this.sortByDate('transferDateOrder')
      this.searchHandler({})
      this.setState({
        current: 1
      })
    }
    if (this.props.mutualGuaraDetail !== nextProps.mutualGuaraDetail) {
      this.detailObj = nextProps.mutualGuaraDetail
      // 默认按担保起始日期来排序
      this.sortByDate('startDateOrder')
      this.searchHandler({})
      this.setState({
        current: 1
      })
    }
  }

  rankClickHandler (e) {
    const type = e.currentTarget.getAttribute('type')
    const nextStatus = {
      normal: 'down',
      down: 'up',
      up: 'down'
    }
    this.setState({
      moneyOrder: 'normal',
      transferDateOrder: 'normal',
      startDateOrder: 'normal',
      endDateOrder: 'normal',
      [type]: nextStatus[this.state[type]]
    }, () => {
      if (type === 'moneyOrder') {
        this.sortByMoney()
      } else if (type === 'transferDateOrder' || type === 'startDateOrder' || type === 'endDateOrder') {
        this.sortByDate(type)
      }
      this.searchHandler({})
    })
  }

  sortByMoney () {
    this.detailObj.data.detail.sort((a, b) => {
      const money1 = a.rmb_value_sort
      const money2 = b.rmb_value_sort
      if (this.state.moneyOrder === 'up') {
        return money1 - money2
      } else if (this.state.moneyOrder === 'down') {
        return money2 - money1
      } else {
        return 0
      }
    })
  }

  sortByDate (type) {
    const dateTypeMap = {
      'transferDateOrder': 'transfer_date',
      'startDateOrder': 'begin_date',
      'endDateOrder': 'end_date'
    }
    let dateType = dateTypeMap[type]
    this.detailObj.data.detail.sort((a, b) => {
      const date1 = a[dateType].replace(/-/g, '')
      const date2 = b[dateType].replace(/-/g, '')
      if (this.state[type] === 'up') {
        return date1 - date2
      } else if (this.state[type] === 'down') {
        return date2 - date1
      } else {
        return 0
      }
    })
  }

  searchHandler ({ offset = 0, count = 5 }) {
    const subArr = this.detailObj.data.detail.slice(offset, offset + count)
    this.setState({
      detail: subArr
    })
  }

  pageChangeHandler (current, pageSize) {
    this.searchHandler({
      offset: (current - 1) * pageSize,
      count: pageSize
    })
    this.setState({
      current
    })
  }

  toggleView (type) {
    if (type === 'graph') {
      this.setState({
        isGraph: true
      })
    } else if (type === 'table') {
      this.setState({
        isGraph: false
      })
    }
  }

  // getChartVertex () {
  //   this.clusterChartData = Object.values(this.props.clusterChartData)[0]
  //   let vertexesTemp = []
  //   console.log(this.detailObj.detail)
  //   this.detailObj.detail && this.detailObj.detail.forEach((d) => {
  //     let vertexArr = this.clusterChartData.vertexes.filter((v) => v._id === d._from || v._id === d._to)
  //     vertexesTemp.push(...vertexArr)
  //     console.log(vertexArr)
  //   })
  //   console.log(vertexesTemp)
  //   // 去重
  //   vertexesTemp.forEach((t) => {
  //     if (!this.vertexes.find((v) => t._id === v._id)) {
  //       this.vertexes.push(t)
  //     }
  //   })
  // }

  getDetailTable () {
    const { isGraph, detail, current, startDateOrder, endDateOrder, moneyOrder, transferDateOrder } = this.state
    if (this.detailObj.num > 0) {
      const className = isGraph ? 'detail-table hide' : 'detail-table active'
      let tableItem = null
      let tableHeader = null
      if (this.detailObj.group_type === 'capital_circle') {
        tableHeader = (
          <tr>
            <th>转入方</th>
            <th>转出方</th>
            <th onClick={this.rankClickHandler} type='moneyOrder'>
              交易金额(万元)<i className={`rank-btn ${moneyOrder}`} />
            </th>
            <th onClick={this.rankClickHandler} type='transferDateOrder'>
              交易日期<i className={`rank-btn ${transferDateOrder}`} />
            </th>
            <th>备注</th>
          </tr>
        )
        tableItem = detail.map((val, item) => {
          return (
            <tr key={val['_id'] + item}>
              <td>{val['dst_name'] || '--'}</td>
              <td>{val['src_name'] || '--'}</td>
              <td>{val['rmb_value'] || '--'}</td>
              <td>{val['transfer_date'] || '--'}</td>
              <td>{val['type'] || '--'}</td>
            </tr>
          )
        })
      } else if (this.detailObj.group_type === 'mutual_guara') {
        tableHeader = (
          <tr>
            <th>担保方</th>
            <th>被担保方</th>
            <th onClick={this.rankClickHandler} type='moneyOrder'>
              担保金额(万元)<i className={`rank-btn ${moneyOrder}`} />
            </th>
            <th onClick={this.rankClickHandler} type='startDateOrder'>
              担保起始日期<i className={`rank-btn ${startDateOrder}`} />
            </th>
            <th onClick={this.rankClickHandler} type='endDateOrder'>
              担保终止日期<i className={`rank-btn ${endDateOrder}`} />
            </th>
            <th>担保类型</th>
          </tr>
        )
        tableItem = detail.map((val, item) => {
          return (
            <tr key={val['_id'] + item}>
              <td>{val['src_name'] || '--'}</td>
              <td>{val['dst_name'] || '--'}</td>
              <td>{val['rmb_value'] || '--'}</td>
              <td>{val['begin_date'] || '--'}</td>
              <td>{val['end_date'] || '--'}</td>
              <td>{val['type'] || '--'}</td>
            </tr>
          )
        })
      }

      return (
        <div className={className}>
          <div className='table-container scroll-style'>
            <table>
              <thead>
                {tableHeader}
              </thead>
              <tbody>
                {tableItem}
              </tbody>
            </table>
          </div>
          <div className='pagination-container clearfix'>
            <Pagination
              total={this.detailObj.num}
              current={current}
              pageSize={this.pageSize}
              onChange={this.pageChangeHandler}
            />
          </div>
        </div>
      )
    }
  }

  getDetailGraph () {
    const className = this.state.isGraph ? 'detail-graph active' : 'detail-graph hide'
    // this.getChartVertex()
    const relationGraph = this.refs.relation_graph
    const chartData = {
      edges: this.detailObj.data && this.detailObj.data.edges,
      vertexes: this.detailObj.data && this.detailObj.data.vertexes
    }
    if (chartData && relationGraph) {
      // 暂时沿用旧版本中引用jquery来初始化数据，后续再做修改
      // $('#relation-graph').forceGraph({
      //   data: chartData
      // })
      this.chart = new Force({
        ele: relationGraph,
        data: chartData
      })
      this.chart.init()
    }
    return (
      <div className={className}>
        <svg id='relation-graph' width='484' height='350' ref='relation_graph' />
      </div>
    )
  }

  render () {
    const graph = this.state.isGraph ? 'icon-tree-btn btn active' : 'icon-tree-btn btn'
    const table = this.state.isGraph ? 'icon-tabulation-btn btn' : 'icon-tabulation-btn btn active'
    return (
      <div className='risk-info-body scroll-style clearfix'>
        <div className='toggle-btns'>
          <i className={graph} onClick={() => this.toggleView('graph')}></i>
          <i className={table} onClick={() => this.toggleView('table')}></i>
        </div>
        <div className='risk-detail'>
          {this.getDetailTable()}
          {this.getDetailGraph()}
        </div>
      </div>
    )
  }
}

/**
 * map state to props
 * @param {Object} state state
 * @return {Object} state
 */
const mapStateToProps = function (state) {
  return {
    capitalCircleDetail: state.capitalCircleDetail,
    mutualGuaraDetail: state.mutualGuaraDetail,
    clusterChartData: state.clusterChartData
  }
}

/**
 * map dispatch to props
 * @param {Object} dispatch dispatch
 * @return {Object} action
 */
const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RelationDetail)
