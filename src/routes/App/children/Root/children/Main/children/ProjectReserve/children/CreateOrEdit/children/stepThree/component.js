import React from 'react'
import {Row, Col, Input, Select, TreeSelect, Cascader, Radio} from 'antd'
import jiahao from './img/jiahao.png'
const Option = Select.Option
const RadioGroup = Radio.Group

class CreateOrEditFrom extends React.Component {
  constructor(props) {
    super(props)
  }

  coopSituationChange = (value) => {
    this.props.valueChange('coopSituation', value.target.value)
  }

  coopYearChange = (value) => {
    this.props.valueChange('coopYear', value.target.value)
  }

  auditChange=(value,index)=>{
    this.props.listChange(index, 'audit', value)
  }


  componentWillMount() {

  }

  componentDidMount() {
  }

  componentWillReceiveProps() {

  }

  render() {
    const {valueChange, inputObj, queryEnum, listChange} = this.props
    return (
      <div>
        <div className='title'>融资主体</div>
        <div className='form-wrap'>
          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>客户名称</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入客户名称'
                         value={inputObj.cusName}
                         onChange={(e) => {
                           valueChange('cusName', e)
                         }}
                  />

                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>内外部评级</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入内外部评级'
                         value={inputObj.grade}
                         onChange={(e) => {
                           valueChange('grade', e)
                         }}
                  />
                </div>
              </div>
            </Col>

          </Row>

          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>合作情况 (单选)</div>
                <div className='input-wrap'>
                  <RadioGroup
                    value={inputObj.coopSituation}
                    onChange={this.coopSituationChange}
                  >
                    {queryEnum.cooperationEnum && Object.keys(queryEnum.cooperationEnum).map(key => {
                        return (
                          <Radio value={parseInt(key)} key={parseInt(key)} style={{marginRight: '42px', marginBottom: '13px'}}>
                            {queryEnum.cooperationEnum[key]}
                          </Radio>
                        )
                      }
                    )}
                    {
                      parseInt(inputObj.variety) === 8 && <Input
                        style={{width: '300px', display: 'inline-block'}}
                        value={inputObj.varietyOther}
                        onChange={(e) => {
                          valueChange('varietyOther', e)
                        }}
                      />
                    }

                  </RadioGroup>
                </div>
              </div>
            </Col>
            {
              inputObj.coopSituation==1&& <Col span={12}>
                <div className='input-item'>
                  <div className='label'>合作权限 (单选)</div>
                  <div className='input-wrap'>
                    <RadioGroup
                      value={inputObj.coopYear}
                      onChange={this.coopYearChange}
                    >
                      {queryEnum.limitStatusEnum && Object.keys(queryEnum.limitStatusEnum).map(key => {
                          return (
                            <Radio value={parseInt(key)} key={parseInt(key)} style={{marginRight: '42px', marginBottom: '13px'}}>
                              {queryEnum.limitStatusEnum[key]}
                            </Radio>
                          )
                        }
                      )}
                      {
                        parseInt(inputObj.variety) === 8 && <Input
                          style={{width: '300px', display: 'inline-block'}}
                          value={inputObj.varietyOther}
                          onChange={(e) => {
                            valueChange('varietyOther', e)
                          }}
                        />
                      }
                    </RadioGroup>
                  </div>
                </div>
              </Col>
            }

          </Row>

          <Row>
            <Col span={24}>
              <div className='input-item'>
                <div className='label'>股东构成情况 及股权占比</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入股东构成情况 及股权占比'
                         value={inputObj.stockholder}
                         onChange={(e) => {
                           valueChange('stockholder', e)
                         }}
                  />
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <div className='input-item'>
                <div className='label'>注册资金到位情况</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入注册资金到位情况'
                         value={inputObj.fundsCase}
                         onChange={(e) => {
                           valueChange('fundsCase', e)
                         }}
                  />
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <div className='input-item'>
                <div className='label'>基本账户开立情况 及主要资金结算行</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入基本账户开立情况 及主要资金结算行'
                         value={inputObj.majorFund}
                         onChange={(e) => {
                           valueChange('majorFund', e)
                         }}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className='input-item'>
                <div className='label'>有无授信逾期 及涉诉</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入有无授信逾期 及涉诉'
                         value={inputObj.lawsuit}
                         onChange={(e) => {
                           valueChange('lawsuit', e)
                         }}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <div className='line'></div>

          {
            inputObj.list?inputObj.list.map((item, index) => {
                return (
                  <div>
                    <Row>
                      <Col span={12}>
                        <div className='input-item'>
                          <div className='label'>{index===0?'主要财务情况':''}</div>
                          <div className='input-wrap'>
                            <Input placeholder='请输入年度'
                                   type={'number'}
                                   value={item.majorYear}
                                   onChange={(e) => {
                                     listChange(index, 'majorYear', e)
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
                          <div className='label'>资产</div>
                          <div className='input-wrap'>
                            <Input placeholder='请输入资产'
                                   type={'number'}
                                   value={item.capital}
                                   onChange={(e) => {
                                     listChange(index, 'capital', e)
                                   }}
                            />
                            <span className='input-label'>万元</span>
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className='input-item'>
                          <div className='label'>负债</div>
                          <div className='input-wrap'>
                            <Input placeholder='请输入负债'
                                   type={'number'}
                                   value={item.liability}
                                   onChange={(e) => {
                                     listChange(index, 'liability', e)
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
                          <div className='label'>营业收入</div>
                          <div className='input-wrap'>
                            <Input placeholder='请输入营业收入'
                                   type={'number'}
                                   value={item.income }
                                   onChange={(e) => {
                                     listChange(index, 'income', e)
                                   }}
                            />
                            <span className='input-label'>万元</span>
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className='input-item'>
                          <div className='label'>净利润</div>
                          <div className='input-wrap'>
                            <Input placeholder='请输入净利润'
                                   type={'number'}
                                   value={item.netProfit}
                                   onChange={(e) => {
                                     listChange(index, 'netProfit', e)
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
                          <div className='label'>财务报表是否 经过审计</div>
                          <div className='input-wrap'>
                            <RadioGroup
                              value={item.audit}
                              onChange={(e)=>{
                                this.auditChange(e,index)
                              }}
                            >
                              {queryEnum.projectTopicEnum && Object.keys(queryEnum.projectTopicEnum).map(key => {
                                  return (
                                    <Radio value={parseInt(key)} key={parseInt(key)} style={{marginRight: '42px', marginBottom: '13px'}}>
                                      {queryEnum.projectTopicEnum[key]}
                                    </Radio>
                                  )
                                }
                              )}
                              {
                                parseInt(inputObj.variety) === 8 && <Input
                                  style={{width: '300px', display: 'inline-block'}}
                                  value={inputObj.varietyOther}
                                  onChange={(e) => {
                                    valueChange('varietyOther', e)
                                  }}
                                />
                              }

                            </RadioGroup>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )
              }
            ):''
          }

          <div className='add-top' onClick={this.props.addTop}>
            <img src={jiahao}/>
            <p>新增财务情况</p>
          </div>




          <div className='line'></div>

          <Row>
            <Col span={24}>
              <div className='input-item'>
                <div className='label'>主要产品情况</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入主要产品情况'
                         value={inputObj.majorProdCase}
                         onChange={(e) => {
                           valueChange('majorProdCase', e)
                         }}
                  />
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <div className='input-item'>
                <div className='label'>信贷系统测算 授信业务限额</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入信贷系统测算 授信业务限额'
                         type={'number'}
                         value={inputObj.businessLimit}
                         onChange={(e) => {
                           valueChange('businessLimit', e)
                         }}
                  />
                  <span className='input-label'>万元</span>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <div className='input-item'>
                <div className='label'>还款来源</div>
                <div className='input-wrap'>
                  <Input.TextArea rows={5} placeholder='请输入还款来源'
                                  value={inputObj.paymentSource}
                                  onChange={(e) => {
                                    valueChange('paymentSource', e)
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
