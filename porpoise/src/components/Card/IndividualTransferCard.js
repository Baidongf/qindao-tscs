import React from 'react'
import { connect } from 'react-redux'
import Layout from './Layout'
import InputRange from './partials/InputRange'
import InputDatePicker from './partials/InputDatePicker'
import Checkbox from 'components/partials/Checkbox'
import { getDetailList } from 'actions/Card'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import PropTypes from 'prop-types'

const serviceStatus = ['已转发', '待认证', '已付款', '已轧差', '已清算', '已成功', '待处理', '已处理', '已撤销', '已拒绝', '已确认']
const pageCount = 5
const offset = 0
const initPostBody = {          // postBody 默认结构
  'type': 'personal_money_flow',
  'offset': offset,
  'count': pageCount,
  'conditionList': []
}

/** 个人转账 */
class IndividualTransfer extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor (props) {
    super(props)

    this.state = {
      postBody: Object.assign({}, initPostBody)
    }

    this.paginate = this.paginate.bind(this)
    this.getDetailList = this.getDetailList.bind(this)
    this.getComsumerNoById = this.getComsumerNoById.bind(this)
  }

  /**
   * 分页
   * @param {Number} pageIdx 页数
   */
  paginate (pageIdx) {
    this.state.postBody.offset = pageIdx > 0 ? (pageIdx - 1) * this.pageCount : 0
    this.props.getDetailList(this.state.postBody)
  }

  getDetailList (postBody) {
    this.state.postBody = postBody
    this.props.getDetailList(this.state.postBody)
  }

  /**
   * 根据 vertex _id 获取客户
   * @param {String} id 点 _id
   * @return {Object} 客户
   */
  getComsumerNoById (id) {
    return this.props.originChartData.vertexes.find((v) => v._id === id)
  }

  /**
   * render individual transfer div
   * @return {Object} div
   */
  render () {
    const { curEdge, transferData } = this.props
    const fromNode = this.getComsumerNoById(this.props.curEdge._from)
    const toNode = this.getComsumerNoById(this.props.curEdge._to)
    const name = curEdge._to.includes('Company') ? `${fromNode.name}和行外转账的详情`
      : `${fromNode.name}和${toNode.name}间转账的详情`

    const CardBody = (
      <div>
        <TransferObject fromNode={fromNode} toNode={toNode} />
        <Filter curEdge={curEdge}
          getDetailList={this.getDetailList} />
        <Result transferData={transferData}
          curEdge={curEdge}
          paginate={this.paginate} />
      </div>
    )

    return (
      <Layout
        cardBody={CardBody}
        name={name}
        customClass='indiv-transfer-card' />
    )
  }
}

IndividualTransfer.propTypes = {
  curEdge: PropTypes.object,
  originChartData: PropTypes.object,
  transferData: PropTypes.object,
  getDetailList: PropTypes.func
}

/**
 * 转账实体
 */
class TransferObject extends React.Component {
  /**
   * render individual transfer object div
   * @return {Object} div
   */
  render () {
    const { fromNode, toNode } = this.props
    return (
      <div>
        <p><span>{fromNode.name}的客户号: </span>{fromNode.no}</p>
        <p>
          <span>{toNode._id.includes('Company') ? '对方银行: ' : `${toNode.name}的客户号: `}</span>
          {toNode._id.includes('Company') ? `${toNode.name}` : toNode.no}
        </p>
      </div>
    )
  }
}

TransferObject.propTypes = {
  fromNode: PropTypes.object,
  toNode: PropTypes.object
}

/** 筛选项 */
class Filter extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor (props) {
    super(props)

    this.state = {
      valueValid: true,
      dateValid: true
    }
    this.postBody = Object.assign({}, initPostBody)
    this.inOut = ['转入', '转出']

    this.initFilter()

