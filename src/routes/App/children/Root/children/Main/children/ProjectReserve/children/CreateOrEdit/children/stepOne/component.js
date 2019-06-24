import React from 'react'
import {Row, Col, Input, DatePicker, Select, TreeSelect, Cascader, Radio} from 'antd'
import OrgSelect from 'components/OwnInstitution'

const Option = Select.Option
const RadioGroup = Radio.Group

class CreateOrEditFrom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      keyAreaEnum: [],
      keyAreaEnumValue: '',
    }
    this.currentUser=JSON.parse(localStorage.getItem('currentUser'))
    // this.setState({
    //   currentSelectOrgId: this.currentUser.institutionId,//当前选中的机构ID
    //   currentSelectCustomerManager: this.currentUser.id//当前选中的客户经理ID
    // })
    // this.defaultOrg=""
  }

  handlePopupConfirm = (keys) => {
    let key = keys[0].split('-')
    this.props.valueChange('institutionId', key[key.length - 1])
  }

  keyAreaEnumChange = (value) => {
    this.setState({keyAreaEnumValue: value})
    if (value.length >= 1) {
      this.props.valueChange('proMajorAreaF', value[0])
    }

    if (value.length >= 2) {
      this.props.valueChange('proMajorAreaS', value[1])
    }
  }

  varietyChange = (value) => {
    this.props.valueChange('variety', value.target.value)
  }

  componentWillMount() {

  }

  componentDidMount() {
    if(!this.props._operation)
      this.props.valueChange('institutionId', this.currentUser.institutionId)
  }

  componentWillReceiveProps({queryEnum, inputObj}) {
    if (this.props.queryEnum !== queryEnum) {
      let treeData = []
      Object.keys(queryEnum.keyAreaEnum).forEach(key => {
        let children = Object.keys(queryEnum.keyAreaEnum[key][Object.keys(queryEnum.keyAreaEnum[key])[0]]).map(item => {
          if (queryEnum.keyAreaEnum[key][Object.keys(queryEnum.keyAreaEnum[key])[0]][item] === '') {
            return
          }
          return {
            // value: Math.random().toString(36).substr(2) + '_' + item,
            value: parseInt(item),
            title: queryEnum.keyAreaEnum[key][Object.keys(queryEnum.keyAreaEnum[key])[0]][item],
            label: queryEnum.keyAreaEnum[key][Object.keys(queryEnum.keyAreaEnum[key])[0]][item],
          }
        })

        treeData.push({
          //  value: Math.random().toString(36).substr(2) + '_' + key,
          value: parseInt(key),
          title: Object.keys(queryEnum.keyAreaEnum[key])[0],
          label: Object.keys(queryEnum.keyAreaEnum[key])[0],
          children: children[0] && children
        })
      })
      this.setState({keyAreaEnum: treeData})
    }

    if (inputObj) {
      let result = []
      if (typeof inputObj.proMajorAreaF === 'number') {
        result.push(inputObj.proMajorAreaF)
      }
      if (typeof inputObj.proMajorAreaS === 'number') {
        result.push(inputObj.proMajorAreaS)
      }
      this.setState({keyAreaEnumValue: result})
    }
  }

  render() {
    const {valueChange, inputObj, queryEnum} = this.props
    return (
      <div>
        <div className='title'>分支行授信项目储备</div>
        <div className='form-wrap'>
          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>一级分支机构</div>
                <div className='input-wrap'>
                  <OrgSelect _title={this.props._operation?inputObj.institutionName:this.currentUser.institutionName}
                             btnStyle={{width: '100%', marginRight: '0'}}
                             _wrapStyle={{width: '100%'}}
                             handlePopupConfirm={this.handlePopupConfirm}
                             _checkStrictly={true}
                  />
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>项目编号</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入项目编号'
                         value={inputObj.reportProCode}
                         onChange={(e) => {
                           valueChange('reportProCode', e)
                         }}
                  /></div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>项目申报名称</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入项目申报名称'
                         value={inputObj.reportProName}
                         onChange={(e) => {
                           valueChange('reportProName', e)
                         }}
                  />
                </div>
              </div>
            </Col>
          </Row>

          <div className='line'></div>

          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>项目涉及重点领域</div>
                <div className='input-wrap'>
                  <Cascader placeholder='请选择项目涉及重点领域' style={{width: '100%'}}
                            options={this.state.keyAreaEnum}
                            value={this.state.keyAreaEnumValue}
                            onChange={this.keyAreaEnumChange}
                  />
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>项目入库日期</div>
                <div className='input-wrap'>
                  <DatePicker
                    placeholder='请选择项目入库日期'
                    value={inputObj.putDate||""}
                    onChange={(e) => {
                      valueChange('putDate', e)
                    }}
                  /></div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>申报项目状态</div>
                <div className='input-wrap'>
                  <Select
                    value={inputObj.reportProStatus}
                    onChange={(e) => {
                      valueChange('reportProStatus', e)
                    }}
                    placeholder='请选择项目申报状态'
                    style={{width: '100%'}}
                  >
                    {queryEnum.reportProStatusEnum && Object.keys(queryEnum.reportProStatusEnum).map(key => {
                      return (
                        <Option value={parseInt(key)} key={parseInt(key)}>{queryEnum.reportProStatusEnum[key]}</Option>
                      )
                    })}
                  </Select>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>项目支持行业</div>
                <div className='input-wrap'>
                  <Select
                    value={inputObj.proSupIndustry}
                    onChange={(e) => {
                      valueChange('proSupIndustry', e)
                    }}
                    placeholder='请选择项目支持行业'
                    style={{width: '100%'}}
                  >
                    {queryEnum.industryEnum && Object.keys(queryEnum.industryEnum).map(key => {
                      return (
                        <Option value={parseInt(key)} key={parseInt(key)}>{queryEnum.industryEnum[key]}</Option>
                      )
                    })}

                  </Select>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>项目储蓄责任领导</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入项目储蓄责任领导'
                         value={inputObj.proStoreLeader}
                         onChange={(e) => {
                           valueChange('proStoreLeader', e)
                         }}
                  /></div>
              </div>
            </Col>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>项目储蓄负责人</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入项目储蓄负责人'
                         value={inputObj.proStorePrincipal}
                         onChange={(e) => {
                           valueChange('proStorePrincipal', e)
                         }}
                  /></div>
              </div>
            </Col>
          </Row>

          <div className='line'></div>
          <div className='sub-title'>项目储备金额</div>
          <Row>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>拟融资额度</div>
                <div className='input-wrap'><Input placeholder='请输入拟融资额度(万元)' type='number'
                                                   value={inputObj.financingQuota}
                                                   onChange={(e) => {
                                                     valueChange('financingQuota', e)
                                                   }}
                />
                  <span className='input-label'>万元</span>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className='input-item'>
                <div className='label'>期限</div>
                <div className='input-wrap'>
                  <Input placeholder='请输入期限'
                         type='number'
                         value={inputObj.timeLimit}
                         onChange={(e) => {
                           valueChange('timeLimit', e)
                         }}
                  />
                  <span className='input-label'>月</span>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <div className='input-item'>
                <div className='label'>融资品种 (单选)</div>
                <div className='input-wrap'>
                  <RadioGroup
                    value={inputObj.variety}
                    onChange={this.varietyChange}
                  >
                    {queryEnum.varietyEnum && Object.keys(queryEnum.varietyEnum).map(key => {
                        return (
                          <Radio value={parseInt(key)} key={parseInt(key)} style={{marginRight: '42px', marginBottom: '13px'}}>
                            {queryEnum.varietyEnum[key]}
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
      </div>
    )
  }
}

export default CreateOrEditFrom
