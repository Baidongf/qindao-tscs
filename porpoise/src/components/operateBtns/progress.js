/**
 * @desc: { 缩放倍数显示条 }
 * @author: zhengyiqiu
 * @Create Date: 2019-02-21 10:27:38
 * @Last Modified by: zhengyiqiu
 * @Last Modified time: 2019-02-28 17:20:55
 */
import React from 'react'
import { connect } from 'react-redux'
import { setZoomStatus } from 'actions/InitOperateBtn'
import * as d3 from 'd3'
import './progress.scss'

class Progress extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cursorType: 'pointer'
    }
    this.zoom = this.zoom.bind(this)
  }

  zoom(e) {
    let type = e.target.getAttribute('data-type')
    let { scale } = this.props.zoomStatus
    let setZoomStatus = this.props.setZoomStatus
    let nextScale

    if (type === '+' && scale === 2.00) return
    if (type === '-' && scale === 0.5) return

    nextScale = this._getNextScale(type, scale)
    if (scale === 1.75) {
      setZoomStatus({
        scale: nextScale,
        isMaxScale: true
      })
    } else if (scale === 0.75) {
      setZoomStatus({
        scale: nextScale,
        isMinScale: true
      })
    } else {
      setZoomStatus({
        scale: nextScale,
        isMaxScale: false,
        isMinScale: false
      })
    }
    this.dispatchD3Scale(nextScale)
  }

  _getNextScale(type, scale) {
    let nextScale
    if (type === '+') {
      if (scale < 0.5) {
        nextScale = 0.5
      } else if (scale >= 0.5 && scale < 0.75) {
        nextScale = 0.75
      } else if (scale >= 0.75 && scale < 1) {
        nextScale = 1
      } else if (scale >= 1 && scale < 1.25) {
        nextScale = 1.25
      } else if (scale >= 1.25 && scale < 1.5) {
        nextScale = 1.5
      } else if (scale >= 1.5 && scale < 1.75) {
        nextScale = 1.75
      } else if (scale >= 1.75 && scale < 2) {
        nextScale = 2
      }
    } else {
      if (scale > 0.5 && scale <= 0.75) {
        nextScale = 0.5
      } else if (scale > 0.75 && scale <= 1) {
        nextScale = 0.75
      } else if (scale > 1 && scale <= 1.25) {
        nextScale = 1
      } else if (scale > 1.25 && scale <= 1.5) {
        nextScale = 1.25
      } else if (scale > 1.5 && scale <= 1.75) {
        nextScale = 1.5
      } else if (scale > 1.75 && scale <= 2) {
        nextScale = 1.75
      } else if (scale > 2) {
        nextScale = 2
      }
    }
    return nextScale || scale
  }

  dispatchD3Scale(scale) {
    let target
    if (this.props.graphType === 'grid') {
      // target = 'canvas_zoom'
      target = 'force_zoom'
    } else {
      target = 'bubble_zoom'
    }
    if (this.props.isSingleCompany) {
      target = 'structure_zoom'
    }
    d3.select('body').dispatch(target, {
      detail: {
        scale: scale
      }
    })
  }

  // 点击滚动条切换倍数
  handleScrollClick(e) {
    let bb = e.currentTarget.getBoundingClientRect()
    let clickWidth = bb.bottom - e.clientY - e.currentTarget.clientTop
    let clickWidthScale = clickWidth / e.currentTarget.clientWidth * 2
    let { scale } = this.props.zoomStatus
    this.setState({
      cursorType: 'pointer'
    })
    if (clickWidthScale <= 0.5) {
      this.setState({
        cursorType: 'not-allowed'
      })
      if (scale === 0.5) return
      setZoomStatus({
        scale: 0.5,
        isMinScale: true,
        isMaxScale: false
      })
      clickWidthScale = 0.5
    } else if (clickWidthScale > 1.85) {
      if (scale === 2) return
      setZoomStatus({
        scale: 2,
        isMinScale: false,
        isMaxScale: true
      })
      clickWidthScale = 2
    } else {
      setZoomStatus({
        scale: clickWidthScale,
        isMinScale: false,
        isMaxScale: false
      })
    }
    this.dispatchD3Scale(clickWidthScale)
  }

  render() {
    let { scaleWidth, isMaxScale, isMinScale, scale } = this.props.zoomStatus
    return (
      <div className='progress'>
        <button data-type='+' style={{ 'cursor': isMaxScale ? 'not-allowed' : 'pointer' }} onClick={this.zoom} type='button' className='progress-btn add-btn'>+</button>
        <div className='progress-line'>
          <div className='progress-outer'>
            <div className='progress-inner' id='progress' onClick={(e) => this.handleScrollClick(e)}>
              <div
                className='progress-bg'
                style={{ 'width': scaleWidth, 'height': '8px', 'borderRadius': '100px', 'cursor': this.state.cursorType }}
              >
                {scale === 2 || scale === 0.5 ? null : <div className='circle' /> }
              </div>
            </div>
          </div>
        </div>
        <button data-type='-' style={{ 'cursor': isMinScale ? 'not-allowed' : 'pointer' }} onClick={this.zoom} type='button' className='progress-btn minus-btn'>-</button>
      </div>
    )
  }
}

const mapState = (state) => ({
  theme: state.setTheme,
  zoomStatus: state.zoomStatus,
  isSingleCompany: state.singleCompanyState,
  graphType: state.setGraphType
})

const mapDispatch = (dispatch) => {
  return {
    setZoomStatus: (v) => {
      dispatch(setZoomStatus(v))
    }
  }
}

export default connect(mapState, mapDispatch)(Progress)
