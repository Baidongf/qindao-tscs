import React from 'react'

import './tips.scss'

export default function Tips () {
  return (
    <div className='label-container'>
      <ul className='group-tips-list'>
        <li className='current-insight'>当前视角</li>
        <li className='same-group'>同一集团</li>
        <li className='diff-group'>非同一集团</li>
      </ul>
      <ul className='tips-list'>
        <li className='core'>集团核心</li>
        <li className='belong-inner'>行内客户</li>
        <li className='listed'>上市公司</li>
        <li className='blacklist'>黑名单企业</li>
        <li className='abnormal'>异常经营状态</li>
        <li className='control-shareholder'>控股股东</li>
        <li className='actual-controller'>疑似实际控制人</li>
      </ul>
    </div>
  )
}
