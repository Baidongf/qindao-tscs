import React from 'react'
import { connect } from 'react-redux'
import './ContextMenu.scss'
import {
  getCompanyBrief, getPersonBrief, getMergeSuggestedList, toggleCardType,
  setRelationSrcName
} from '../../actions/Card'
import { getChartData, setCurNode, expand, exportRelation, expandAll } from '../../actions/Chart'
import { caseTypeMap } from '../../card.config'

class Context extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      curNode: {}
    }
  }

  componentDidMount () {
    document.addEventListener('contextmenu', this._handleContextMenu)
    document.addEventListener('click', this._handleClick)
    document.addEventListener('scroll', this._handleScroll)
  }

  componentWillUnmount () {
    document.removeEventListener('contextmenu', this._handleContextMenu)
    document.removeEventListener('click', this._handleClick)
    document.removeEventListener('scroll', this._handleScroll)
  }

  _handleContextMenu = (event) => {
    event.preventDefault()
    let target = event.target
    // 风险：点击空白展开下一层时，拿的是以前的curNode，需要了解展开逻辑
    if (target.hasAttribute('contextMenuTarget')) {
      this.setState({
        visible: true,
        curNode: {
          _id: target.getAttribute('id'),
          _type: target.getAttribute('type'),
          name: target.getAttribute('name')
        }
      })
    } else if (target.nodeName === 'svg') {
      this.setState({
        visible: true,
        curNode: {
          _id: '',
          _type: '',
          name: ''
        }
      })
    }

    const clickX = event.clientX
    const clickY = event.clientY
    const screenW = window.innerWidth
    const screenH = window.innerHeight
    const rootW = this.root.offsetWidth
    const rootH = this.root.offsetHeight

    const right = (screenW - clickX) > rootW
    const left = !right
    const top = (screenH - clickY) > rootH
    const bottom = !top

    if (right) {
      this.root.style.left = `${clickX + 5}px`
    }

    if (left) {
      this.root.style.left = `${clickX - rootW - 5}px`
    }

    if (top) {
      this.root.style.top = `${clickY + 5}px`
    }

    if (bottom) {
      this.root.style.top = `${clickY - rootH - 5}px`
    }
  }

  _handleClick = (event) => {
    const { visible } = this.state
    const wasOutside = !(this.root.contains(event.target))
    if (!wasOutside) {
      this.props.setCurNode(this.state.curNode)
    }
    if (visible) {
      this.setState({ visible: false })
    }
  }

  _handleScroll = () => {
    const { visible } = this.state

    if (visible) this.setState({ visible: false, })
  }

  _getCompanyBrief = () => {
    let { curNode } = this.state
    const snapshot = this.props.reduxLocation.query.operation === 'snapshot' ? '&operation=snapshot' : ''
    // location.href = `http://${location.host}/graph?company=${encodeURIComponent(curNode.name)}&type=Graph${snapshot}`
    window.open(`${location.href.split('#')[0]}#/graph?company=${encodeURIComponent(curNode.name)}&type=Graph${snapshot}`)
  //  location.href = `${location.href.split('#')[0]}#/graph?company=${encodeURIComponent(curNode.name)}&type=Graph${snapshot}`
  }

  _getCompanyRelation = () => {
    let { curNode } = this.state
    this.props.setRelationSrcName(curNode.name)
    this.props.toggleCardType('Relation')
  }

  _getPersonBrief = () => {
    let { curNode } = this.state
    this.props.toggleCardType('Person')
    this.props.getPersonBrief(curNode._id)
  }

  _getMergeSuggested = () => {
    let { curNode } = this.state
    this.props.toggleCardType('Merge_suggested')
    this.props.getMergeSuggestedList(curNode._id)
  }

  _expand = () => {
    const { curNode } = this.state
    this.props.expand(curNode, this.props.filterOptions)
    if (curNode._type === 'Company') {
      this.props.getCompanyBrief(curNode.name)
    } else if (curNode._type === 'Person') {
      this._getPersonBrief()
    }
  }

  _exportRelation = () => {
    const { curNode } = this.state
    this.props.exportRelation(curNode, this.props.filterOptions)
  }

  _expandAll = () => {
    this.props.expandAll(this.state.curNode)
  }

  getContextList () {
    const { visible, curNode } = this.state
    if (!visible) return null

    let contextList = null
    if (curNode._type === 'Company') {
      contextList = (
        <ul className='context-ul'>
          <li className='context-li' onClick={this._getCompanyBrief}>查看详情</li>
          <li className='context-li' onClick={this._getCompanyRelation}>查看关系</li>
          <li className='context-li' onClick={this._expand}>展开</li>
          {/*  <li className='context-li' onClick={this._exportRelation}>导出一度关系</li>*/}
          {/* <li className='context-li' onClick={this._expandAll}>展开下一层</li> */}
        </ul>
      )
    } else if (curNode._type === 'Person') {
      contextList = (
        <ul className='context-ul'>
          <li className='context-li' onClick={this._getPersonBrief}>关联的人</li>
          <li className='context-li' onClick={this._getMergeSuggested}>疑似可融合</li>
          <li className='context-li' onClick={this._expand}>展开</li>
          {/* <li className='context-li' onClick={this._exportRelation}>导出一度关系</li>*/}
          {/* <li className='context-li' onClick={this._expandAll}>展开下一层</li> */}
        </ul>
      )
    } else if (Object.keys(caseTypeMap).includes(curNode._type)) {
      contextList = (
        <ul className='context-ul'>
          <li className='context-li' onClick={this._expand}>展开</li>
          {/*  <li className='context-li' onClick={this._exportRelation}>导出一度关系</li>*/}
          {/* <li className='context-li' onClick={this._expandAll}>展开下一层</li> */}
        </ul>
      )
    } else {
      contextList = (
        <ul className='context-ul'>
          <li className='context-li' onClick={this._expandAll}>展开下一层</li>
        </ul>
      )
    }

    return contextList
  }

  render () {
    return (
      <div ref={(ref) => {
        this.root = ref
      }} className='context-wrap'>
        {this.getContextList()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    filterOptions: state.FilterOptions,
    reduxLocation: state.location
  }
}

const mapDispatchToProps = {
  getCompanyBrief,
  getPersonBrief,
  getMergeSuggestedList,
  toggleCardType,
  getChartData,
  expand,
  setCurNode,
  setRelationSrcName,
  exportRelation,
  expandAll
}

export default connect(mapStateToProps, mapDispatchToProps)(Context)
