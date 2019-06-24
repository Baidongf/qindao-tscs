import React from 'react'
import Pagination from 'rc-pagination'
import { Link } from 'react-router'
import 'rc-pagination/assets/index.css'
import SearchSuggested from 'components/SearchSuggested'

class ClusterList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      entityOrder: 'down',
      innerEntityOrder: 'normal',
      current: 1
    }
    this.value = ''
    this.pageSize = 10
    this.noContentTxt = '暂无企业数据'

    this.rankClickHandler = this.rankClickHandler.bind(this)
    this.searchHandler = this.searchHandler.bind(this)
    this.pageChangeHandler = this.pageChangeHandler.bind(this)
  }

  componentDidMount () {
    this.searchHandler({})
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.location !== nextProps.location) {
      this.searchHandler({})
    }
  }

  searchHandler ({ value = '', offset = 0, pageSize = 10 }) {
    this.value = value

    const rankValMap = {
      down: 1,
      up: -1,
      normal: 0
    }
    const entityOrder = rankValMap[this.state.entityOrder]
    const innerEntityOrder = rankValMap[this.state.innerEntityOrder]
    this.props.getClusterList({
      name: value,
      entityOrder,
      innerEntityOrder,
      offset,
      pageSize
    })
  }

  rankClickHandler (e) {
    const type = e.currentTarget.getAttribute('type')
    const nextStatus = {
      normal: 'down',
      down: 'up',
      up: 'down'
    }
    this.setState({
      entityOrder: 'normal',
      innerEntityOrder: 'normal',
      [type]: nextStatus[this.state[type]]
    }, () => {
      this.searchHandler({})
    })
  }

  genClusterList = () => {
    const { clusterList, location, searchClusterListLoding } = this.props
    const { entityOrder, innerEntityOrder } = this.state
    const titleMap = {
      'profile_enterprise_info': '派系核心企业',
      'risk_guarantee_info': '担保圈链名称',
      'risk_black_info': '黑名单关联族谱名称',
      'market_updown_info': '上下游族谱名称'
    }
    this.noContentTxt = searchClusterListLoding ? '数据加载中...' : '暂无企业数据'

    const header = (
      <thead>
        <tr>
          <th width='568'>{titleMap[location.query.type || 'profile_enterprise_info']}</th>
          <th width='190' onClick={this.rankClickHandler} type='entityOrder'>
            {location.query.type === 'profile_enterprise_info' ? '集团成员总数' : '成员总数'}<i className={`rank-btn ${entityOrder}`} />
          </th>
          <th width='190' onClick={this.rankClickHandler} type='innerEntityOrder'>
            {location.query.type === 'profile_enterprise_info' ? '集团中行内客户数量' : '包含行内客户数量'}<i className={`rank-btn ${innerEntityOrder}`} />
          </th>
        </tr>
      </thead>
    )
    const body = (
      <tbody>
        {
          clusterList.data.length ? (
            clusterList.data.map((d) => {
              return (
                <tr key={d.group_name}>
                  <td>
                    <Link
                      target='_blank'
                      to={`/graph/cluster/detail?group_name=${encodeURIComponent(d.group_name)}&type=${d.type}`}>
                      {d.group_name}
                    </Link>
                  </td>
                  <td>{d.entity_count}</td>
                  <td>{d.inner_entity_count}</td>
                </tr>
              )
            })
          ) : (
              <tr>
                <td colSpan='3'>{this.noContentTxt}</td>
              </tr>
            )
        }
      </tbody>
    )
    return (
      <table className='cluster-list-table'>
        {header}
        {body}
      </table>
    )
  }

  pageChangeHandler (current, pageSize) {
    this.searchHandler({
      value: this.value,
      offset: (current - 1) * pageSize,
      pageSize: pageSize
    })
    this.setState({
      current
    })
  }

  render () {
    const { clusterList } = this.props
    const total = clusterList.total

    return (
      <div className='cluster-list-container clearfix'>
        <SearchSuggested selectSuggest={(value) => this.searchHandler({ value })}
          placeholder='输入企业名，查询包含该企业的族谱'
          searchHandler={(value) => this.searchHandler({ value })}
        />
        {this.genClusterList()}
        {
          clusterList.data.length ? (
            <div className='pagination-container'>
              <Pagination
                showTotal={(total) => `共 ${total} 条`}
                total={total}
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
}

export default ClusterList
