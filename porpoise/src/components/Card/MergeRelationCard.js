import React from 'react'
import { connect } from 'react-redux'
import Layout from './Layout'
import PropTypes from 'prop-types'
import { setMergeChartData, setCurEdge, setCurNode } from 'actions/Chart'
import { selectMergeData, toggleCardType, setRelationSrcName } from 'actions/Card'
import { mergeEdgeMap } from 'graph.config'

/**
 * 群体关系卡片
 */
class MergeRelationCard extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor (props) {
    super(props)

    this.relationTypeMap = {}
  }

  shouldComponentUpdate (nextProps) {
    if (!nextProps.curNode._id || !nextProps.curNode._id.includes('mergeNode')) {
      this.props.toggleCardType('Company')
      return false
    }
    return true
  }

  /**
   * render
   * @return {Object} jsx
   */
  render () {
    const type = this.props.curNode._id.split('_mergeNode')[0]
    const cardProps = {
      originChartData: this.props.originChartData,
      mergeChartData: this.props.mergeChartData,
      setMergeChartData: this.props.setMergeChartData,
      selectMergeData: this.props.selectMergeData,
      curNode: this.props.curNode,
      toggleCardType: this.props.toggleCardType,
      setCurEdge: this.props.setCurEdge,
      setCurNode: this.props.setCurNode,
      setRelationSrcName: this.props.setRelationSrcName,
      selectedMergeData: this.props.selectedMergeData,
      type: type
    }

    const CardBody = (
      <div>
        <RelationTable {...cardProps} />
      </div>
    )
    return (
      <Layout
        cardBody={CardBody}
        name={mergeEdgeMap[type].tableTitle}
        customClass='merge-relation'
      />
    )
  }
}

MergeRelationCard.propTypes = {
  curNode: PropTypes.object,
  originChartData: PropTypes.object,
  mergeChartData: PropTypes.object,
  selectedMergeData: PropTypes.object,
  setMergeChartData: PropTypes.func,
  selectMergeData: PropTypes.func,
  toggleCardType: PropTypes.func,
  setCurEdge: PropTypes.func,
  setRelationSrcName: PropTypes.func,
  setCurNode: PropTypes.func
}

// 群体关系表格
class RelationTable extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor (props) {
    super(props)
    this.state = {
      visibleLabelY: 0
    }

    const relationTheadObj = {
      thead: ['关联方', '关联关系', '操作', '查看'],
      value: ['name', 'label', 'operation', 'detail']
    }
    this.theadMap = {
      invest: {
        thead: ['投资对象', '投资详情', '操作'],
        value: ['name', 'label', 'operation']
      },
      shareholder: {
        thead: ['股东名称', '投资详情', '操作'],
        value: ['name', 'label', 'operation']
      },
      officer: {
        thead: ['姓名', '任职详情', '操作'],
        value: ['name', 'label', 'operation']
      },
      bid: {
        thead: ['标书名称', '关联关系', '操作'],
        value: ['name', 'label', 'operation']
      },
      sue: {
        thead: ['案件编号', '关联关系', '操作'],
        value: ['name', 'label', 'operation']
      },
      guarantee: relationTheadObj,
      money_flow: relationTheadObj,
      concert: {
        thead: ['一致行动人', '一致行动对象', '操作'],
        value: ['name', 'target', 'operation']
      },
      out_control_shareholder: {
        thead: ['控股对象名称', '操作'],
        value: ['name', 'operation']
      },
      out_actual_controller: {
        thead: ['实际控制对象名称', '操作'],
        value: ['name', 'operation']
      },
      in_party_bid: relationTheadObj,
      out_party_bid: relationTheadObj,
      out_sue_relate: relationTheadObj,
      in_sue_relate: relationTheadObj,
      plaintiff_relate: relationTheadObj,
      defendant_relate: relationTheadObj
    }
    this.centerNodeId = this.getCenterNodeId(this.props.curNode)  // 当前点击的聚合节点所连的中心节点id

