import React from 'react'
import {Row, Col, Input, DatePicker} from 'antd'

class CreateOrEditFrom extends React.Component {
  constructor(props) {
    super(props)
  }


  componentWillMount() {

  }

  componentDidMount() {
  }

  componentWillReceiveProps() {

  }

  render() {
    const {valueChange, inputObj, queryEnum,} = this.props
    return (
      <div>
        <div className='title'>储备项目推进情况</div>
        <div className='form-wrap'>
          <Row>
            <Col span={24}>
              <div className='input-item'>
                <div className='label'>项目推进进度 (推动记录留痕)</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入项目推进进度 (推动记录留痕)'
                         value={inputObj.progress}
                         onChange={(e) => {
                           valueChange('progress', e)
                         }}
                  />
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>预计上报日期</div>
                <div className='input-wrap'>
                  <DatePicker placeholder='请选择预计上报日期'
                              value={inputObj.reportDate}
                              onChange={(e) => {
                                valueChange('reportDate', e)
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
