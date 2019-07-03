import React from 'react'
import './component.scss'
import { Select, DatePicker, Input, Button } from 'antd'
import { sourceData } from './filterData'
import OwnInstitution from 'components/OwnInstitution'

const Option = Select.Option


class FilterPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      types: [],
      type: [], // 虽然只有一个，但是后端要求传数组
      institutionKeys: [],
      inputValue: '',
      startTimeObj: {},
      endTimeObj: {},

      isCustomerManager: null,
    }

    this.typeData = {}

    this.handleSourceChange = this.handleSourceChange.bind(this)
    this.handleTypeChange = this.handleTypeChange.bind(this)
    this.handleTimeChange = this.handleTimeChange.bind(this)
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this)
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this)
    this.handleInstitutionChange = this.handleInstitutionChange.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleSearchClick = this.handleSearchClick.bind(this)
    this.handleResetClick = this.handleResetClick.bind(this)
  }

  // 动态来源 change 事件
  handleSourceChange(value) {
    const { typeData } = this
    this.setState({
      types: typeData[value]
    })
  }
  // 动态类型 change 事件
  handleTypeChange(type) {
    this.setState({
      type: [ type ]
    })
  }

  // 推送时间范围 change 事件
  handleTimeChange(date, dateString) {
    this.setState({
      startTimeObj: {
        moment: date[0],
        dateString: dateString[0],
      },
      endTimeObj: {
        moment: date[1],
        dateString: dateString[1],
      }
    })
  }

  // 开始推送时间 change 事件
  handleStartTimeChange(date, dateString) {
    this.setState({
      startTimeObj: {
        moment: date,
        dateString: dateString,
      }
    })
  }

  // 结束推送时间 change 事件
  handleEndTimeChange(date, dateString) {
    this.setState({
      endTimeObj: {
        moment: date,
        dateString: dateString,
      }
    })
  }

  // 所属机构 change 事件
  handleInstitutionChange(institutionKeys) {
    this.setState({ institutionKeys })
  }

  // 输入框 change 事件
  handleInput(ev) {
    const inputValue = ev.target.value
    this.setState({ inputValue })
  }

  // 搜索按钮点击事件
  handleSearchClick() {
    const {
      type,
      startTimeObj,
      endTimeObj,
      inputValue,
      institutionKeys,
    } = this.state

    const { listType } = this.props

    // TODO: institution 拼错了，后端改不改？
    const insArr = []
    const _institutionKeys = institutionKeys.slice(0)
    _institutionKeys.forEach((keys, index) => {
      let keysArr = keys.split('-')
      keysArr.shift() // 弹出第一位的0
      keysArr.forEach((key) => {
        insArr.push(parseInt(key))
      })
    })
    const inistitutionIdFilter = [...new Set(insArr)]

    const filterObj = {
      keyWord: inputValue,
      typeKeyFilter: type,
      pageNo: 1,
      pageSize: 10,
      pushTimeFrom: startTimeObj.dateString,
      pushTimeTo: endTimeObj.dateString,
      inistitutionIdFilter,
    }

    if (listType === 'institutionDynamic') {
      this.props.deliverInstitutionDynamicFilter(filterObj)
      this.props.getInstitutionDynamicList(filterObj)
    } else if (listType === 'myDynamic') {
      this.props.deliverMyDynamicFilter(filterObj)
      this.props.getMyDynamicList(filterObj)
    } else {
      console.log('未传入指定的 listType（institutionDynamic or myDynamic ?）')
    }
  }

  // 重置按钮点击事件
  handleResetClick() {
    const { listType } = this.props

    this.setState({
      type: [],
      startTimeObj: {},
      endTimeObj: {},
      institutionKeys: [],
      inputValue: '',
    })

    if (listType === 'institutionDynamic') {
      this.props.deliverInstitutionDynamicFilter({})
    } else if (listType === 'myDynamic') {
      this.props.deliverMyDynamicFilter({})
    } else {
      console.log('未传入指定的 listType（institutionDynamic or myDynamic ?）')
    }
  }

  componentWillMount() {
    const isCustomerManager = localStorage.getItem('IS_CUSTOMER_MANAGER')
    this.setState({ isCustomerManager })
  }

  componentDidMount() {
    this.props.getDynamicType()
  }


  componentWillReceiveProps({ dynamicType }) {
    const data = dynamicType.data
    if (data.length > 0) {
      this.generateTypeData(data)
    }
  }

  // 组装 typeData
  generateTypeData(data) {
    const innerData = data.slice(0, 5)
    const outerData = data.slice(5)
    const typeData = {
      inner: innerData,
      outer: outerData,
    }
    this.typeData = typeData
  }


  render() {

    const {
      types,
      type,
      inputValue,
      startTimeObj,
      endTimeObj,
      isCustomerManager,
    } = this.state
    return (
      <div className='filter-panel-component'>

        <div className='first-row-container'>
          {/* 第一行 */}
          {/* 动态来源 start */}
          
          <Select
            style={
              isCustomerManager === '0' ?
              { width: 230 } : { width: 310 }
            }
            placeholder='动态来源'
            onChange={this.handleSourceChange}
          >
            {
              sourceData.map((source) => {
                return (
                  <Option key={source.key}>{source.value}</Option>
                )
              })
            }
          </Select>
          {/* 动态来源 end */}

          {/* 动态类型 start */}
          <Select
            style={
              isCustomerManager === '0' ?
              { width: 230, marginLeft: 10 } :
              { width: 310, marginLeft: 10 }
            }
            placeholder='动态类型'
            notFoundContent='请先选择动态来源'
            onChange={this.handleTypeChange}
            value={type[0]}
          >
            {
              types && types.map((type) => {
                return (
                  <Option key={type.objectKey}>{type.name}</Option>
                )
              })
            }
          </Select>
          {/* 动态类型 end */}

          {/* 推送时间 start */}
          <DatePicker
            style={
              isCustomerManager === '0' ?
              { width: 172, marginLeft: 10 } :
              { width: 190, marginLeft: 10 }
            }
            onChange={this.handleStartTimeChange}
            value={startTimeObj.moment}
            placeholder='开始时间'
          />

          <DatePicker
            style={
              isCustomerManager === '0' ?
              { width: 172,marginLeft: 10 } :
              { width: 190, marginLeft: 10 }
            }
            onChange={this.handleEndTimeChange}
            value={endTimeObj.moment}
            placeholder='结束时间'
          />

          {/* 推送时间 end */}

          {
            isCustomerManager === '0' ?
            <span className='institution-container'>
              <OwnInstitution
                handlePopupConfirm={this.handleInstitutionChange}
                ref='institution'
                btnStyle={{width: 190}}
              />
            </span> : null
          }
        </div>

        <div className='second-row-container'>
          {/* 第二行 */}
          <Input
            placeholder='请输入动态名称或客户名称'
            className='input'
            onChange={this.handleInput}
            value={inputValue}
          />

          <Button
            className='search-button'
            onClick={this.handleSearchClick}
          >搜索</Button>

          <span
            className='reset-button'
            onClick={this.handleResetClick}
          >重置</span>
        </div>

      </div>
    )
  }

}

export default FilterPanel
