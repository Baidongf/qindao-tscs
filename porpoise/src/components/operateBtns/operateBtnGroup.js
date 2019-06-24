/**
 * @desc: {按钮-组合组件}
 * @author: xieyuzhong
 * @Date: 2018-12-06 17:10:18
 * @Last Modified by:   xieyuzhong
 * @Last Modified time: 2018-12-06 17:10:18
 */
import React from 'react'
import './operateBtns.scss'

export function OperateBtnGroup (props) {
  return (
    <div className='operate-btn-group'>
      { props.children }
    </div>
  )
}

export function OperateBtnContainer (props) {
  return (
    <div className='operate-btn-container'>
      { props.children }
    </div>
  )
}
