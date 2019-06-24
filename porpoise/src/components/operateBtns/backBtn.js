/**
 * @desc: {回退按钮}
 * @author: xieyuzhong
 * @Date: 2018-12-07 11:57:53
 * @Last Modified by: zhengyiqiu
 * @Last Modified time: 2019-02-26 10:43:17
 */

import React from 'react'
import Btn from './btn'
import { connect } from 'react-redux'
import { showHistory } from 'actions/Chart'

import BackImg from './assets/back.svg'
import BackImgHighlight from './assets/back_highlight.svg'

function BackBtn (props) {
  function click () {
    if (!props.canGoBack) {
      return
    }
    console.log('click back')
    goBack(-1)
  }

  function goBack (step) {
    props.showHistory(step)
  }

  return (
    <div className='operate-btn-box' onClick={click}>
      <Btn img={BackImg} imgHighlight={BackImgHighlight} disabled={!props.canGoBack} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  canGoBack: state.undoableOriginChartData.past.length > 1,
  steps: state.undoableOriginChartData.past.length
})

const mapDispatchToProps = {
  showHistory
}

export default connect(mapStateToProps, mapDispatchToProps)(BackBtn)
