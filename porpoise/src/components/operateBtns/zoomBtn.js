/**
 * @desc: {放大、缩小按钮}
 * @author: xieyuzhong
 * @Date: 2018-12-06 17:15:53
 * @Last Modified by: zhengyiqiu
 * @Last Modified time: 2019-02-26 10:45:05
 */

import React from 'react'
import Btn from './btn'
import {
  connect
} from 'react-redux'
import {
  setZoomStatus
} from 'actions/InitOperateBtn'
import * as d3 from 'd3'

import ZoomInImg from './assets/zoom_in.svg'
import ZoomInImgDeep from './assets/zoom_in_deep.svg'
import ZoomInImgDeepDisabled from './assets/zoom_in_deep_disabled.svg'
import ZoomInImgHighlight from './assets/zoom_in_highlight.svg'
import ZoomInImgHighlightDeep from './assets/zoom_in_highlight_deep.svg'
import ZoomOutImg from './assets/zoom_out.svg'
import ZoomOutImgDeep from './assets/zoom_out_deep.svg'
import ZoomOutImgHighlight from './assets/zoom_out_highlight.svg'
import ZoomOutImgHighlightDeep from './assets/zoom_out_highlight_deep.svg'
import ZoomOutDisabledImg from './assets/zoom_out_deep_disabled.svg'

function _getNextScale (type, scale) {
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

class withReduxZoomInBtn extends React.PureComponent {
  constructor (props) {
    super(props)
    this.click = this.click.bind(this)
  }

  click () {
    let {
      scale
    } = this.props.zoomStatus
    let setZoomStatus = this.props.setZoomStatus
    let nextScale

    if (scale === 2.00) return
    if (scale === 1.75) {
      nextScale = _getNextScale('+', scale)
      setZoomStatus({
        scale: nextScale,
        isMaxScale: true
      })
    } else {
      nextScale = _getNextScale('+', scale)
      setZoomStatus({
        scale: nextScale,
        isMaxScale: false,
        isMinScale: false
      })
    }
    let target
    if (this.props.graphType === 'grid') {
      target = 'canvas_zoom'
    } else {
      target = 'bubble_zoom'
    }
    if (this.props.isSingleCompany) {
      target = 'structure_zoom'
    }
    d3.select('body').dispatch(target, {
      detail: {
        scale: nextScale
      } // test，发送缩放比例
    })
  }

  render () {
    let {
      isMaxScale
    } = this.props.zoomStatus
    return (
      <div className='operate-btn-box' onClick={this.click} >
        <Btn
          img={
            isMaxScale && this.props.theme === 'deep' ? ZoomInImgDeepDisabled : (this.props.theme === 'light' ? ZoomInImg : ZoomInImgDeep)
          }
          imgHighlight={
            this.props.theme === 'light' ? ZoomInImgHighlight : ZoomInImgHighlightDeep
          }
          disabled={
            isMaxScale
          }
        />
      </div>
    )
  }
}

class withReduxZoomOutBtn extends React.PureComponent {
  constructor (props) {
    super(props)
    this.click = this.click.bind(this)
  }

  click () {
    let {
      scale
    } = this.props.zoomStatus
    let setZoomStatus = this.props.setZoomStatus
    let nextScale

    if (scale === 0.50) return

    if (scale === 0.75) {
      nextScale = _getNextScale('-', scale)
      setZoomStatus({
        scale: nextScale,
        isMinScale: true
      })
    } else {
      nextScale = _getNextScale('-', scale)
      setZoomStatus({
        scale: nextScale,
        isMaxScale: false,
        isMinScale: false
      })
    }
    let target
    if (this.props.graphType === 'grid') {
      target = 'canvas_zoom'
    } else {
      target = 'bubble_zoom'
    }
    if (this.props.isSingleCompany) {
      target = 'structure_zoom'
    }

    d3.select('body').dispatch(target, {
      detail: {
        scale: nextScale
      } // test，发送缩放比例
    })
  }

  render () {
    let { isMinScale } = this.props.zoomStatus

    return (
      <div className='operate-btn-box' onClick={this.click} >
        <Btn
          img={
            isMinScale && this.props.theme === 'deep' ? ZoomOutDisabledImg : (this.props.theme === 'light' ? ZoomOutImg : ZoomOutImgDeep)
          }
          imgHighlight={
            this.props.theme === 'light' ? ZoomOutImgHighlight : ZoomOutImgHighlightDeep
          }
          disabled={
            isMinScale
          }
        />
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

export const ZoomInBtn = connect(mapState, mapDispatch)(withReduxZoomInBtn)
export const ZoomOutBtn = connect(mapState, mapDispatch)(withReduxZoomOutBtn)
