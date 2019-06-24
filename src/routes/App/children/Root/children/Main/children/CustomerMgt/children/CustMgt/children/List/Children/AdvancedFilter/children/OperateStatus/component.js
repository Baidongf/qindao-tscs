import React from 'react'

class OperateRange extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}

    // 经营状态文案
    this.operateStatusWordings = {
      all: '全部',
      normal: '正常',
      renew: '存续',
      moveIn: '迁入',
      moveOut: '迁出',
      closed: '停业',
      cancel: '撤销',
      revoke: '吊销',
      clear: '清算',
    }

    // 经营状态列表DOM元素(在高级弹窗出现的时候才去获取)
    this.operateStatusList = null

    this.handleSelectStatus = this.handleSelectStatus.bind(this)
    this.unSelectOperateStatus = this.unSelectOperateStatus.bind(this)
  }


  // 选择经营状态
  handleSelectStatus(e) {
    e.stopPropagation()
    const { operateStatus } = this.props

    // 获取经营状态列表，保存至全局
    if (!!this.operateStatusList === false) {
      this.operateStatusList = document.querySelector('#operateStatusList').children
    }

    const target = e.target
    if (target.nodeName === 'LI') {
      const className = target.getAttribute('class')
      const status = target.getAttribute('status')

      const index = className.indexOf('selected')
      if (index > -1) {
        // 如果已经选中，则取消选择
        this.props.deliverOperateStatus(
          Object.assign({}, operateStatus, { [`${status}`]: false })
        )
      } else {
        // 如果没选中，选中当前项
        this.props.deliverOperateStatus(
          Object.assign({}, operateStatus, { [`${status}`]: true })
        )
      }
    }
  }

  // 取消所有经营状态的选中
  unSelectOperateStatus() {
    if (!!this.operateStatusList === false) {
      this.operateStatusList = document.querySelector('#operateStatusList').children
    }
    const operateStatusList = [...this.operateStatusList]
    operateStatusList.forEach((element, index) => {
      const className = element.getAttribute('class')
      const _index = className.indexOf('selected')
      if (_index > -1) {
        element.setAttribute('class', className.substr(0, _index - 1))
      }
    })
  }

  render() {

    const { operateStatusWordings } = this
    const { operateStatus } = this.props
    const operateStatusKeys = Object.keys(operateStatus)

    return (
      <div className='select-row'>
        <div className='filter-description'>
          经营状态
        </div>
        <div className='filter-content'>
          <ul className='operate-status-ul' id='operateStatusList' onClick={this.handleSelectStatus}>
            {
              // 经营状态
              operateStatusKeys.map((value) => {
                return (
                  <li
                    className={`engage-list ${operateStatus[value] ? 'selected' : ''}`}
                    status={value}
                    key={`li-${value}`}
                  >
                    {operateStatusWordings[value]}
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}

export default OperateRange
