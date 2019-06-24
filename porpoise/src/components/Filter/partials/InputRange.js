import React from 'react'
import './InputRange.scss'

class InputRange extends React.Component {
  constructor(props) {
    super(props)

    const initRange = this.props.initRange || {}
    this.unit = this.props.unit || 1
    this.state = {
      min: initRange.min / this.unit || '',
      max: initRange.max / this.unit || ''
    }
    this.isValid = true

    this.submitRange = this.submitRange.bind(this)
    this.resetRange = this.resetRange.bind(this)
  }

  handleChange (propertyName, event) {
    let inputVal = event.target.value.replace(/[^\d]/g, '')
    const state = this.state
    state[propertyName] = inputVal

    this.setState(state, () => {
      this.isValid = this.isValidInput(state.min, state.max)
      this.props.setValidStatus && this.props.setValidStatus(this.isValid)
      this.submitRange()
    })
  }

  submitRange () {
    if (!this.isValid) return

    const defaultVal = this.props.defaultVal || {}
    const min = this.state.min * this.unit
    const max = this.state.max * this.unit
    let range = { min, max }
    if (min === 0) {
      range = defaultVal.min === undefined ? { max } : {
        min: defaultVal.min,
        max
      }
    }
    if (max === 0) {
      range = defaultVal.max === undefined ? { min } : {
        min,
        max: defaultVal.max
      }
    }
    this.props.handleInputRange(this.props.name, range)
  }

  resetRange () {
    this.setState({
      min: '',
      max: ''
    })
    this.props.handleInputRange(this.props.name, {})
  }

  isValidInput (min, max) {
    const reg = /^(?=.)([+]?(\d+)(\.(\d+))?)$/
    const threshold = this.props.threshold || {}
    let valid = false

    if (min === '' && max === '') return true

    if ((reg.test(min) && max === '') || (reg.test(max) && min === '')) {
      valid = true
    }
    if (reg.test(min) && reg.test(max) && parseFloat(max) > parseFloat(min)) {
      valid = true
    }
    if (threshold.min !== undefined && (parseFloat(min) < threshold.min || parseFloat(max) < threshold.min)) {
      valid = false
    }
    if (threshold.max !== undefined && (parseFloat(max) > threshold.max || parseFloat(min) > threshold.max)) {
      valid = false
    }
    return valid
  }

  render () {
    const { max, min } = this.state
    // let isSubmitBtnValid = this.isValidInput(min, max)

    return (
      <div className='input-range'>
        <div className='input-range-row'>
          <p className='filter-detail-sub-title'>{this.props.filterTitle}</p>
          { max !== '' || min !== '' ? (
            <div>
              {/* <a className='input-range-reset-btn btn'
                onClick={this.resetRange}>清空</a>
              <a className={isSubmitBtnValid ? 'input-range-ok-btn btn valid' : 'input-range-ok-btn btn'}
                onClick={this.submitRange}>确定</a> */}
            </div>  // 有了全局确定按钮，输入框上的确定按钮不再需要. 18/7/7/xyz
          ) : null}
        </div>
        <div className='input-range-row clearfix'>
          <input
            className='input-number'
            placeholder={this.props.placeholder}
            value={min}
            disabled={this.props.disabled}
            onChange={this.handleChange.bind(this, 'min')}
          />
          <span className='dash'>-</span>
          <input
            className='input-number'
            placeholder={this.props.placeholder}
            value={max}
            disabled={this.props.disabled}
            onChange={this.handleChange.bind(this, 'max')}
          />
        </div>
      </div>
    )
  }
}

export default InputRange
