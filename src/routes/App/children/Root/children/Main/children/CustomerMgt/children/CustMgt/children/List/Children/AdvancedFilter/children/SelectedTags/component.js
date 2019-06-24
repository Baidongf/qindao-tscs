import React from 'react'
import { Tag } from 'antd'
import cities from 'config/city'

class SelectedTags extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    // 经营状态文案
    this.operateStatusWordings = {
      all: '全部',
      normal: '正常',
      renew: '存续',
      moveIn: '迁入',
      moveOut: '迁出',
      closed: '停业',
      cancel: '撤销',
      revoke: '吊销',
      clear: '清算',
    }

    // 全国省市区数据
    this.cities = cities

    this.handleIndustryTagClose = this.handleIndustryTagClose.bind(this)
    this.handleOperateRangeTagClose = this.handleOperateRangeTagClose.bind(this)
    this.handleCapitalTagClose = this.handleCapitalTagClose.bind(this)
    this.isShowComponent = this.isShowComponent.bind(this)
  }

  // 点击经营状态标签的'x'
  handleOperateStatusTagClose(closedStatus = '') {
    const { operateStatus } = this.props
    this.props.deliverOperateStatus(
      Object.assign({}, operateStatus, { [`${closedStatus}`]: false })
    )
  }

  /**
   * @desc 开户时间标签关闭
   * @param {string} closedType 开始时间(‘begin’) or 结束时间('end')
   */
  handleOpenAccountTagClose(closedType = '') {
    const { openAccountTime } = this.props
    const result = Object.assign({}, openAccountTime, { [`${closedType}`]: {} })
    this.props.deliverOpenAccountTime(result)
  }

  // 删除行业分类标签
  handleIndustryTagClose() {
    this.props.deliverIndustryCategory([])
  }

  /**
   * @desc 注册时间标签关闭
   * @param {string} closedType 开始时间(‘begin’) or 结束时间('end')
   */
  handleRegisterTagClose(closedType = '') {
    const { registerTime } = this.props
    this.props.deliverRegisterTime(
      Object.assign({}, registerTime, { [`${closedType}`]: {} })
    )
  }


  // 经营范围标签关闭
  handleOperateRangeTagClose() {
    this.props.deliverOperateRange('')
  }

  /**
   * @desc 注册资本标签关闭
   * @param {string} 上限(upper) or 下限(lower)
   */
  handleCapitalTagClose(closedType = '') {
    const { registerCapital } = this.props
    this.props.deliverRegisterCapital(
      Object.assign({}, registerCapital, { [`${closedType}`]: '' })
    )
  }


  /**
   * @desc 省份地区标签关闭
   * @param {string} provinceCode 省份代码，不可为空
   * @param {string} cityCode 城市代码
   * @param {areaCode} areaCode 区/县代码
   */
  handleProvinceTagClose(provinceCode, cityCode, areaCode) {
    if (!!!provinceCode) {
      console.error(`省份代码 provinceCode 不能为空, 当前值为: ${provinceCode}`)
      return false
    }

    // 用传入的 code 数量决定需要在 store 中删除的对应项
    if (provinceCode && cityCode && areaCode) {
      this.unSelectArea(provinceCode, cityCode, areaCode)
    } else if (provinceCode && cityCode) {
      this.unSelectCity(provinceCode, cityCode)
    } else if (provinceCode) {
      this.unSelectProvince(provinceCode)
    } else {
      console.error('参数错误')
    }
  }

  /**
   * @desc 取消勾选传入code对应的省份
   * @param {string} provinceCode
   */
  unSelectProvince(provinceCode) {
    const {
      selectedProvince,
      selectedProvinceCode,
    } = this.props

    const _selectedProvince = selectedProvince.slice(0)
    const _selectedProvinceCode = selectedProvinceCode.slice(0)

    const length = _selectedProvinceCode.length
    for (let i = 0; i < length; i++) {
      if (_selectedProvinceCode[i] === provinceCode) {
        _selectedProvinceCode.splice(i, 1)
        _selectedProvince.splice(i, 1)
        i = length
      }
    }

    this.props.deliverSelectedProvince(_selectedProvince)
    this.props.deliverSelectedProvinceCode(_selectedProvinceCode)
  }

  /**
   * @desc 取消勾选传入code对应的城市
   * @param {string} provinceCode
   * @param {string} cityCode
   */
  unSelectCity(provinceCode, cityCode) {
    const {
      selectedCity,
      selectedCityCode,
    } = this.props

    const _selectedCity = selectedCity.slice(0)
    const _selectedCityCode = selectedCityCode.slice(0)

    const length = _selectedCityCode.length
    for (let i = 0; i < length; i++) {
      if (_selectedCityCode[i] === cityCode) {
        _selectedCityCode.splice(i, 1)
        _selectedCity.splice(i, 1)
        i = length
      }
    }

    this.props.deliverSelectedCity(_selectedCity)
    this.props.deliverSelectedCityCode(_selectedCityCode)
  }

  /**
   * @desc 取消勾选传入code对应的区县
   * @param {string} provinceCode
   * @param {string} cityCode
   * @param {string} areaCode
   */
  unSelectArea(provinceCode, cityCode, areaCode) {
    const {
      selectedArea,
      selectedAreaCode,
    } = this.props

    const _selectedArea = selectedArea.slice(0)
    const _selectedAreaCode = selectedAreaCode.slice(0)

    const length = _selectedAreaCode.length
    for (let i = 0; i < length; i++) {
      if (_selectedAreaCode[i] === areaCode) {
        _selectedAreaCode.splice(i, 1)
        _selectedArea.splice(i, 1)
        i = length
      }
    }

    this.props.deliverSelectedArea(_selectedArea)
    this.props.deliverSelectedAreaCode(_selectedAreaCode)
  }

  // 是否展示当前组件
  // 用户至少选择了一个筛选条件
  isShowComponent() {
    const {
      openAccountTime,
      industryCategory,
      operateRange,
      operateStatus,
      registerTime,
      registerCapital,
      selectedProvince,
    } = this.props

    const openAccountTimeKeys = Object.keys(openAccountTime)
    const operateStatusKeys = Object.keys(operateStatus)
    const registerTimeKeys = Object.keys(registerTime)
    const registerCapitalKeys = Object.keys(registerCapital)

    if (
      !!openAccountTime[openAccountTimeKeys[0]].dateString ||
      !!openAccountTime[openAccountTimeKeys[1]].dateString
    ) {
      return true
    } else if (
      !!registerTime[registerTimeKeys[0]].dateString ||
      !!registerTime[registerTimeKeys[1]].dateString
    ) {
      return true
    } else if (
      !!registerCapital[registerCapitalKeys[0]] ||
      !!registerCapital[registerCapitalKeys[1]]
    ) {
      return true
    } else if (
      !!operateRange ||
      industryCategory.length > 0 ||
      selectedProvince.length > 0
    ) {
      return true
    }

    const length = operateStatusKeys.length
    for (let i = 0; i < length; i++) {
      if (operateStatus[operateStatusKeys[i]]) {
        i = length
        return true
      }
    }

    return false
  }

  render() {
    const { operateStatusWordings, cities } = this
    const {
      openAccountTime,
      industryCategory,
      operateRange,
      operateStatus,
      registerTime,
      registerCapital,
      outOfModal,

      selectedProvince,
      selectedProvinceCode,
      selectedCity,
      selectedCityCode,
      selectedArea,
      selectedAreaCode,

    } = this.props

    const openAccountTimeKeys = Object.keys(openAccountTime)
    const operateStatusKeys = Object.keys(operateStatus)
    const registerTimeKeys = Object.keys(registerTime)
    const registerCapitalKeys = Object.keys(registerCapital)

    return (
      this.isShowComponent() ? (
        <div className='select-row'>
          <div
            className={`filter-description ${outOfModal ? 'clear-padding' : ''}`}
          >已选条件</div>

          <div
            className='filter-content tags-container'
          >
            {
              // 渲染开户时间标签
              openAccountTimeKeys.map((value) => {
                if (!!openAccountTime[value].dateString) {
                  return (
                    <Tag
                      closable
                      className={`status-tag ${outOfModal ? 'outer-status-tag' : ''}`}
                      key={`open-${value}`}
                      onClose={this.handleOpenAccountTagClose.bind(this, value)}
                    >
                      开户时间({value === 'startTime' ? '起' : '止'}): {openAccountTime[value].dateString}
                    </Tag>
                  )
                } else {
                  return null
                }
              })
            }

            {
              // 渲染行业分类
              industryCategory.length > 0 ?
                <Tag
                  closable
                  onClose={this.handleIndustryTagClose}
                  className={`status-tag ${outOfModal ? 'outer-status-tag' : ''}`}
                >{`行业分类: ${industryCategory}`}</Tag> : null
            }

            {
              // 渲染经营范围标签
              !!operateRange ?
                <Tag
                  closable
                  className={`status-tag ${outOfModal ? 'outer-status-tag' : ''}`}
                  onClose={this.handleOperateRangeTagClose}
                >{`经营范围: ${operateRange}`}</Tag> : null
            }

            {
              // 渲染经营状态标签
              operateStatusKeys.map((value) => {
                if (operateStatus[value]) {
                  return (
                    <Tag
                      closable
                      onClose={this.handleOperateStatusTagClose.bind(this, value)}
                      key={`status-${value}`}
                      className={`status-tag ${outOfModal ? 'outer-status-tag' : ''}`}
                    >
                      经营状态: {operateStatusWordings[value]}
                    </Tag>)
                } else {
                  return null
                }
              })
            }

            {
              // 渲染注册时间标签
              registerTimeKeys.map((value) => {
                if (!!registerTime[value].dateString) {
                  return (
                    <Tag
                      closable
                      className={`status-tag ${outOfModal ? 'outer-status-tag' : ''}`}
                      key={`reg-${value}`}
                      onClose={this.handleRegisterTagClose.bind(this, value)}
                    >
                      注册时间({value === 'startTime' ? '起' : '止'}): {registerTime[value].dateString}
                    </Tag>
                  )
                } else {
                  return null
                }
              })
            }

            {
              // 渲染注册资本标签
              registerCapitalKeys.map((value) => {
                if (!!registerCapital[value]) {
                  return (
                    <Tag
                      closable
                      className={`status-tag ${outOfModal ? 'outer-status-tag' : ''}`}
                      key={`capital-${value}`}
                      onClose={this.handleCapitalTagClose.bind(this, value)}
                    >
                      注册资本({value === 'upper' ? '上限' : '下限'}):
                          {`${registerCapital[value]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </Tag>
                  )
                } else {
                  return null
                }
              })
            }

            {
              // 渲染省份地区标签
              selectedProvinceCode.map((provinceCode, provinceIndex) => {
                // 当前省份的所有城市的key
                const cityKeys = Object.keys(cities[provinceCode])
                const citySetLength = Array.from(
                  new Set([...cityKeys, ...selectedCityCode])
                ).length
                const cityTotalLength = cityKeys.length + selectedCityCode.length
                if (citySetLength < cityTotalLength) {
                  // 两个数组去重后的长度如果减小了，说明有重复项
                  // 即：在所选的城市中，包含当前省份的城市
                  return selectedCityCode.map((cityCode, cityIndex) => {
                    // 当前城市的所有的区/县
                    const areaKeys = Object.keys(cities[cityCode])
                    const areaSetLength = Array.from(
                      new Set([...areaKeys, ...selectedAreaCode])
                    ).length
                    const areaTotalLength = areaKeys.length + selectedAreaCode.length
                    if (areaSetLength < areaTotalLength) {
                      return selectedAreaCode.map((areaCode, areaIndex) => {
                        if (
                          !cityKeys.includes(cityCode) ||
                          !areaKeys.includes(areaCode)
                        ) {
                          return null
                        }
                        return (
                          <Tag
                            closable
                            className={`status-tag ${outOfModal ? 'outer-status-tag' : ''}`}
                            key={`location-${provinceCode}-${cityCode}-${areaCode}`}
                            onClose={this.handleProvinceTagClose.bind(this, provinceCode, cityCode, areaCode)}
                          >
                            省份地区: {
                              `${selectedProvince[provinceIndex]}
                            ${selectedCity[cityIndex]}
                            ${selectedArea[areaIndex]}`
                            }
                          </Tag>
                        )
                      })
                    } else {
                      if (!cityKeys.includes(cityCode)) {
                        return null
                      }
                      return (
                        <Tag
                          closable
                          className={`status-tag ${outOfModal ? 'outer-status-tag' : ''}`}
                          key={`location-${provinceCode}-${cityCode}`}
                          onClose={this.handleProvinceTagClose.bind(this, provinceCode, cityCode, '')}
                        >
                          省份地区: {
                            `${selectedProvince[provinceIndex]}
                          ${selectedCity[cityIndex]}`
                          }
                        </Tag>
                      )
                    }
                  })
                } else {
                  return (
                    <Tag
                      closable
                      className={`status-tag ${outOfModal ? 'outer-status-tag' : ''}`}
                      key={`location-${provinceCode}`}
                      onClose={this.handleProvinceTagClose.bind(this, provinceCode, '', '')}
                    >
                      省份地区: {`${selectedProvince[provinceIndex]}`}
                    </Tag>
                  )
                }
              })
            }
          </div>
        </div>
      ) : <div style={{ height: '10px' }}></div>
    )
  }
}

export default SelectedTags
