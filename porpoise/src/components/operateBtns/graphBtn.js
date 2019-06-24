/**
 * @desc: { 图谱切换按钮 }
 * @author: zhengyiqiu
 * @Create Date: 2018-12-18 17:34:46
 * @Last Modified by: zhengyiqiu
 * @Last Modified time: 2019-02-27 21:44:38
 */

import React from 'react'
import Btn from './btn'
import { connect } from 'react-redux'
import { setGraphType } from 'actions/InitOperateBtn'

import GridImg from './assets/grid.svg'
import GridImgDeep from './assets/grid_deep.svg'
import GridImgHighlight from './assets/grid_highlight.svg'
import GridImgHighlightDeep from './assets/grid_highlight_deep.svg'

import BubbleImg from './assets/bubble.svg'
import BubbleImgDeep from './assets/bubble_deep.svg'
import BubbleImgHighlight from './assets/bubble_highlight.svg'
import BubbleImgHighlightDeep from './assets/bubble_highlight_deep.svg'

class GraphTypeBtn extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isShowPopover: false,
      showBubbleImg: BubbleImg,
      showGridImg: GridImg,
    }

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.turnGrid = this.turnGrid.bind(this)
    this.turnBubble = this.turnBubble.bind(this)
    this.onGridImg = this.onGridImg.bind(this)
    this.onBubbleImg = this.onBubbleImg.bind(this)
  }

  turnGrid () {
    window.localStorage.setItem('graphType', 'grid')
    this.props.setGraphType('grid')
  }

  turnBubble () {
    window.localStorage.setItem('graphType', 'bubble')
    this.props.setGraphType('bubble')
  }

  onMouseEnter () {
    this.setState({
      isShowPopover: true
    })
  }

  onMouseLeave () {
    this.setState({
      isShowPopover: false
    })
  }

  onGridImg (isHighlight) {
    this.setState({
      showGridImg: isHighlight ? GridImg : GridImgHighlight
    })
  }

  onBubbleImg (isHighlight) {
    this.setState({
      showBubbleImg: isHighlight ? BubbleImg : BubbleImgHighlight
    })
  }

  getSelectPopover () {
    return (
      <div className='btn-desc-detail graph-popover'>
        <ul className='btn-desc-detail-list'>
          <li className='btn-desc-detail-item' onMouseOver={() => { this.onGridImg(false) }} onMouseOut={() => { this.onGridImg(true) }} onClick={this.turnGrid}>
            <img className='popover-img' src={this.state.showGridImg} />
            网状图
          </li>
          <li className='btn-desc-detail-item' onMouseOver={() => { this.onBubbleImg(false) }} onMouseOut={() => { this.onBubbleImg(true) }} onClick={this.turnBubble}>
            <img className='popover-img' src={this.state.showBubbleImg} />
            气泡图
          </li>
        </ul>
      </div>
    )
  }

  _getImg = () => {
    let gridSelectPopover = null
    let img
    let imgHighlight

    if (this.props.theme === 'light') {
      if (this.props.graphType === 'grid') {
        img = GridImg
        imgHighlight = GridImgHighlight
      } else {
        img = BubbleImg
        imgHighlight = BubbleImgHighlight
      }
    } else {
      if (this.props.graphType === 'grid') {
        img = GridImgDeep
        imgHighlight = GridImgHighlightDeep
      } else {
        img = BubbleImgDeep
        imgHighlight = BubbleImgHighlightDeep
      }
    }
    if (this.state.isShowPopover) {
      gridSelectPopover = this.getSelectPopover()
    }
    return { gridSelectPopover, img, imgHighlight }
  }

  render () {
    let { gridSelectPopover, img, imgHighlight } = this._getImg()

    return (
      <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} className='operate-btn-popover-box'>
        <div className='operate-btn-box'>
          <Btn img={img} imgHighlight={imgHighlight} isShowPopover={this.state.isShowPopover} />
        </div>
        {gridSelectPopover}
      </div>
    )
  }
}

const mapState = (state) => ({
  graphType: state.setGraphType,
  theme: state.setTheme
})

const mapDispatch = (dispatch) => {
  return {
    setGraphType: (v) => {
      dispatch(setGraphType(v))
    }
  }
}

export default connect(mapState, mapDispatch)(GraphTypeBtn)
