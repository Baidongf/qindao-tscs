/**
 * @desc: { 换肤按钮 }
 * @author: zhengyiqiu
 * @Create Date: 2018-12-18 17:34:46
 * @Last Modified by: zhengyiqiu
 * @Last Modified time: 2019-02-26 10:44:40
 */

import React from 'react'
import Btn from './btn'
import { connect } from 'react-redux'
import { setTheme } from 'actions/InitOperateBtn'

import SkinImg from './assets/skin.svg'
import SkinImgDeep from './assets/skin_deep.svg'
import SkinImgHighlight from './assets/skin_highlight.svg'
import SkinImgHighlightDeep from './assets/skin_highlight_deep.svg'

class SkinBtn extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isShowPopover: false
    }

    this.turnTint = this.turnTint.bind(this)
    this.turnDeep = this.turnDeep.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
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

  turnTint () {
    window.localStorage.setItem('theme', 'light')
    this.props.setTheme('light')
  }

  turnDeep () {
    window.localStorage.setItem('theme', 'deep')
    this.props.setTheme('deep')
  }

  getSelectPopover () {
    let lightActive = this.props.theme === 'light'
    return (
      <div className='btn-desc-detail'>
        <ul className='btn-desc-detail-list btn-desc-detail-theme-list'>
          <li onClick={this.turnTint} className={`btn-desc-detail-theme-item ${lightActive ? 'theme-active' : ''}`}>
            <div className={'btn-desc-detail-theme-circle light-circle'} />
            标准
          </li>
          <li onClick={this.turnDeep} className={`btn-desc-detail-theme-item ${lightActive ? '' : 'theme-active'}`}>
            <div className={'btn-desc-detail-theme-circle deep-circle'} />
            深邃
          </li>
        </ul>
      </div>
    )
  }

  render () {
    let skinSelectPopover = null
    if (this.state.isShowPopover) {
      skinSelectPopover = this.getSelectPopover()
    }

    return (
      <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} className='operate-btn-popover-box'>
        <div className='operate-btn-box'>
          <Btn
            img={this.props.theme === 'light' ? SkinImg : SkinImgDeep}
            imgHighlight={this.props.theme === 'light' ? SkinImgHighlight : SkinImgHighlightDeep}
            isShowPopover={this.state.isShowPopover}
          />
        </div>
        {skinSelectPopover}
      </div>
    )
  }
}

const mapState = (state) => ({
  theme: state.setTheme
})

const mapDispatch = (dispatch) => {
  return {
    setTheme: (v) => {
      dispatch(setTheme(v))
    }
  }
}

export default connect(mapState, mapDispatch)(SkinBtn)
