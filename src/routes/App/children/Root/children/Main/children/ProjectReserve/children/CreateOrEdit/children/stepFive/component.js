import React from 'react'
import { Row, Col, Input, Radio, DatePicker } from 'antd'
const RadioGroup = Radio.Group

class CreateOrEditFrom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  reasonChange = (value) => {
    this.props.valueChange('reason', value.target.value)
  }


  render() {
    const { valueChange, inputObj, queryEnum, } = this.props
    return (
      <div>
        <div className='title'>拟采取融资方案简述（含期限、利率）</div>
        <div className='form-wrap'>
          <Input.TextArea rows={5} placeholder='请输入拟采取融资方案简述（含期限、利率）'
            value={inputObj.description}
            onChange={(e) => {
              valueChange('description', e)
            }}
            style={{ marginBottom: '20px' }}
          />

          <Row>
            <Col span={24}>
              <div className='input-item'>
                <div className='label'>出库理由 (单选)</div>
                <div className='input-wrap'>
                  <RadioGroup
                    value={inputObj.reason}
                    onChange={this.reasonChange}
                  >
                    {queryEnum.outBoundEnumMap && Object.keys(queryEnum.outBoundEnumMap).map(key => {
                      return (
                        <Radio value={parseInt(key)} key={parseInt(key)} style={{ marginRight: '42px', marginBottom: '13px' }}>
                          {queryEnum.outBoundEnumMap[key]}
                        </Radio>
                      )
                    }
                    )}


                  </RadioGroup>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <div className='input-item'>
                <div className='label'>出库日期</div>
                <div className='input-wrap'>
                  <DatePicker
                    placeholder={'请选择出库'}
                    value={inputObj.outTime}
                    onChange={(e) => {
                      valueChange('outTime', e)
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default CreateOrEditFrom