    this.handleInOutChecked = this.handleInOutChecked.bind(this)
    this.handleStatusChecked = this.handleStatusChecked.bind(this)
    this.getTransferBtn = this.getTransferBtn.bind(this)
    this.handleInputRange = this.handleInputRange.bind(this)
  }

  componentWillMount () {
    if (this.props.curEdge._from && this.props.curEdge._to) {
      this.search(this.props.curEdge)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.curEdge._from !== this.props.curEdge._from || nextProps.curEdge._to !== this.props.curEdge._to) {
      this.initFilter()
      this.postBody = Object.assign({}, initPostBody)
      this.search(nextProps.curEdge)
    }
  }

  initFilter () {
    this.selectedInOut = {}
    this.selectedStatus = {}
    this.valueRange = {}
    this.dateSection = {}
    this.selectedStatusIdx = []
  }

  search (curEdge) {
    const { _from, _to } = curEdge
    this.postBody['from'] = _from
    this.postBody['to'] = _to
    if (curEdge.isTwoWay) {
      this.postBody.isTwoWay = true
    } else {
      this.postBody.isTwoWay = false
    }
    this.props.getDetailList(this.postBody)
  }

  /**
   * input handler
   * @param {String} name 输入框名称
   * @param {String} range 输入项 {min: xx, max: yy}
   */
  handleInputRange (name, range) {
    if (name === 'value') { // 转账金额
      this.valueRange = range
    } else if (name === 'date') { // 时间区间
      this.dateSection = range
    }
    this.setConditionList()
  }

  setConditionList () {
    this.postBody.conditionList = []
    if (Object.keys(this.valueRange).length) {
      this.postBody.conditionList.push({
        conditionType: 'range',
        field: 'value',
        sort: 'desc',
        min: this.valueRange.min,
        max: this.valueRange.max
      })
    }
    if (Object.keys(this.dateSection).length) {
      this.postBody.conditionList.push({
        conditionType: 'range',
        field: 'date',
        sort: 'desc',
        min: this.dateSection.min,
        max: this.dateSection.max
      })
    }
    if (this.selectedStatusIdx.length) {
      this.postBody.conditionList.push({
        conditionType: 'list',
        status: this.selectedStatusIdx
      })
    }
  }

  /**
   * 获取转账数据
   */
  getTransferBtn () {
    this.setState({ valueValid: true, dateValid: true })
    if (this.valueRange.min && this.valueRange.max && this.valueRange.min > this.valueRange.max) {
      this.setState({ valueValid: false })
      return false
    }
    if (this.dateSection.min && this.dateSection.max && this.dateSection.min > this.dateSection.max) {
      this.setState({ dateValid: false })
      return false
    }
    this.props.getDetailList(this.postBody)
  }

  /**
   * checkbox handler
   * @param {String} name name of checkbox
   * @param {Boolean} isChecked checked status
   */
  handleInOutChecked (name, isChecked) {
    this.selectedInOut[name] = isChecked
    let { _from, _to } = this.props.curEdge
    this.postBody.isTwoWay = false
    this.postBody.from = _from
    this.postBody.to = _to
    if (this.selectedInOut['转入'] && this.selectedInOut['转出']) {
      this.postBody.isTwoWay = true
    } else if (this.selectedInOut['转入']) {
      this.postBody.from = _to
      this.postBody.to = _from
    }
  }

  /**
   * checkbox handler
   * @param {String} name name of checkbox
   * @param {Boolean} isChecked checked status
   */
  handleStatusChecked (name, isChecked) {
    this.selectedStatus[name] = isChecked
    this.selectedStatusIdx = []
    Object.keys(this.selectedStatus).filter((name) => this.selectedStatus[name]).forEach((name) => {
      this.selectedStatusIdx.push(serviceStatus.indexOf(name) + 1)
    })
    this.setConditionList()
  }

  /**
   * render filter div
   * @return {Object} div
   */
  render () {
    const InOut = (
      <div>
        <p>转入/转出</p>
        {this.inOut.map((item) => (
          <Checkbox
            label={item}
            name={item}
            key={item}
            handleChecked={this.handleInOutChecked}
            isChecked={this.selectedInOut[item]}
          />
        ))}
      </div>
    )
    const ServiceStatus = (
      <div>
        <p>业务状态</p>
        {serviceStatus.map((item) => (
          <Checkbox
            label={item}
            name={item}
            key={item}
            handleChecked={this.handleStatusChecked}
            isChecked={this.selectedStatus[item]}
          />
        ))}
      </div>
    )
    return (
      <div className='filter-panel clearfix'>
        <InputRange
          filterTitle='转账金额(元)'
          handleInputRange={this.handleInputRange}
          name='value'
          placeholder='请输入金额'
          unit={1}
          initRange={{ min: this.valueRange.min || '', max: this.valueRange.max || '' }}
        />
        <div className={this.state.valueValid ? 'hide' : 'error'}>前一个值必须小于后一个值</div>
        {InOut}
        {this.props.curEdge._to.includes('Company') ? ServiceStatus : null}
        <InputDatePicker
          filterTitle='转账时间区间'
          handleInputRange={this.handleInputRange}
          name='date'
          placeholder='请输入时间'
          initRange={{ min: this.dateSection.min || '', max: this.dateSection.max || '' }}
        />
        <div className={this.state.dateValid ? 'hide' : 'error'}>前一个日期必须小于后一个日期</div>
        <button
          className='search-button btn'
          onClick={this.getTransferBtn}>查询</button>
      </div>
    )
  }
}

