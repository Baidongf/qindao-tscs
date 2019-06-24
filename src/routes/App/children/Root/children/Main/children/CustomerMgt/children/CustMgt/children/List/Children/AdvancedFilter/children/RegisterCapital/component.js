import React from 'react'
import { InputNumber } from 'antd'

class RegisterCapital extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  /**
   * @desc 用户输入注册资本
   * @param {string} type 上限(upper) or 下限(lower)
   */
  handleCapitalInput(type = '', limit) {
    const { registerCapital } = this.props
    this.props.deliverRegisterCapital(
      Object.assign({}, registerCapital, { [`${type}`]: limit })
    )
  }

  render() {

    const { registerCapital } = this.props

    return (
      <div className='select-row'>
        <div className='filter-description'>
          注册资本
        </div>
        <div className='filter-content'>
          <InputNumber
            placeholder='0.00'
            className='ant-input'
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            onChange={this.handleCapitalInput.bind(this, 'lower')}
            value={registerCapital.lower}
          />
          <span className='filter-range'>至</span>
          <InputNumber
            placeholder='0.00'
            className='ant-input'
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            onChange={this.handleCapitalInput.bind(this, 'upper')}
            value={registerCapital.upper}
          />
        </div>
      </div>
    )
  }
}

export default RegisterCapital
