import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
moment.locale('zh-cn')
import 'react-datepicker/dist/react-datepicker.css'
import './InputDatePicker.scss'

class InputDatePicker extends React.Component {
  constructor (props) {
    super(props)
    const initRange = this.props.initRange || {}
    this.state = {
      min: initRange.min && moment(new Date(initRange.min)) || '',
      max: initRange.max && moment(new Date(initRange.max)) || ''
    }

    this.resetDate = this.resetDate.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.initRange && (nextProps.initRange.min !== this.state.min || nextProps.initRange.max !== this.state.max)) {
      this.setState({
        min: nextProps.initRange.min && moment(new Date(nextProps.initRange.min)),
        max: nextProps.initRange.max && moment(new Date(nextProps.initRange.max))
      })
    }
    if (nextProps.reset) {
      this.resetDate()
    }
  }

  handleChange (dateType, date) {
    this.setState({ [dateType]: date })
    let state = {}
    if (this.state.min) {
      state.min = this.state.min.format('YYYY-MM-DD')
    }
    if (this.state.max) {
      state.max = this.state.max.format('YYYY-MM-DD')
    }
    if (date) {
      state[dateType] = date.format('YYYY-MM-DD')
    } else if (date === null) {
      delete (state[dateType])
    }

    this.props.handleInputRange(this.props.name, state)
  }

  resetDate () {
    this.setState({
      min: null,
      max: null
    })
  }

  render () {
    // let isSubmitBtnValid = this.state.max ? new Date(this.state.max) > new Date(this.state.min) : true;
    // if (!this.state.min && !this.state.max) isSubmitBtnValid = false;

    // 设置当前日期会报错，加一天处理
    const curDate = moment(new Date()).add(+1, 'd').format('YYYY-MM-DD')

    const config = {
      placeholderText: this.props.placeholder,
      peekNextMonth: true,
      showMonthDropdown: true,
      showYearDropdown: true,
      dropdownMode: 'scroll',
      readOnly: true,
      isClearable: true,
      dateFormat: 'YYYY-MM-DD',
      maxDate: curDate
    }
    return (
      <div className='input-range'>
        <div className='input-range-row'>
          <p className='filter-detail-sub-title'>{this.props.filterTitle}</p>
        </div>
        <div className='input-range-row'>
          <div className='start-date-picker'>
            <DatePicker
              selected={this.state.min}
              onChange={(date) => this.handleChange('min', date)}
              {...config}
            />
          </div>
          <span className='dash'>-</span>
          <div className='end-date-picker'>
            <DatePicker
              selected={this.state.max}
              onChange={(date) => this.handleChange('max', date)}
              popoverAttachment='top center'
              popoverTargetAttachment='bottom left'
              popoverTargetOffset='10px 50px'
              {...config}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default InputDatePicker