Filter.propTypes = {
  curEdge: PropTypes.object,
  getDetailList: PropTypes.func
}

/**
 * 筛选结果
 */
class Result extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor(props) {
    super(props)

    this.resultTable = {
      'p2p': {
        '转账日期': 'date',
        '转账金额（元）': 'value',
        '转入/转出': 'inOutType'
      },
      'p2c': {
        '转账日期': 'date',
        '转账金额（元）': 'value',
        '转入/转出': 'inOutType',
        '业务状态': 'serviceStatus'
      }
    }
    this.pageSize = 5
    this.state = {
      current: 1
    }

    this.changePage = this.changePage.bind(this)
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.transferData === this.props.transferData) {
      return false
    } else {
      return true
    }
  }

  /**
   * 进行分页
   * @param {Number} current 当前页
   * @param {Number} pageSize 页面条数
   */
  changePage (current, pageSize) {
    console.log(current, pageSize)
    this.setState({ current })
    this.props.paginate(current)
  }

  generateResult (transferList) {
    transferList.forEach((transferItem) => {
      if (transferItem.status !== undefined) {
        transferItem.serviceStatus = serviceStatus[transferItem.status - 1]
      }
      if (transferItem._from === this.props.curEdge._from) {
        transferItem.inOutType = '转出'
      } else if (transferItem._from === this.props.curEdge._to) {
        transferItem.inOutType = '转入'
      }
    })
  }

  /**
   * render result
   * @return {Object} result div
   */
  render () {
    const transferList = this.props.transferData.list || []
    const total = this.props.transferData.total
    const resultType = transferList[0] && transferList[0]._to.includes('Company') ? 'p2c' : 'p2p'
    this.generateResult(transferList)
    let tfootClass = 'hide'
    if (transferList.length === 0) {
      tfootClass = 'show'
    }
    return (
      <div className='clearfix'>
        <h3>满足条件的转账结果</h3>
        <table className='table2'>
          <thead className='thead2'>
            <tr className='tr2'>
              {Object.keys(this.resultTable[resultType]).map((v) => (
                <td className='td2' key={v}>{v}</td>
              ))}
            </tr>
          </thead>
          <tbody className='tbody2'>
            {transferList.map((v, i) => {
              let trClassName = i % 2 === 0 ? 'tr2 odd' : 'tr2'
              return (
                <tr key={v._id} className={trClassName}>
                  {Object.values(this.resultTable[resultType]).map((result, idx) => (
                    <td className='td2' key={result}>{v[result]}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
          <tfoot className={tfootClass}>
            <tr>
              <td className='td2' colSpan={Object.keys(this.resultTable[resultType]).length}>没有符合条件的记录</td>
            </tr>
          </tfoot>
        </table>
        <div className='pagination-container'>
          <Pagination
            showTotal={(total) => `共 ${total} 条`}
            total={total}
            current={this.state.current}
            pageSize={this.pageSize}
            onChange={this.changePage}
          />
        </div>
      </div>
    )
  }
}

Result.propTypes = {
  transferData: PropTypes.object,
  curEdge: PropTypes.object,
  paginate: PropTypes.func
}

/**
 * map state to props
 * @param {Object} state state
 * @return {Object} state
 */
const mapStateToProps = function (state) {
  return {
    transferData: state.briefData,
    curEdge: state.curEdge,
    originChartData: state.originChartData
  }
}

/**
 * map dispatch to props
 * @param {Object} dispatch dispatch
 * @return {Object} action
 */
const mapDispatchToProps = (dispatch) => {
  return {
    getDetailList: (postBody) => dispatch(getDetailList(postBody))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndividualTransfer)
