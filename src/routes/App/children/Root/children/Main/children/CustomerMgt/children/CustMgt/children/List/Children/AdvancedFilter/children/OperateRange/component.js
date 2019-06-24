import React from 'react'
import { Input } from 'antd'

class OperateRange extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}

    this.handleOperateRangeInput = this.handleOperateRangeInput.bind(this)
  }

  handleOperateRangeInput(ev) {
    const operateRange = ev.target.value
    this.props.deliverOperateRange(operateRange)
  }

  render() {

    const { operateRange } = this.props

    return (
      <div className='select-row'>
        <div className='filter-description'>
          经营范围
        </div>
        <div className='filter-content'>
          <Input
            placeholder='请输入经营范围'
            style={{ width: 654 }}
            onChange={this.handleOperateRangeInput}
            value={operateRange}
          />
        </div>
      </div>
    )
  }
}

export default OperateRange
