import React from 'react'
import './component.scss'
import { DatePicker } from 'antd'

class OpenAccountTime extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 开户时间范围
      openAccountTime: {
        startTime: {},
        endTime: {},
      },
    }
  }

  /**
   * @desc 开户时间的处理函数
   * @param {string} type 开始时间(‘begin’) or 结束时间('end')
   * @param {moment} date 时间对象
   * @param {string} dateString 时间字符串 年-月-日
   */
  handleChangeOpenDate(type, date, dateString) {
    const { openAccountTime } = this.props
    const _openAccountTime = {}
    if (type === 'begin') {
      _openAccountTime.startTime = { date, dateString }
    } else if (type === 'end') {
      _openAccountTime.endTime = { date, dateString }
    }
    const result = Object.assign({}, openAccountTime, _openAccountTime)
    this.props.deliverOpenAccountTime(result)
  }


  shouldComponentUpdate({ openAccountTime }) {
    const {
      startTime,
      endTime,
    } = this.props.openAccountTime
    return (
      startTime.dateString !== openAccountTime.startTime.dateString ||
      endTime.dateString !== openAccountTime.endTime.dateString
    )
  }


  render() {

    const { openAccountTime } = this.props

    return (
      <div className='select-row'>
        <div className='filter-description'>
          开户时间
        </div>
        <div className='filter-content'>
          <DatePicker
            placeholder='请选择开始时间'
            value={openAccountTime.startTime.date}
            onChange={this.handleChangeOpenDate.bind(this, 'begin')}
          />
          <span className='filter-range'>至</span>
          <DatePicker
            placeholder='请选择结束时间'
            value={openAccountTime.endTime.date}
            onChange={this.handleChangeOpenDate.bind(this, 'end')}
          />
        </div>
      </div>
    )
  }
}

export default OpenAccountTime