    this.getTargetName = this.getTargetName.bind(this)
    this.removeMergeNode = this.removeMergeNode.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.curNode !== nextProps.curNode) {
      this.centerNodeId = this.getCenterNodeId(nextProps.curNode)
    }
  }

  /**
   * 根据 edge 确定被聚合节点名称
   * @param {Object} edge edge
   * @return {String} target name
   */
  getTargetName (edge) {
    const nodeId = this.getLinkedNodeId(edge)
    const target = this.props.originChartData.vertexes.find((vertex) => vertex._id === nodeId) || {}
    if (edge.type === 'sue') {
      return target.case_id
    }
    return target.name
  }

  getLinkedNodeId (edge) {
    return edge._from === this.centerNodeId ? edge._to : edge._from
  }

  getCenterNodeId (curNode) {
    return this.props.mergeChartData.edges.find((edge) => edge._to === curNode._id)._from
  }

  /**
   * 选择放出某条边
   * @param {Object} e event
   * @param {Object} edge 点击的要切换为图标的边
   */
  selectLink (e, edge) {
    const { originChartData, mergeChartData } = this.props
    // 增加相应的点和边
    const selectMergeData = { vertexes: [], edges: [] }
    edge.source = edge._from
    edge.target = edge._to
    edge.hasShown = true
    selectMergeData.edges.push(edge)
    const nodeId = this.getLinkedNodeId(edge)
    selectMergeData.vertexes.push(originChartData.vertexes.find((vertex) => vertex._id === nodeId))

    // 一致行动关系中，把target点，及相连的边加进去
    if (edge.type === 'concert' && edge.rule !== 'Rule3') {
      const concertData = this.addConcertData(edge)
      selectMergeData.edges.push(...concertData.edges)
      selectMergeData.vertexes.push(...concertData.vertexes)
    }

    // 群体节点计数减1
    const type = edge.type
    const mergeLink = mergeChartData.edges.find((edge) => {
      return edge._id.includes(`${type}_mergeEdge`) && edge._from === this.centerNodeId
    })
    mergeChartData.vertexes.forEach((vertex) => {
      if (vertex._id === mergeLink._to) {
        vertex.name = vertex.name.replace(vertex.mergeNum, vertex.mergeNum - 1)
        vertex.mergeNum-- // 直接通过引用改变 mergeChartData 对象中的值
        if (!vertex.mergeNum) {
          this.removeMergeNode(vertex, mergeChartData)
        }
        if (vertex.mergedVertexIds) {
          vertex.mergedVertexIds = vertex.mergedVertexIds.filter((id) => id !== edge._to)
        }
      }
    })
    mergeChartData.edges.forEach((e) => {
      if (e.mergedEdgeIds) {
        e.mergedEdgeIds = e.mergedEdgeIds.filter((id) => id !== edge._id)
      }
    })
    this.props.selectMergeData(selectMergeData)
  }

  addConcertData (edge) {
    const vertexes = this.props.originChartData.vertexes.filter((v) => edge.concertTarget === v._id)
    const edges = this.props.originChartData.edges.filter((l) => l._to === edge.concertTarget &&
      l.type === 'concert' && [edge._from, edge._to].includes(l._from))
    return {
      vertexes,
      edges
    }
  }

  removeMergeNode (vertex, mergeChartData) {
    this.props.setCurNode(this.props.originChartData.vertexes.find((vertex) => vertex._id === this.centerNodeId))
    this.props.toggleCardType('Company')
    const removeIds = mergeChartData.vertexes.filter((vertex) => !vertex.mergeNum).map((vertex) => vertex._id)
    mergeChartData.vertexes = mergeChartData.vertexes.filter((vertex) => !removeIds.includes(vertex._id))
    mergeChartData.edges = mergeChartData.edges.filter((edge) => !removeIds.includes(edge._from) && !removeIds.includes(edge._to))
    this.props.setMergeChartData(mergeChartData.vertexes, mergeChartData.edges)
  }

  showRecordDetail (e, edge) {
    this.props.setCurEdge(edge)
    let type = edge._type
    if (['plaintiff_relate', 'defendant_relate'].includes(type)) {
      type = 'sue_relate'
    }
    this.props.toggleCardType(type)
  }

  showDetail (e, edge) {
    const companyId = this.getTargetId(edge)
    if (!companyId.includes('Company')) {
      return
    }
    this.props.setRelationSrcName(this.props.originChartData.vertexes.find((vertex) => vertex._id === companyId).name)
    this.props.toggleCardType('Company')
  }

  getLabel (edge) {
    if (edge.type === 'guarantee') {
      return edge._to === this.centerNodeId ? '被担保' : '担保'
    }
    if (edge.type === 'money_flow') {
      return edge._to === this.centerNodeId ? '转入' : '转出'
    }
    if (edge.type === 'party_bid') {
      return edge._to === this.centerNodeId ? '乙方' : '甲方'
    }
    if (edge.type === 'sue_relate') {
      return edge._to === this.centerNodeId ? '被起诉' : '起诉'
    }
    return edge.label
  }

  getConcertTarget (edge) {
    if (edge.type !== 'concert') return

    if (edge.concertTarget === 'all') return '全部企业'
    return this.props.originChartData.vertexes.find((vertex) => vertex._id === edge.concertTarget).name
  }

  getTargetId (edge) {
    return edge._from === this.centerNodeId ? edge._to : edge._from
  }

  hoverLabel (e, td) {
    this.setState({
      visibleLabelY: e.nativeEvent.clientY + 10
    })
  }

  getMergedEdges () {
    const { curNode, mergeChartData, originChartData } = this.props
    const mergeEdge = mergeChartData.edges.find((e) => e._to === curNode._id)
    let mergedEdges = []
    if (mergeEdge && mergeEdge.mergedEdgeIds) { // 重构后聚合边 id 会放在 mergeChartData.edges 中
      mergedEdges = originChartData.edges.filter((e) => mergeEdge.mergedEdgeIds.includes(e._id))
    } else {  // 兼容以前的写法
      mergedEdges = originChartData.edges.filter((edge) => {
        // 已经被挑选显示在图中的不再显示在列表中
        if (this.props.selectedMergeData.edges.find((l) => l._id === edge._id)) return false
        // 一致行动关系只显示有rule的边
        if (edge.type === 'concert' && !edge.rule) return false
        return edge.type === this.props.type && [edge._from, edge._to].includes(this.centerNodeId)
      })
    }

    return mergedEdges
  }

  /**
   * render
   * @return {Object} jsx
   */
  render () {
    const tableObj = this.theadMap[this.props.type]
    const Thead = tableObj.thead.map((td, idx) => (
      <div className='th' key={td}>
        <div className={tableObj.value[idx]}>{td}</div>
      </div>
    ))
    const mergedEdges = this.getMergedEdges()
    const Tbody = mergedEdges.map((edge) => (
      <div className='tr' key={edge._id}>
        {
          tableObj.value.map((td) => {
            if (td === 'name') {
              return (
                <div className='td' key={td}>
                  <div className={td}><a className={this.getTargetId(edge).includes('Company') ? '' : 'invalid'}
                    onClick={(e) => this.showDetail(e, edge)}
                    onMouseOver={(e) => this.hoverLabel(e, td)}>{this.getTargetName(edge) || '--'}</a></div>
                  {
                    this.getTargetName(edge)
                    ? <div className={`${td}-hover`}
                      style={{ top: this.state.visibleLabelY }}>{this.getTargetName(edge)}</div> : null
                  }
                </div>
              )
            }
            if (td === 'label') {
              return (
                <div className='td' key={td}>
                  <div className={td}
                    onMouseOver={(e) => this.hoverLabel(e, td)}>{this.getLabel(edge)}</div>
                  <div className={`${td}-hover`}
                    style={{ top: this.state.visibleLabelY }}>{this.getLabel(edge)}</div>
                </div>
              )
            }
            if (td === 'operation') {
              return (
                <div className='td' key={td}>
                  <div className={td}><a onClick={(e) => this.selectLink(e, edge)}>切换为图标</a></div>
                </div>
              )
            }
            if (td === 'detail') {
              return (
                <div className='td' key={td}>
                  <div className={td}><a onClick={(e) => this.showRecordDetail(e, edge)}>记录详情</a></div>
                </div>
              )
            }
            if (td === 'target') {
              return (
                <div className='td' key={td}>
                  <div className={td}>{this.getConcertTarget(edge)}</div>
                  <div className={`${td}-hover`}>{this.getConcertTarget(edge)}</div>
                </div>
              )
            }
            return <div className='td' key={td} />
          })
        }
      </div>
    ))

    return (
      <div className={`${this.props.type} table`}>
        <div className='thead'>
          <div className='tr'>
            { Thead }
          </div>
        </div>
        <div className='tbody scroll-style'>
          { Tbody }
        </div>
      </div>
    )
  }
}

