import React from 'react'
import { connect } from 'react-redux'
import Layout from './Layout'
import PropTypes from 'prop-types'
import InputRange from './partials/InputRange'
import InputDatePicker from './partials/InputDatePicker'
import Select from 'components/partials/Select'
import { filterEdgeDetail } from 'actions/Card'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'

/** 行内数据详情卡片 */
class BelongBankDetailCard extends React.Component {
  constructor (props) {
    super(props)

    const PAGE_SIZE = 5
    this.state = {
      postBody: {          // postBody 默认结构
        table: '',
        offset: 0,
        limit: PAGE_SIZE,
        filters: {},
        needCount: true
      },
      filtersObj: {},      // 保存筛选状态
      offset: 0,           // 保存分页状态
      limit: PAGE_SIZE,    // 保存分页状态
      current: 1,
      valueValid: true,
      dateValid: true,
      relationConfig: {},
      filterInvalid: {}
    }

    this.changeFilters = this.changeFilters.bind(this)
    this.getBelongBankList = this.getBelongBankList.bind(this)
    this.changePage = this.changePage.bind(this)
  }

  componentDidMount () {
    const { curEdge } = this.props
    if (curEdge.__from && curEdge.__to) {
      const relationConfig = this.props.belongBankRelation.find((r) => curEdge._id.includes(r.target_table))
      let postBody = {
        from: curEdge.__from,
        to: curEdge.__to,
        table: relationConfig.target_table
      }
      postBody = Object.assign({}, this.state.postBody, postBody)
      this.props.filterEdgeDetail(postBody)

      this.setState({
        relationConfig
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.curEdge !== nextProps.curEdge) {
      const relationConfig = this.props.belongBankRelation.find((r) => nextProps.curEdge._id.includes(r.target_table))
      if (!relationConfig) return

      let postBody = Object.assign({}, this.state.postBody)
      postBody.from = nextProps.curEdge.__from
      postBody.to = nextProps.curEdge.__to
      postBody.table = relationConfig.target_table
      this.props.filterEdgeDetail(postBody)

      this.setState({
        relationConfig
      })
    }
  }

  changeFilters (name, range, filter) {
    const filtersObj = Object.assign({}, this.state.filtersObj)
    filtersObj[name] = {
      type: filter.value_type,
      field: filter.source_name_cn,
      value: {}
    }
    if (typeof range === 'object') {
      if ('min' in range) {
        filtersObj[name].value.min = range.min
      }
      if ('max' in range) {
        filtersObj[name].value.max = range.max
      }
    } else {
      filtersObj[name].value.eq = range
    }

    /** 下拉列表中的默认项 */
    if (range === '请选择') {
      filtersObj[name].value.eq = null
    }

    this.setState({ filtersObj })
  }

  changePage (current, pageSize) {
    let offset = current > 0 ? (current - 1) * pageSize : 0
    let limit = pageSize
    this.state.offset = offset
    this.state.limit = limit
    this.state.current = current
    this.getBelongBankList()
  }

  /** 获取行内数据列表 */
  getBelongBankList () {
    const { offset, limit, relationConfig, filtersObj } = this.state
    const { curEdge, filterEdgeDetail } = this.props

    let postBody = {
      offset,
      limit,
      table: relationConfig.target_table,
      from: curEdge.__from,
      to: curEdge.__to,
      filters: {}
    }
    postBody = Object.assign({}, this.state.postBody, postBody)

    let allValid = true
    for (let key in filtersObj) {
      const f = filtersObj[key]
      if (this.checkFilterValidity(key, f)) {
        postBody.filters[f.field] = postBody.filters[f.field] || {}
        Object.assign(postBody.filters[f.field], f.value)
      } else {
        allValid = false
      }
    }
    allValid && filterEdgeDetail(postBody)
  }

  /**
   * 检查筛选条件是否合法
   * @param {String} key 筛选条件名称
   * @param {Object} filter 筛选条件
   * @return {Boolean} is filter valid
   */
  checkFilterValidity (key, filter) {
    const { type, value } = filter
    /** 对枚举类型不做检查 */
    if (['enum'].includes(type)) return true

    const filterInvalid = Object.assign({}, this.state.filterInvalid)
    if (value.hasOwnProperty('min') && value.hasOwnProperty('max')) {
      if (value.min > value.max) {
        filterInvalid[key] = true
        this.setState({ filterInvalid })
        return false
      }
    }
    filterInvalid[key] = false
    this.setState({ filterInvalid })
    return true
  }
  getAllNodes () {
    const vertexes = this.props.originChartData.vertexes.concat(this.props.expandChartData.vertexes)
    const { guaranteeClusterChartData } = this.props
    for (let i in guaranteeClusterChartData) {
      vertexes.push(...guaranteeClusterChartData[i].vertexes)
    }
    return vertexes
  }

  /**
   * 生成不同类型的筛选器
   * @param {Object} filter 属性设置列表
   * @param {Number} key filter index
   * @return {Object} jsx
   */
  generateFilter (filter, key) {
    const filterName = filter.name + key
    const { filterInvalid } = this.state
    const generateFilterMethod = {
      number: (filter, key) => (
        <div key={key}>
          <InputRange
            filterTitle={filter.name}
            handleInputRange={(name, range) => this.changeFilters(filterName, range, filter)}
            name={filter.value_type}
            placeholder='请输入金额'
            unit={1}
          />
          <div className={filterInvalid[filterName] ? 'error' : 'hide'}>前一个值必须小于后一个值</div>
        </div>
      ),
      date: (filter, key) => (
        <div key={key}>
          <InputDatePicker
            filterTitle={filter.name}
            handleInputRange={(name, range) => this.changeFilters(filterName, range, filter)}
            name={filter.value_type}
            placeholder='请输入时间'
          />
          <div className={filterInvalid[filterName] ? 'error' : 'hide'}>前一个日期必须小于后一个日期</div>
        </div>
      ),
      enums: (filter, key) => (
        <div key={key}>
          <p>{filter.name}</p>
          <Select
            initSelect={0}
            selectHandler={(val) => this.changeFilters(filterName, val, filter)}
            liRange={['请选择', ...filter.enums.split(/[,||，]/g)]}
          />
        </div>
      )
    }

    return generateFilterMethod[filter.value_type] && generateFilterMethod[filter.value_type](filter, key)
  }

  render () {
    const { edgeDetailData, curEdge } = this.props
    const { relationConfig } = this.state
    const filterConfig = (relationConfig.attrs && JSON.parse(relationConfig.attrs)) || []

    let vertexes = this.getAllNodes()
    let fromCompanyName = vertexes.find((v) => v._id === curEdge.__from).name
    let toCompanyName = vertexes.find((v) => v._id === curEdge.__to).name
    let edgeDetailList = edgeDetailData.list ? edgeDetailData.list : []
    let tfootClass = 'hide'
    if (edgeDetailList.length === 0) {
      tfootClass = 'show'
    }
    let total = edgeDetailData.count || 0
    const CardBody = (
      <div className='clearfix'>
        <dl className='description-list-2 scroll-style'>
          <div>
            <dt className='double-list-label'>起点:</dt>
            <dd className='double-list-value' title='{fromCompanyName}'>{fromCompanyName}</dd>
          </div>
          <div>
            <dt className='double-list-label'>终点:</dt>
            <dd className='double-list-value' title='{toCompanyName}'>{toCompanyName}</dd>
          </div>
        </dl>
        <div className='filter-panel clearfix'>
          {
            filterConfig.map((filter, idx) => this.generateFilter(filter, idx))
          }
          <button
            className='money-flow-btn'
            onClick={this.getBelongBankList}>查询</button>
        </div>
        <h3>满足条件的{relationConfig.name}结果</h3>
        <table className='table2'>
          <thead className='thead2'>
            <tr className='tr2'>
              {filterConfig.map((filter, idx) => <td key={idx} className='td2'>{filter.name}</td>)}
            </tr>
          </thead>
          <tbody className='tbody2'>
            {edgeDetailList.map((v, i) => {
              let trClassName = i % 2 === 0 ? 'tr2 odd' : 'tr2'
              return (
                <tr key={v._id} className={trClassName}>
                  {filterConfig.map((filter, idx) => <td key={idx} className='td2'>{v[filter.source_name_cn]}</td>)}
                </tr>
              )
            })}
          </tbody>
          <tfoot className={tfootClass}>
            <tr>
              <td className='td2' colSpan='4'>没有符合条件的记录</td>
            </tr>
          </tfoot>

        </table>
        <div className='pagination-container'>
          <Pagination
            showTotal={(total) => `共 ${total} 条`}
            total={total}
            current={this.state.current}
            pageSize={this.state.limit}
            onChange={this.changePage}
          />
        </div>
      </div>
    )

    let CardHeader = (
      <div>
        <h2 className='name'>{relationConfig.name}详情</h2>
      </div>
    )

    return (
      <Layout
        cardHeader={CardHeader}
        cardBody={CardBody}
        name={relationConfig.name + '详情'}
        customClass='belong-bank-detail-card' />
    )
  }
}

BelongBankDetailCard.propTypes = {
  edgeDetailData: PropTypes.PropTypes.object,
  curEdge: PropTypes.object,
  originChartData: PropTypes.object,
  expandChartData: PropTypes.object,
  guaranteeClusterChartData: PropTypes.object,
  belongBankRelation: PropTypes.array,
  filterEdgeDetail: PropTypes.func
}

const mapDispatchToProps = {
  filterEdgeDetail
}

const mapStateToProps = (state) => {
  return {
    edgeDetailData: state.briefData,
    curEdge: state.curEdge,
    originChartData: state.originChartData,
    expandChartData: state.expandChartData,
    guaranteeClusterChartData: state.guaranteeClusterChartData,
    belongBankRelation: state.belongBankRelation
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BelongBankDetailCard)
