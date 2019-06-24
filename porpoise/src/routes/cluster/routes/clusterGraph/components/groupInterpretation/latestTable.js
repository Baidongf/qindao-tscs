import React from 'react'
import Pagination from 'rc-pagination'
import Popup from './popup'

/**
 * props: {
 *  @{Number} index -- 标识
 *  @{String} type -- 识别类型，根据类型不同配置各自的columns
 *  @{Array} list -- table显示的行数据
 *  @{Number} totalCount -- 数据综合统计
 *  @{Boolean} popupShow -- popup显示标识
 *  @{String} relationName -- popup显示的判断变量
 *  @{Function} triggerRiskShow
 *  @{Function} getTableList -- 请求更新table数据
 * }
 */
class LatestTable extends React.Component {
  constructor (props) {
    super(props)

    if (this.props.type && this.props.type === 'block') {
      this.columns = [{
        key: 'groupEntityNames',
        title: '客户名称',
        width: '150',
        tdMaxNum: 18
      }, {
        key: 'rmbValue',
        title: '交易金额(万元)',
        width: '90',
        direction: true,
        dirKey: 'rmbValueSort'
      }, {
        key: 'transTime',
        title: '交易日期',
        width: '90',
        dirKey: 'transTime',
        direction: true
      }, {
        key: 'detail',
        title: '详情',
        width: '30',
        control: true
      }]
      this.state = {
        current: 1,
        direction: 'DESC',
        dirKey: 'transTime'
      }
      this.title = '交易详情'
    } else if (this.props.type === 'expire') {
      this.columns = [{
        key: 'entityName',
        title: '客户名称',
        width: '200',
        tdMaxNum: 20
      }, {
        key: 'type',
        title: '业务类型',
        width: '110',
      }, {
        key: 'dueTime',
        title: '到期日',
        width: '110',
        dirKey: 'dueTime',
        direction: true
      }, {
        key: 'detail',
        title: '详情',
        width: '30',
        control: true
      }]
      this.state = {
        current: 1,
        direction: 'ASC',
        dirKey: 'dueTime'
      }
      this.title = '到期业务详情'
    } else if (this.props.type === 'credit_info') {
      this.columns = [{
        key: 'entityName',
        title: '授信对象',
        width: '180',
        tdMaxNum: 20
      }, {
        key: 'creditMoney',
        title: '授信金额(万元)',
        width: '100'
      }, {
        key: 'detail',
        title: '详情',
        width: '30',
        control: true
      }]
      this.state = {
        current: 1
      }
      this.title = '授信超限'
    }

    this.pageSize = 5

    this.popupItem = {}
    this.rankClickHandler = this.rankClickHandler.bind(this)
    this.closeRiskInfo = this.closeRiskInfo.bind(this)
    this.pageChangeHandler = this.pageChangeHandler.bind(this)
  }

  formatData (d, key) {
    if (!d[key]) return '--'
    if (key === 'remValue') {
      return d[key].slice(0, -2)
    } else if (key === 'transTime' || key === 'dueTime') {
      return d[key].split(' ')[0]
    } else if (key === 'groupEntityNames') {
      return d[key].join(', ')
    } else {
      return d[key]
    }
  }

  showDetail (i) {
    this.popupItem = this.props.list.data[i]
    this.props.triggerRiskShow(this.props.relationName)
  }

  closeRiskInfo () {
    this.props.triggerRiskShow('')
    this.popupItem = {}
  }

  pageChangeHandler (current) {
    this.setState({
      current
    })
    let jsonData = {
      offset: (current - 1) * this.pageSize,
      pageSize: this.pageSize
    }
    if (this.props.type === 'block' || this.props.type === 'expire') {
      jsonData = Object.assign(jsonData, {
        direction: this.state.direction,
        property: this.state.dirKey,
        type: this.props.type
      })
    }
    this.props.getTableList(jsonData)
  }

  rankClickHandler (e, column) {
    this.setState({
      dirKey: column.dirKey,
      direction: this.state.direction === 'DESC' ? 'ASC' : 'DESC'
    }, () => {
      this.props.getTableList(
        { direction: this.state.direction,
          property: this.state.dirKey,
          offset: (this.state.current - 1) * this.pageSize,
          type: this.props.type }
      )
    })
  }

  constructTable () {
    let list = this.props.list.data
    let tHead = this.columns.map((column, i) => {
      return (
        <th key={column.key} width={column.width} onClick={column.direction ? (e) => this.rankClickHandler(e, column) : ''} className={column.direction ? 'dir-th' : ''}>
          { column.title }
          { column.direction ? (
            <i className={`rank-btn ${this.state.dirKey === column.dirKey ? (this.state.direction === 'DESC' ? 'down' : 'up') : 'normal'}`} />
           ) : '' }
        </th>
      )
    })

    let tItems = list.length ? (
      list.map((d, trInd) => {
        let tds = this.columns.map((column, i) => {
          let title = this.formatData(d, column['key'])
          return column.control ? (
            <td key={i}>
              <div><a className='more' onClick={() => this.showDetail(trInd)}></a></div>
            </td>
          ) : (
            <td key={i}>
              <div className={column.tdMaxNum && title.length > column.tdMaxNum ? 'hide-more' : ''}>{title}</div>
            </td>
          )
        })
        return (
          <tr key={trInd}>
            {tds}
          </tr>
        )
      })
    ) : ''

    return (
      <div>
        <table className='risk-table'>
          <thead>
            <tr>{tHead}</tr>
          </thead>
          <tbody className='latest-table-body'>
            {tItems}
          </tbody>
        </table>
        {
          list.length ? (
            <div className='pagination-container clearfix'>
              <Pagination
                total={this.props.totalCount}
                current={this.state.current}
                pageSize={this.pageSize}
                onChange={this.pageChangeHandler}
              />
            </div>
          ) : null
        }
      </div>
    )
  }

  render () {
    return (
      <div className='result-table latest-table'>
        {this.constructTable()}
        {
          this.props.popupShow ? (
            <Popup
              type={this.props.type}
              title={this.title}
              popupItem={this.popupItem}
              isRiskShow={this.props.popupShow}
              closeRiskInfo={this.closeRiskInfo}
            />
          ) : ''
        }
      </div>
    )
  }
}

export default LatestTable
