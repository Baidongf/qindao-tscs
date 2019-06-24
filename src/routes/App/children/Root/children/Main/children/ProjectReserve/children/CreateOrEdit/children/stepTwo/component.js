import React from 'react'
import { Row, Col, Input, Radio, Checkbox } from 'antd'

const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group;

class CreateOrEditFrom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      compCaseArr: []
    }
  }

  weightinessChange = (value) => {
    this.props.valueChange('weightiness', value.target.value)
  }

  compCaseChange = (value) => {
    this.props.valueChange('compCaseArr', value)
  }

  componentWillReceiveProps({ queryEnum }) {
    if (this.props.queryEnum !== queryEnum) {
      let compCaseArr = Object.keys(queryEnum.compCaseEnum).map(key => {
        return {
          label: queryEnum.compCaseEnum[key], value: key
        }
      })
      this.setState({
        compCaseArr: compCaseArr
      })
    }
  }

  render() {
    const { valueChange, inputObj, queryEnum } = this.props
    return (
      <div>
        <div className='title'>项目基本情况</div>
        <div className='form-wrap'>
          <Row>
            <Col span={24}>
              <div className='input-item'>
                <div className='label'>项目重要性 (单选)</div>
                <div className='input-wrap'>
                  <RadioGroup
                    value={inputObj.weightiness}
                    onChange={this.weightinessChange}
                  >
                    {queryEnum.weightNessEnum && Object.keys(queryEnum.weightNessEnum).map(key => {
                      return (
                        <Radio value={parseInt(key)} key={parseInt(key)} style={{ marginRight: '42px', marginBottom: '13px' }}>
                          {queryEnum.weightNessEnum[key]}
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
                <div className='label'>项目建设内容概述</div>
                <div className='input-wrap'>
                  <Input.TextArea rows={5}
                    placeholder='请输入项目建设内容概述'
                    value={inputObj.buildDesc}
                    onChange={(e) => {
                      valueChange('buildDesc', e)
                    }}
                  /></div>
              </div>
            </Col>
          </Row>

          <div className='line'></div>


          <div className='sub-title'>项目建设进度</div>
          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>项目开工时间</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入项目开工时间'
                    type={'number'}
                    value={inputObj.startTime}
                    onChange={(e) => {
                      valueChange('startTime', e)
                    }}
                  />
                  <span className='input-label'>年</span>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>项目竣工时间</div>
                <div className='input-wrap'>

                  <Input placeholder='请输入项目竣工时间'
                    type={'number'}
                    value={inputObj.endTime}
                    onChange={(e) => {
                      valueChange('endTime', e)
                    }}
                  />
                  <span className='input-label'>年</span>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>建设周期</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入建设周期'
                    type={'number'}
                    value={inputObj.buildCircle}
                    onChange={(e) => {
                      valueChange('buildCircle', e)
                    }}
                  />
                  <span className='input-label'>月</span>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>建设进度</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入建设进度'
                    value={inputObj.buildProcess}
                    onChange={(e) => {
                      valueChange('buildProcess', e)
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>

          <div className='line'></div>
          <div className='sub-title'>项目资金投资构成</div>

          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>项目资金</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入项目资金'
                    type={'number'}
                    value={inputObj.principal}
                    onChange={(e) => {
                      valueChange('principal', e)
                    }}
                  />
                  <span className='input-label'>万元</span>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>融资</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入融资金额'
                    type={'number'}
                    value={inputObj.raiseMoney}
                    onChange={(e) => {
                      valueChange('raiseMoney', e)
                    }}
                  />
                  <span className='input-label'>万元</span>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>其他类资金</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入其他类资金'
                    type={'number'}
                    value={inputObj.otherMoney}
                    onChange={(e) => {
                      valueChange('otherMoney', e)
                    }}
                  />
                  <span className='input-label'>万元</span>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>总计(项目总投)</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入项目总计金额'
                    type={'number'}
                    value={inputObj.totalMoney}
                    disabled={true}
                  />
                  <span className='input-label'>万元</span>
                </div>
              </div>
            </Col>
          </Row>

          <div className='line'></div>
          <div className='sub-title'>资金到位情况</div>

          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>政府补助</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入政府补助'
                    type={'number'}
                    value={inputObj.govSubsidy}
                    onChange={(e) => {
                      valueChange('govSubsidy', e)
                    }}
                  />
                  <span className='input-label'>万元</span>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>自有资金</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入自有资金'
                    type={'number'}
                    value={inputObj.ownedFund}
                    onChange={(e) => {
                      valueChange('ownedFund', e)
                    }}
                  />
                  <span className='input-label'>万元</span>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>引进外资</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入引进外资'
                    type={'number'}
                    value={inputObj.foreignCapital}
                    onChange={(e) => {
                      valueChange('foreignCapital', e)
                    }}
                  />
                  <span className='input-label'>万元</span>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>其他资金</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入其他资金'
                    type={'number'}
                    value={inputObj.otherFund}
                    onChange={(e) => {
                      valueChange('otherFund', e)
                    }}
                  />
                  <span className='input-label'>万元</span>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>总计(项目总投)</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入总计金额'
                    type={'number'}
                    value={inputObj.totals}
                    disabled={true}
                  />
                  <span className='input-label'>万元</span>
                </div>
              </div>
            </Col>
          </Row>

          <div className='line'></div>
          <Row>
            <Col span={24}>
              <div className='input-item'>
                <div className='label'>项目融资情况</div>
                <div className='input-wrap'>
                  <Input.TextArea rows={4} placeholder='请输入项目融资情况'
                    value={inputObj.financDesc}
                    onChange={(e) => {
                      valueChange('financDesc', e)
                    }}
                  />

                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className='input-item'>
                <div className='label'>项目合规要件情况 (多选)</div>
                <div className='input-wrap'>
                  <CheckboxGroup options={this.state.compCaseArr} onChange={this.compCaseChange}
                    value={inputObj.compCaseArr} />
                  <Input
                    style={{ width: '300px', marginTop: '13px' }}
                    value={inputObj.compCaseOther}
                    onChange={(e) => {
                      valueChange('compCaseOther', e)
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>

          <div className='sub-title'>项目综合贡献度</div>

          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>拉动对公负债</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入拉动对公负债'
                    type={'number'}
                    value={inputObj.publicDept}
                    onChange={(e) => {
                      valueChange('publicDept', e)
                    }}
                  />
                  <span className='input-label'>万元</span>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>开立对公账户</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入开立对公账户'
                    type={'number'}
                    value={inputObj.openPubAccount}
                    onChange={(e) => {
                      valueChange('openPubAccount', e)
                    }}
                  />
                  <span className='input-label'>户</span>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>公私联动， 拉动对私负债</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入公私联动， 拉动对私负债'
                    type={'number'}
                    value={inputObj.privateLiability}
                    onChange={(e) => {
                      valueChange('privateLiability', e)
                    }}
                  />
                  <span className='input-label'>万元</span>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>个人资产</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入个人资产'
                    type={'number'}
                    value={inputObj.personalCapital}
                    onChange={(e) => {
                      valueChange('personalCapital', e)
                    }}
                  />
                  <span className='input-label'>万元</span>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>其他个人业务</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入其他个人业务'
                    type={'number'}
                    value={inputObj.otherPersonalBusiness}
                    onChange={(e) => {
                      valueChange('otherPersonalBusiness', e)
                    }}
                  />
                  <span className='input-label'>户</span>

                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>运用供应链产品</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入供应链产品'
                    value={inputObj.otherSupChainProd}
                    onChange={(e) => {
                      valueChange('otherSupChainProd', e)
                    }}
                  /></div>
              </div>
            </Col>
          </Row>

        </div>
      </div>
    )
  }
}

export default CreateOrEditFrom