RelationTable.propTypes = {
  type: PropTypes.string,
  originChartData: PropTypes.object,
  mergeChartData: PropTypes.object,
  curNode: PropTypes.object,
  selectMergeData: PropTypes.func,
  toggleCardType: PropTypes.func,
  setMergeChartData: PropTypes.func,
  setCurEdge: PropTypes.func,
  setRelationSrcName: PropTypes.func,
  setCurNode: PropTypes.func,
  selectedMergeData: PropTypes.object
}

/**
 * map state to props
 * @param {Object} state state
 * @return {Object} state object
 */
const mapStateToProps = function (state) {
  return {
    curNode: state.curNode,
    originChartData: state.originChartData,
    selectedMergeData: state.selectedMergeData,
    mergeChartData: state.mergeChartData
  }
}

/**
 * map dispatch to props
 * @param {Object} dispatch dispatch
 * @return {Object} action
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setMergeChartData: (vertexes, edges) => dispatch(setMergeChartData(vertexes, edges)),
    selectMergeData: (chartData) => dispatch(selectMergeData(chartData)),
    toggleCardType: (cardType) => dispatch(toggleCardType(cardType)),
    setCurEdge: (edge) => dispatch(setCurEdge(edge)),
    setCurNode: (vertex) => dispatch(setCurNode(vertex)),
    setRelationSrcName: (companyName) => dispatch(setRelationSrcName(companyName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MergeRelationCard)
