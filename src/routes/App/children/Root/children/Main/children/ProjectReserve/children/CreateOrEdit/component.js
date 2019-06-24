import React from 'react'
import { Form } from 'antd'
import queryString from 'query-string'
import { commonChangeHandler } from 'utils/antd'
import moment from 'moment'
import HzBreadcrumb from 'components/HzBreadcrumb'
import './component.scss'
import StepOne from './children/stepOne/component'
import StepTwo from './children/stepTwo/component'
import StepThree from './children/stepThree/component'
import StepFour from './children/stepFour/component'
import StepFive from './children/stepFive/component'


class CreateOrEditFrom extends React.Component {
  constructor(props) {

    super(props)
    this.state = {
      currentStep: 0,
      currentId: window.localStorage.getItem('_currentId'),
      stepOneObj: {
        "financingQuota": undefined,
        "institutionId": undefined,
        "proMajorAreaF": undefined,
        "proMajorAreaS": undefined,
        "proStoreLeader": undefined,
        "proStorePrincipal": undefined,
        "proSupIndustry": undefined,
        "projectStatus": undefined,
        "putDate": undefined,
        "reportProCode": undefined,
        "reportProName": undefined,
        "reportProStatus": undefined,
        "variety": undefined,
        "varietyOther": undefined,
        timeLimit: undefined
      },
      stepTwoObj: {
        "buildCircle": undefined,
        "buildDesc": undefined,
        "buildProcess": undefined,
        "compCase": undefined,
        "compCaseOther": undefined,
        "endTime": undefined,
        "financDesc": undefined,
        "foreignCapital": undefined,
        "govSubsidy": undefined,
        "openPubAccount": undefined,
        "otherFund": undefined,
        "otherMoney": undefined,
        "otherPersonalBusiness": undefined,
        "otherSupChainProd": undefined,
        "ownedFund": undefined,
        "personalCapital": undefined,
        "principal": undefined,
        "privateLiability": undefined,
        "psId": undefined,
        "publicDept": undefined,
        "raiseMoney": undefined,
        "startTime": undefined,
        "totalMoney": undefined,
        "weightiness": undefined,
        totals: undefined,
        compCaseArr: []
      },
      stepThreeObj: {
        "businessLimit": undefined,
        "coopSituation": undefined,
        "coopSituationDesc": undefined,
        "coopYear": undefined,
        "coopYearDesc": undefined,
        "createUser": undefined,
        "cusName": undefined,
        "fundsCase": undefined,
        "grade": undefined,
        "lawsuit": undefined,
        "list": [
          {
            "audit": undefined,
            "auditDesc": undefined,
            "capital": undefined,
            "id": undefined,
            "income": undefined,
            "liability": undefined,
            "majorYear": undefined,
            "netProfit": undefined,
            "psId": undefined,
            "topicId": undefined
          }
        ],
        "majorFund": undefined,
        "majorProdCase": undefined,
        "paymentSource": undefined,
        "psId": undefined,
        "stockholder": undefined
      },
      stepFourObj: {
        "progress": undefined,
        "psId": undefined,
        "reportDate": undefined
      },
      stepFiveObj: {
        "description": undefined,
        "outTime": undefined,
        "psId": undefined,
        "reason": undefined
      }
    }
    this.queryObj = queryString.parse(props.location.search)
    this.operation = this.queryObj.operation
    switch (this.operation) {
      case 'create':
        this.state.operationCnName = '添加';
        break
      case 'edit':
        this.state.operationCnName = '编辑';
        break
      default:
    }
    this.id = this.queryObj.id
  }


