import React from 'react'
import Pagination from 'rc-pagination'
import Popup from './popup'

class EventTable extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isRiskShow: this.props.isRiskShow,
      current: -1,
    }

    this.pageSize = 5
    this.curIndex = 0
    this.riskList = {}
    this.tdMaxNum = 20  // 表格最大显示字数
    this.depth = 3

    this.showDetail = this.showDetail.bind(this)
    this.closeRiskInfo = this.closeRiskInfo.bind(this)
    this.pageChangeHandler = this.pageChangeHandler.bind(this)
    this.getRiskTable = this.getRiskTable.bind(this)
  }

  showDetail (index) {
    this.curIndex = index
    this.props.triggerRiskShow(this.props.relationName)
    // this.setState({ isRiskShow: true })
  }

  closeRiskInfo () {
    this.props.triggerRiskShow('')
    // this.setState({ isRiskShow: false })
  }

  searchHandler ({ ruleType = this.props.ruleType, offset = 0, count = 5 }) {
    const { riskType, listObj, singleCompany, getSingleCompanyRiskList, getRiskList } = this.props
    if (singleCompany) {
      listObj.jsonData['companies'] = listObj.requestObj[riskType]
      listObj.jsonData['offset'] = offset
      getSingleCompanyRiskList(riskType, listObj.jsonData)
    } else {
      getRiskList(ruleType, offset, count)
    }
  }

  pageChangeHandler (current, pageSize) {
    this.searchHandler({
      ruleType: this.props.ruleType,
      offset: (current - 1) * pageSize,
      count: pageSize
    })
    this.setState({
      current
    })
  }

  getRiskTable () {
    if (!this.riskList.length) {
      return
    }
    const { totalCount, singleCompany, index } = this.props
    const thead = singleCompany && index === 0 ? (
      <tr className='single-company'>
        <th width='299'>事件描述</th>
        <th width='25'>详情</th>
      </tr>
    ) : (
      <tr className='group'>
        <th width='162'>关联方</th>
        <th width='142'>事件描述</th>
        <th width='26'>详情</th>
      </tr>
    )

    this.tdMaxNum = singleCompany && index === 0 ? 44 : 20
    const riskItem = this.riskList.length ? (
      this.riskList.map((d, i) => {
        const firstTd = singleCompany && index === 0 ? null : <td><div>{d.company}</div></td>
        const pushTime = d.pushTime || 0
        return (
          <tr key={pushTime + i}>
            {firstTd}
            <td><div className={d.title.length > this.tdMaxNum ? 'hide-more' : ''}>
              {d.title}
            </div></td>
            <td>
              <a className='more' onClick={() => this.showDetail(i)}>
              </a>
            </td>
          </tr>
        )
      })
    ) : ''

    return (
      <div>
        <table className='risk-table'>
          <thead>
            {thead}
          </thead>
          <tbody>
            {riskItem}
          </tbody>
        </table>
        {
          this.riskList.length ? (
            <div className='pagination-container clearfix'>
              <Pagination
                total={totalCount}
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
    this.riskList = this.props.riskList
    const title = this.props.ruleType === 0 ? '风险事件' : '机会线索'
    return (
      <div>
        <div className='result-table'>
          {this.getRiskTable()}
        </div>
        {
          this.props.isRiskShow
            ? <Popup
              title={title}
              curIndex={this.curIndex}
              riskList={this.riskList}
              isRiskShow={this.props.isRiskShow}
              closeRiskInfo={this.closeRiskInfo}
              singleCompany={this.props.singleCompany}
              showRelativeGraph={this.props.showRelativeGraph}
              depth={this.depth}
              riskType={this.props.riskType}
            /> : ''
        }
      </div>
    )
  }
}

export default EventTable
