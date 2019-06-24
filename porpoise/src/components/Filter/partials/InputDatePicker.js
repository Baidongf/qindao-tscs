import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
moment.locale('cn')
import 'react-datepicker/dist/react-datepicker.css'
import './InputDatePicker.scss'

class InputDatePicker extends React.Component {
  constructor(props) {
    super(props)

    const initRange = this.props.initRange || {}
    this.state = {
      startDate: initRange.min && moment(new Date(initRange.min)),
      endDate: initRange.max && moment(new Date(initRange.max))
    }
    this.isValid = true

    this.handleChange = this.handleChange.bind(this)
    this.submitDate = this.submitDate.bind(this)
    this.resetDate = this.resetDate.bind(this)
  }

  handleChange (dateType, date) {
    this.setState({ [dateType]: date }, () => {
      this.isValid = this.isValidInput()
      this.props.setValidStatus && this.props.setValidStatus(this.isValid)
      this.submitDate()
    })
  }

  submitDate () {
    if (!this.isValid) return
    const selectedDate = {}
    if (this.state.startDate) {
      selectedDate.min = this.state.startDate.format('YYYY-MM-DD')
    }
    if (this.state.endDate) {
      selectedDate.max = this.state.endDate.format('YYYY-MM-DD')
    }
    this.props.handleInputRange(this.props.name, selectedDate)
  }

  resetDate () {
    this.setState({
      startDate: null,
      endDate: null
    })
    this.props.handleInputRange(this.props.name, {})
  }

  isValidInput = () => {
    return this.state.endDate ? new Date(this.state.endDate) >= new Date(this.state.startDate) : true
  }

  render () {
    // let isSubmitBtnValid = this.isValidInput()
    // if (!this.state.startDate && !this.state.endDate) isSubmitBtnValid = false

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
          { this.state.startDate || this.state.endDate ? (
            <div>
              {/* <a className='input-range-reset-btn btn'
                onClick={this.resetDate}>清空</a>
              <a className={isSubmitBtnValid ? 'input-range-ok-btn btn valid' : 'input-range-ok-btn btn'}
                onClick={this.submitDate}>确定</a> */}
            </div>  // 有了全局确定按钮，输入框上的确定按钮不再需要. 18/7/7/xyz
          ) : null}
        </div>
        <div className='input-range-row'>
          <div className='start-date-picker'>
            <DatePicker
              selected={this.state.startDate}
              onChange={(date) => this.handleChange('startDate', date)}
              {...config}
            />
          </div>
          <span className='dash'>-</span>
          <div className='end-date-picker'>
            <DatePicker
              selected={this.state.endDate}
              onChange={(date) => this.handleChange('endDate', date)}
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