  stepClick = (num) => {
    if (num === 1) {
      if (this.state.currentStep === 0) {
        let params = Object.assign({}, this.state.stepOneObj)
        params.putDate = params.putDate && params.putDate.format('YYYY-MM-DD')
        if (this.operation === 'edit') {
          this.props.updateOneDetail(params, payload => {
            this.setState({
              currentStep: this.state.currentStep + num
            })
          })
        } else {
          if (window.localStorage.getItem('_currentId')) {
            params.id = window.localStorage.getItem('_currentId')
            this.props.updateOneDetail(params, payload => {
              this.setState({
                currentStep: this.state.currentStep + num
              })
            })
          } else {
            this.props.saveOneDetail(params, payload => {
              window.localStorage.setItem('_currentId', payload.data)
              this.setState({ currentId: payload.data })
              this.setState({
                currentStep: this.state.currentStep + num
              })
            })
          }

        }

      }
      if (this.state.currentStep === 1) {
        let params = Object.assign({}, this.state.stepTwoObj)
        params.compCase = params.compCaseArr.join(',')
        if (this.operation === 'edit') {
          this.props.updateTwoDetail(params, () => {
            this.setState({
              currentStep: this.state.currentStep + num
            })
          })
        } else {
          params.psId = this.state.currentId
          this.props.saveTwoDetail(params, () => {
            this.setState({
              currentStep: this.state.currentStep + num
            })
          })
        }


      }

      if (this.state.currentStep === 2) {
        let params = Object.assign({}, this.state.stepThreeObj)
        params.psId = this.state.currentId
        params.list.forEach(item => {
          if (!item.psId) {
            item.psId = this.state.currentId
          }
        })

        if (this.operation === 'edit') {
          this.props.updateThreeDetail(params, () => {
            this.setState({
              currentStep: this.state.currentStep + num
            })
          })
        } else {
          this.props.saveThreeDetail(params, () => {
            this.setState({
              currentStep: this.state.currentStep + num
            })
          })
        }

      }

      if (this.state.currentStep === 3) {
        let params = Object.assign({}, this.state.stepFourObj)
        params.reportDate = params.reportDate && params.reportDate.format('YYYY-MM-DD')
        if (this.operation === 'edit') {
          this.props.updateFourDetail(params, () => {
            this.setState({
              currentStep: this.state.currentStep + num
            })
          })
        } else {
          params.psId = this.state.currentId
          this.props.saveFourDetail(params, () => {
            this.setState({
              currentStep: this.state.currentStep + num
            })
          })
        }

      }

      if (this.state.currentStep === 4) {
        let params = Object.assign({}, this.state.stepFiveObj)
        params.outTime = params.outTime && params.outTime.format('YYYY-MM-DD')
        if (this.operation === 'edit') {
          this.props.updateFiveDetail(params, () => {
            this.props.history.goBack()
          })
        } else {
          params.psId = this.state.currentId
          this.props.saveFiveDetail(params, () => {
            this.props.history.goBack()
          })
        }

      }

    }

    if (num === -1) {

      this.setState({ currentStep: this.state.currentStep + num })
    }

  }

  stepOneInputChange = (key, value) => {
    commonChangeHandler(this, 'stepOneObj', key, value)
  }

  stepTwoInputChange = (key, value) => {
    commonChangeHandler(this, 'stepTwoObj', key, value)
    setTimeout(() => {
      let totalMoney = parseInt(this.state.stepTwoObj.otherMoney || 0) + parseInt(this.state.stepTwoObj.raiseMoney || 0) + parseInt(this.state.stepTwoObj.principal || 0)
      let totals = parseInt(this.state.stepTwoObj.otherFund || 0) + parseInt(this.state.stepTwoObj.foreignCapital || 0) + parseInt(this.state.stepTwoObj.ownedFund || 0) + parseInt(this.state.stepTwoObj.govSubsidy || 0)
      commonChangeHandler(this, 'stepTwoObj', 'totalMoney', totalMoney)
      commonChangeHandler(this, 'stepTwoObj', 'totals', totals)
    }, 0)
  }

  stepThreeChange = (key, value) => {
    commonChangeHandler(this, 'stepThreeObj', key, value)
  }
  threeListChange = (index, key, value) => {
    let list = [...this.state.stepThreeObj.list]
    list[index][key] = value.target.value
    this.setState({ stepThreeObj: Object.assign(this.state.stepThreeObj, { list }) })
  }

  stepFourChange = (key, value) => {
    commonChangeHandler(this, 'stepFourObj', key, value)
  }

  stepFiveChange = (key, value) => {
    commonChangeHandler(this, 'stepFiveObj', key, value)
  }

  addTop = () => {
    let list = [...this.state.stepThreeObj.list]
    list.push({
      "audit": undefined,
      "auditDesc": undefined,
      "capital": undefined,
      "id": undefined,
      "income": undefined,
      "liability": undefined,
      "majorYear": undefined,
      "netProfit": undefined,
      "psId": undefined,
      "topicId": undefined
    })
    this.setState({ stepThreeObj: Object.assign(this.state.stepThreeObj, { list }) })
  }

