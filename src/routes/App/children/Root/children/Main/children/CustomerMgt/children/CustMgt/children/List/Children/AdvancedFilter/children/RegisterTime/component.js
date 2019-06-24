import React from 'react'
import { DatePicker } from 'antd'

class RegisterTime extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  /**
   * @desc 注册时间处理函数
   * @param {string} type 开始时间('begin') or 结束时间('end')
   * @param {moment} date
   * @param {string} dateString 年-月-日
   */
  handleChangeRegisterDate(type = '', date, dateString) {
    const { registerTime } = this.props
    const changeObj = {}
    if (type === 'begin') {
      changeObj.startTime = { date, dateString }
    } else if (type === 'end') {
      changeObj.endTime = { date, dateString }
    }
    this.props.deliverRegisterTime(
      Object.assign({}, registerTime, changeObj)
    )
  }

  shouldComponentUpdate({ registerTime }) {
    const {
      startTime,
      endTime,
    } = this.props.registerTime
    return (
      startTime.dateString !== registerTime.startTime.dateString ||
      endTime.dateString !== registerTime.endTime.dateString
    )
  }

  render() {

    const { registerTime } = this.props

    return (
      <div className='select-row'>
        <div className='filter-description'>
          注册时间
        </div>
        <div className='filter-content'>
          <DatePicker
            placeholder='请选择开始时间'
            value={registerTime.startTime.date}
            onChange={this.handleChangeRegisterDate.bind(this, 'begin')}
          />
          <span className='filter-range'>至</span>
          <DatePicker
            placeholder='请选择结束时间'
            value={registerTime.endTime.date}
            onChange={this.handleChangeRegisterDate.bind(this, 'end')}
          />
        </div>
      </div>
    )
  }
}

export default RegisterTime
