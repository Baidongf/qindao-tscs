import React from 'react'
import { connect } from 'react-redux'
import CardInput from './CardInput'
import Select from '../partials/Select'
import { toggleCardType, findRelation, findGuarantee, setRelationSrcName } from '../../actions/Card'
import Layout from './Layout'
import { findRelationEdges } from 'graph.config'
import PropTypes from 'prop-types'

const MAX_PASS_BY_NUM = 0  // 暂时不支持途径公司
const TRACE_DEPTH_RANGE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const INIT_TRACE_DEPTH = 10

class RelationCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      companyNames: {
        src: this.props.relationSrcName || '',
        dst: ''
      },
      passByInput: [],    // 途径输入框
      traceDepth: INIT_TRACE_DEPTH,      // 深度
      clearOption: false  // 是否要清空内容
    }
    this.passByInputKey = 0
    const query = this.props.reduxLocation.query
    this.initCardType = query.type || query.lp_type

    this.addPassByHandler = this.addPassByHandler.bind(this)
    this.delPassByHandler = this.delPassByHandler.bind(this)
    this.selectHandler = this.selectHandler.bind(this)
    this.inputHandler = this.inputHandler.bind(this)
    this.clearOptions = this.clearOptions.bind(this)
    this.search = this.search.bind(this)
  }

  componentWillMount () {
    const params = JSON.parse(sessionStorage.getItem(`find${this.initCardType}Params`))
    if (this.initCardType && params) {
      this.state.companyNames = params.companyNames
      this.state.traceDepth = params.traceDepth
    }
    if (this.props.relationSrcName) {
      this.state.companyNames.src = this.props.relationSrcName
    } else {
      this.props.setRelationSrcName(this.state.companyNames.src || this.props.initCompanyName)
    }
  }

  componentWillReceiveProps (nextProps, nextState) {
    if (this.state.companyNames.src !== nextProps.relationSrcName && nextProps.relationSrcName.length) {
      const companyNames = this.state.companyNames
      companyNames.src = nextProps.relationSrcName
      this.setState({ companyNames })
    }
  }

  componentDidMount () {
    // 只有当前无图数据且 type 为 Relation/Guarantee 时才会自动搜索
    if ((this.initCardType === 'Relation' || this.initCardType === 'Guarantee') &&
      !this.props.originChartData.vertexes.length) {
      this.search()
    }
  }

  /**
   * 增加途径输入框
   */
  addPassByHandler () {
    let cardInputTag = <CardInput isSrc='false' isDst='false' operationBtnHandler={this.delPassByHandler}
      value={this.state.companyNames['pass-' + this.passByInputKey]}
      key={'pass-' + this.passByInputKey}
      inputKey={'pass-' + this.passByInputKey}
      inputHandler={this.inputHandler}
      placeholder='经 请输入途径公司名称' />

    if (this.state.passByInput.length === MAX_PASS_BY_NUM) return
    this.setState({ passByInput: this.state.passByInput.concat(cardInputTag) })
    this.passByInputKey++
  }

  /**
   * 删除途径输入框
   */
  delPassByHandler (key) {
    let passByInputList = this.state.passByInput.filter((i) => i.key !== key)
    delete (this.state.companyNames[key])
    this.setState({
      passByInput: passByInputList,
      companyNames: this.state.companyNames
    })
  }

  /**
   * 路径输入框处理函数
   * param {string} val: 输入的值
   * param {string} key: 输入框 index, 起点: srx 终点: dst 途经点: pass-0,1,2...
   */
  inputHandler (val, key) {
    const companyNames = this.state.companyNames
    companyNames[key] = val
    this.setState({ companyNames })
  }

  /**
   * 深度选择框处理函数
   * params {depends on liRange} val: 选择的值
   */
  selectHandler (val) {
    this.setState({ traceDepth: val })
  }

  /**
   * 清空输入框、选择框内容
   */
  clearOptions () {
    this.setState({
      passByInput: [],
      traceDepth: INIT_TRACE_DEPTH,
      clearOption: true,
      companyNames: {
        src: '',
        dst: ''
      }
    })
  }

  /**
   * 开始查询
   */
  search () {
    if (!this.isSearchValid) return

    let companyNames = this.state.companyNames
    let passByKeys = Object.keys(companyNames)
      .filter(v => v !== 'src' && v !== 'dst')
      .sort((a, b) => {
        return a.split('pass-')[1] - b.split('pass-')[1]
      })
    let routeKeys = ['src'].concat(...passByKeys, 'dst')
    let sortedCompanyNames = routeKeys.map(v => companyNames[v])
    sessionStorage.setItem(`find${this.props.cardType}Params`, JSON.stringify({
      companyNames: this.state.companyNames,
      traceDepth: this.state.traceDepth
    }))
    this.props.setRelationSrcName(this.state.companyNames.src)
    const { cardType } = this.props

    // 设置要开启的边
    const filterOptions = JSON.parse(JSON.stringify(this.props.filterOptions))
    filterOptions.edges.forEach((edge) => {
      if (findRelationEdges.includes(edge.class)) {
        edge.visible = true
      }
    })

    // 如果当前是找关系页面，直接打开；如果是图谱详情页，新开一页
    if (this.initCardType === cardType) {
      if (cardType === 'Relation') {
        this.props.findRelation(sortedCompanyNames, this.state.traceDepth, filterOptions)
      } else if (cardType === 'Guarantee') {
        this.props.findGuarantee(sortedCompanyNames, this.state.traceDepth)
      }
    } else {
      window.open(`http://${location.host}${location.pathname}#/graph/?company=${this.props.relationSrcName}&type=${cardType}`, '_blank')
    }
  }

  render () {
    const { cardType } = this.props
    let clearOption = this.state.clearOption
    const { companyNames } = this.state
    this.state.clearOption = false
    this.isSearchValid = true
    for (let key in companyNames) {
      if (companyNames[key].length) continue
      this.isSearchValid = false
      break
    }

    let CardHeader = (
      <div>
        <div className='card-title clearfix' onClick={() => this.props.toggleCardType('Company')}>
          <i className='back' />
          <h2 className='company-detail-title'>企业详情</h2>
        </div>
        <div className='switch-tab'>
          <span className={cardType === 'Relation' ? null : 'inactive'}
            onClick={() => this.props.toggleCardType('Relation')}>找关系</span>
          {/* <span className={cardType === 'Guarantee' ? null : 'inactive'}
                        onClick={() => this.props.toggleCardType('Guarantee')}>担保环</span> */}
        </div>
      </div>
    )

    let CardBody = (
      <div className='clearfix'>
        <div className='card-input-container'>
          <CardInput isSrc='true'
            value={companyNames.src}
            inputHandler={this.inputHandler}
            inputKey='src'
            clearOption={clearOption}
            placeholder='起 请输入公司名称' />
          {this.state.passByInput}
          <CardInput isDst='true'
            value={companyNames.dst}
            operationBtnHandler={this.addPassByHandler}
            inputHandler={this.inputHandler}
            inputKey='dst'
            clearOption={clearOption}
            placeholder='终 请输入公司名称' />
        </div>
        <div className='trace-depth'>
          <label>深度</label>
          <Select liRange={TRACE_DEPTH_RANGE} selectHandler={this.selectHandler}
            initSelect={TRACE_DEPTH_RANGE.indexOf(this.state.traceDepth)}
            clearOption={clearOption} />
          <span>深度层数影响关联是否存在</span>
        </div>
        <a className={this.isSearchValid ? 'search-btn' : 'search-btn invalid-btn'}
          onClick={this.search}>查询
                </a>
        <a className='clear-btn' onClick={this.clearOptions}>清空内容</a>
      </div>
    )

    return (
      <Layout
        cardHeader={CardHeader}
        cardBody={CardBody}
        name={'找关系'}
        customClass='relation-card' />
    )
  }
}

RelationCard.propTypes = {
  cardType: PropTypes.string,
  relationSrcName: PropTypes.string,
  filterOptions: PropTypes.object,
  reduxLocation: PropTypes.object,
  originChartData: PropTypes.object,
  toggleCardType: PropTypes.func,
  findRelation: PropTypes.func,
  findGuarantee: PropTypes.func,
  setRelationSrcName: PropTypes.func,
  initCompanyName: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    cardType: state.cardType,
    relationSrcName: state.relationSrcName,
    filterOptions: state.FilterOptions,
    reduxLocation: state.location,
    originChartData: state.originChartData,
    initCompanyName: state.initCompanyName
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleCardType: (cardType) => dispatch(toggleCardType(cardType)),
    findRelation: (companyNames, traceDepth, options) => dispatch(findRelation(companyNames, traceDepth, options)),
    findGuarantee: (companyNames, traceDepth) => dispatch(findGuarantee(companyNames, traceDepth)),
    setRelationSrcName: companyName => dispatch(setRelationSrcName(companyName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RelationCard)