  componentWillMount() {
    this.props.history.listen(() => {
      if (window.location.href.indexOf('projectReserve/createOrEdit') < 0) {
        window.localStorage.removeItem('_currentId')
      }
    })
    this.props.getQueryEnum()
    if (this.operation === 'edit') {
      this.props.getOneDetail(this.id, payload => {
        payload.putDate = payload.putDate?moment(payload.putDate):""
        this.setState({ stepOneObj: Object.assign(this.state.stepOneObj, payload) })
      })

      this.props.getTwoDetail(this.id, payload => {
        payload.compCaseArr = payload.compCase.split(',')
        this.setState({ stepTwoObj: Object.assign(this.state.stepTwoObj, payload) })
      })

      this.props.getThreeDetail(this.id, payload => {
        this.setState({ stepThreeObj: Object.assign(this.state.stepThreeObj, payload) })
      })

      this.props.getFourDetail(this.id, payload => {
        payload.reportDate = payload.reportDate && moment(payload.reportDate)
        this.setState({ stepFourObj: Object.assign(this.state.stepFourObj, payload) })
      })

      this.props.getFiveDetail(this.id, payload => {
        payload.outTime = payload.outTime && moment(payload.outTime)
        this.setState({ stepFiveObj: Object.assign(this.state.stepFiveObj, payload) })
      })

    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps({ orgDetail, queryEnum }) {

    if (orgDetail !== this.props.orgDetail) {

      // 日期转化为时间戳格式
      ['effectiveDate', 'expiryDate'].forEach(dateKey => {
        if (orgDetail[dateKey]) {
          orgDetail[dateKey] = moment(orgDetail[dateKey])
        }
      })
      this.setState({
        orgObj: { ...orgDetail }
      })
    }

    if (queryEnum !== this.props.queryEnum) {

    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className='project-reserve-create'>
        <HzBreadcrumb />
        <div className='step'>
          <div className={this.state.currentStep === 0 ? 'item active' : 'item'}>
            <div className='circle'>1</div>
            <div className='label'>分支行授信项目储备</div>
          </div>

          <div className='line'></div>

          <div className={this.state.currentStep === 1 ? 'item active' : 'item'}>
            <div className='circle'>2</div>
            <div className='label'>项目基本情况</div>
          </div>
          <div className='line'></div>

          <div className={this.state.currentStep === 2 ? 'item active' : 'item'}>
            <div className='circle'>3</div>
            <div className='label'>融资主体</div>
          </div>

          <div className='line'></div>
          <div className={this.state.currentStep === 3 ? 'item active' : 'item'}>
            <div className='circle'>4</div>
            <div className='label'>储备项目推进情况</div>
          </div>
          <div className='line'></div>
          <div className={this.state.currentStep === 4 ? 'item active' : 'item'}
            style={{
              position: 'relative',
              top: 5
            }}>
            <div className='circle'>5</div>
            <div className='label'>拟采取融资方案简述 (含期限、利率)</div>
          </div>

        </div>

        <div className='content'>
          <div style={{ display: this.state.currentStep === 0 ? 'block' : 'none' }}>
            <StepOne valueChange={this.stepOneInputChange}
              inputObj={this.state.stepOneObj}
              queryEnum={this.props.queryEnum}
              _operation={this.operation === 'edit'}
            />
          </div>
          <div style={{ display: this.state.currentStep === 1 ? 'block' : 'none' }}>
            <StepTwo
              valueChange={this.stepTwoInputChange}
              inputObj={this.state.stepTwoObj}
              queryEnum={this.props.queryEnum}
            />
          </div>
          <div style={{ display: this.state.currentStep === 2 ? 'block' : 'none' }}>
            <StepThree
              valueChange={this.stepThreeChange}
              inputObj={this.state.stepThreeObj}
              queryEnum={this.props.queryEnum}
              listChange={this.threeListChange}
              addTop={this.addTop}
            />
          </div>

          <div style={{ display: this.state.currentStep === 3 ? 'block' : 'none' }}>
            <StepFour
              valueChange={this.stepFourChange}
              inputObj={this.state.stepFourObj}
              queryEnum={this.props.queryEnum}
            />
          </div>
          <div style={{ display: this.state.currentStep === 4 ? 'block' : 'none' }}>
            <StepFive
              valueChange={this.stepFiveChange}
              inputObj={this.state.stepFiveObj}
              queryEnum={this.props.queryEnum}
            />
          </div>

          <div className='btn-group'>
            {this.state.currentStep !== 0 &&
              <div className='before cancel' onClick={() => {
                this.stepClick(-1)
              }}>上一步
            </div>
            }
            {this.state.currentStep !== 4 &&
              <div className='after confirm' onClick={() => {
                this.stepClick(1)
              }}>下一步
            </div>
            }
            {this.state.currentStep === 4 &&
              <div className='after confirm' onClick={() => {
                this.stepClick(1)
              }}>确定
            </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

const CreateOrEdit = Form.create()(CreateOrEditFrom)
export default CreateOrEdit
