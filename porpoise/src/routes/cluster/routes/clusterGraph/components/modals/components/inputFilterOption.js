/**
 * @desc: {企业列表，高级筛选弹窗，输入框}
 * @author: xieyuzhong
 * @Date: 2019-01-09 14:50:17
 * @Last Modified by: xieyuzhong
 * @Last Modified time: 2019-01-14 15:27:55
 */

import React from 'react'

class InputFilterOption extends React.Component {
  constructor (props) {
    super(props)

    const filter = this.props.filters[this.props.title] || {}
    this.state = {
      min: filter.min || '',
      max: filter.max || '',
      isValid: true
    }

    this.onChange = this.props.onChange || (() => {})
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.filters !== nextProps.filters) {
      const { filters, title } = nextProps
      const filter = filters[title] || {}
      this.setState({
        min: filter.min_display || filter.min || '',
        max: filter.max_display || filter.max || ''
      })
    }
  }

  onInputChange = (e, type) => {
    this.setState({
      [e.target.dataset['type']]: e.target.value
    }, () => {
      const { min, max } = this.state
      if ((min !== '') && (max !== '') && Number(min) > Number(max)) {
        this.setState({
          isValid: false
        })
      } else {
        this.setState({
          isValid: true
        })
      }
      if (min < 0 || max < 0) {
        this.setState({
          isValid: false
        })
      }
    })
  }

  onEnsure = () => {
    if (!this.state.isValid) {
      return
    }
    const newFilters = Object.assign({}, this.props.filters)
    const unitValue = this.props.unitValue || 1
    const range = {
      min: this.state.min * unitValue,
      min_display: this.state.min,
      max: this.state.max * unitValue,
      max_display: this.state.max
    }
    if (this.state.min === '' || this.state.min === undefined) {
      delete range.min
      delete range.min_display
    }
    if (this.state.max === '' || this.state.max === undefined) {
      delete range.max
      delete range.max_display
    }
    if (Object.keys(range)) {
      range.unit = this.props.unit
    }
    newFilters[this.props.title] = range
    this.onChange(newFilters)
  }

  render () {
    const {
      title,
      unit
    } = this.props

    return (
      <div className='filter-option filter-input-option'>
        <span className='filter-title'>{`${title}`}</span>
        <div className='filter-input-container'>
          <div className='filter-input-box'>
            <input type='number' className='filter-input'
              value={this.state.min}
              data-type='min'
              onChange={this.onInputChange}
            />
            <span className='filter-unit'>{ unit }</span>
          </div>
          <span className='horizontal-line'>至</span>
          <div className='filter-input-box'>
            <input type='number' className='filter-input'
              value={this.state.max}
              data-type='max'
              onChange={this.onInputChange}
            />
            <span className='filter-unit'>{ unit }</span>

          </div>
          <button
            className={`filter-ensure-btn btn ok-btn ${this.state.isValid ? '' : 'invalid'}`}
            onClick={this.onEnsure}
          >
            确定
          </button>
        </div>
      </div>
    )
  }
}

export default InputFilterOption
