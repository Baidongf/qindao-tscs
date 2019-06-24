import React from 'react'
import './InputRange.scss'

class InputRange extends React.Component {
  constructor(props) {
    super(props);

    const initRange = this.props.initRange || { min: '', max: '' }
    this.unit = this.props.unit || 1
    this.state = { min: initRange.min, max: initRange.max }

    this.resetInput = this.resetInput.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.initRange && (this.state.min !== nextProps.initRange.min || this.state.max !== nextProps.max)) {
      this.setState({
        min: nextProps.initRange.min,
        max: nextProps.initRange.max
      })
    }
    if (nextProps.reset) {
      this.resetInput()
    }
  }

  handleChange (propertyName, event) {
    let inputVal = event.target.value.replace(/[^\d]/g, '')
    const state = this.state
    state[propertyName] = inputVal
    this.setState(state)
    let min
    if (this.state.min) {
      min = this.state.min * this.unit
    }
    let max
    if (this.state.max) {
      max = this.state.max * this.unit
    }
    let range = {}
    if (!isNaN(min)) {
      range['min'] = min
    }
    if (!isNaN(max)) {
      range['max'] = max
    }
    this.props.handleInputRange(this.props.name, range);
  }

  resetInput () {
    this.setState({
      min: '',
      max: ''
    })
  }

  render () {
    const { max, min } = this.state;
    return (
      <div className="input-range">
        <div className="input-range-row">
          <p className="filter-detail-sub-title">{this.props.filterTitle}</p>
        </div>
        <div className="input-range-row clearfix">
          <input
            className='input-number'
            placeholder={this.props.placeholder}
            value={min}
            onChange={this.handleChange.bind(this, 'min')}
          />
          <span className="dash">-</span>
          <input
            className='input-number'
            placeholder={this.props.placeholder}
            value={max}
            onChange={this.handleChange.bind(this, 'max')}
          />
        </div>
      </div>
    )
  }
}

export default InputRange;
