import React from 'react'
import cities from 'config/city'

class ProvinceArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      citiesData: {},                    // 用来展示的城市数据
      areasData: {},                     // 用来展示的区/县数据

      isSelectAllProvince: true,         // 是否选择全部省份
      selectAllCitiedProvinceCodes: [],  // 选择“全部城市”的省份
      selectAllAreaCityCodes: [],        // 选择“全部区/县”的城市

      currentSelectedProvinceCode: null, // 当前选中的省份（用于控制展示的城市）
      currentSelectedCityCode: null,     // 当前选中的城市（用于控制展示的区县）
      isProvinceAreaExpanded: false,
    }

    this.toggleProvinceExpand = this.toggleProvinceExpand.bind(this)
    this.selectProvince = this.selectProvince.bind(this)
    this.selectCity = this.selectCity.bind(this)
    this.selectArea = this.selectArea.bind(this)
    this.isItemSelected = this.isItemSelected.bind(this)
  }

  /**
   * @desc 省份地区，展开/收起
   */
  toggleProvinceExpand(ev) {
    ev.stopPropagation()
    const { isProvinceAreaExpanded } = this.state
    this.setState({
      isProvinceAreaExpanded: !isProvinceAreaExpanded
    })
  }

  /**
   * @desc 选择省份
   */
  selectProvince(ev) {
    ev.stopPropagation()
    const target = ev.target
    if (target.nodeName === 'SPAN') {
      const {
        selectedProvince,
        selectedProvinceCode,
      } = this.props

      const provinceKey = target.getAttribute('code')
      const province = target.getAttribute('province')

      let citiesData = cities[provinceKey]
      // 数据容错处理(没有数据的省-台湾 或 直辖市)
      if (
        !!!citiesData ||
        Object.keys(citiesData).length < 3
      ) {
        citiesData = {}
      }

      if (provinceKey === 'allProvince') {
        // 选择全部省份
        this.selectAllProvince()
      } else if (this.isItemSelected(provinceKey, selectedProvinceCode)) {
        // 选择的是单个省份，且已选过
        this.setState({
          citiesData,
          areasData: {},
          currentSelectedProvinceCode: provinceKey,
        })
      } else {
        // 选择的是单个省份，但没选过
        this.setState({
          isSelectAllProvince: false,
          citiesData,
          areasData: {},
          currentSelectedProvinceCode: provinceKey,
        })

        this.props.deliverSelectedProvince([...selectedProvince, province])
        this.props.deliverSelectedProvinceCode([...selectedProvinceCode, provinceKey])
      }
    }
  }

  /**
   * @desc 选择市
   */
  selectCity(ev) {
    ev.stopPropagation()
    const target = ev.target
    if (target.nodeName === 'SPAN') {
      const {
        selectAllCitiedProvinceCodes,
        currentSelectedProvinceCode,
      } = this.state

      const {
        selectedCity,
        selectedCityCode,
      } = this.props

      const cityKey = target.getAttribute('code')
      const city = target.getAttribute('city')

      let areasData = cities[cityKey]
      if (
        !!!areasData ||
        Object.keys(areasData).length < 1
      ) {
        areasData = {}
      }

      if (cityKey === 'allCity') {
        // 选择全部城市
        this.selectAllCity()
      } else if (this.isItemSelected(cityKey, selectedCityCode)) {
        // 选择单个城市，且选过
        this.setState({
          areasData,
          currentSelectedCityCode: cityKey,
        })
      } else {
        // 选择单个城市，且没选过
        // 将当前省份置为“没有选择全部城市的省份”
        const _selectAllCitiedProvinceCodes = selectAllCitiedProvinceCodes.slice(0)
        const length = _selectAllCitiedProvinceCodes.length
        for (let i = 0; i < length; i++) {
          if (_selectAllCitiedProvinceCodes[i] === currentSelectedProvinceCode) {
            _selectAllCitiedProvinceCodes.splice(i, 1)
            i = length
          }
        }
        this.setState({
          areasData,
          currentSelectedCityCode: cityKey,
          selectAllCitiedProvinceCodes: _selectAllCitiedProvinceCodes,
        })
        this.props.deliverSelectedCity([...selectedCity, city])
        this.props.deliverSelectedCityCode([...selectedCityCode, cityKey])
      }
    }
  }

  /**
   * @desc 选择区县
   */
  selectArea(ev) {
    ev.stopPropagation()
    const target = ev.target
    if (target.nodeName === 'SPAN') {
      const {
        currentSelectedCityCode,
        selectAllAreaCityCodes,
      } = this.state

      const {
        selectedArea,
        selectedAreaCode,
      } = this.props

      const areaKey = target.getAttribute('code')
      const area = target.getAttribute('area')

      if (areaKey === 'allArea') {
        this.selectAllArea()
      } else if (!this.isItemSelected(areaKey, selectedAreaCode)) {
        // 选择单个区/县，且没选过
        // 将当前城市置为“没有选择全部区县的城市”
        const _selectAllAreaCityCodes = selectAllAreaCityCodes.slice(0)
        const length = _selectAllAreaCityCodes.length
        for (let i = 0; i < length; i++) {
          if (_selectAllAreaCityCodes[i] === currentSelectedCityCode) {
            _selectAllAreaCityCodes.splice(i, 1)
            i = length
          }
        }
        this.setState({
          selectAllAreaCityCodes: _selectAllAreaCityCodes,
        })
        this.props.deliverSelectedArea([...selectedArea, area])
        this.props.deliverSelectedAreaCode([...selectedAreaCode, areaKey])
      }
    }
  }

  /**
   * @desc 判断是否被选过
   * @param itemCode 待检查项
   * @param selectedItems 所有被选过的元素
   */
  isItemSelected(item, selectedItems) {
    return selectedItems.includes(item)
  }


  // 选择所有省份
  selectAllProvince() {
    /**
     * 1. 当前选中的所有省份/城市/区县 清空
     * 2. 用来展示的城市/区县数据 清空
     * 3. 标记选择全部省份
     * 4. 当前选中省份置空
     */
    this.setState({
      citiesData: {},
      areasData: {},
      isSelectAllProvince: true,
      currentSelectedProvinceCode: null,
    })
    this.props.deliverSelectedProvince([])
    this.props.deliverSelectedProvinceCode([])
    this.props.deliverSelectedCity([])
    this.props.deliverSelectedCityCode([])
    this.props.deliverSelectedArea([])
    this.props.deliverSelectedAreaCode([])
  }

  // 选择所有城市
  selectAllCity() {
    /**
     * 1. 清空当前省份下选择的所有城市
     * 2. 清空当前省份下选择的所有区县
     * 3. 标记当前省份为“选择所有城市的省份”
     * 4. 清空展示用的区县数据
     */
    const {
      currentSelectedProvinceCode,
      selectAllCitiedProvinceCodes,
    } = this.state

    const {
      selectedCity,
      selectedCityCode,
      selectedArea,
      selectedAreaCode,
    } = this.props

    const _selectedCity = selectedCity.slice(0)
    const _selectedCityCode = selectedCityCode.slice(0)
    const _selectedArea = selectedArea.slice(0)
    const _selectedAreaCode = selectedAreaCode.slice(0)

    // 生成扁平化的城市数据和区县数据（当前省）
    const allCitiesOfProvince = cities[currentSelectedProvinceCode]
    const cityKeys = Object.keys(allCitiesOfProvince)
    let allAreasOfProvince = {}
    cityKeys.forEach((key) => {
      const areasPerCity = cities[key]
      allAreasOfProvince = {
        ...allAreasOfProvince,
        ...areasPerCity,
      }
    })

    // 清空当前省份下所选的城市
    const cityLength = _selectedCityCode.length
    for (let i = 0; i < cityLength; i++) {
      let code = _selectedCityCode[i]
      if (!!allCitiesOfProvince[code]) {
        _selectedCityCode.splice(i, 1)
        _selectedCity.splice(i, 1)
        i--
      }
    }

    // 清空当前省份下选择的所有区县
    const areaLength = _selectedAreaCode.length
    for (let j = 0; j < areaLength; j++) {
      let code = _selectedAreaCode[j]
      if (!!allAreasOfProvince[code]) {
        _selectedAreaCode.splice(j, 1)
        _selectedArea.splice(j, 1)
        j--
      }
    }

    this.setState({
      areasData: {},
      selectAllCitiedProvinceCodes: [
        ...selectAllCitiedProvinceCodes,
        currentSelectedProvinceCode,
      ],
    })
    this.props.deliverSelectedCity(_selectedCity)
    this.props.deliverSelectedCityCode(_selectedCityCode)
    this.props.deliverSelectedArea(_selectedArea)
    this.props.deliverSelectedAreaCode(_selectedAreaCode)
  }

  // 选择所有区县
  selectAllArea() {
    /**
     * 1. 清空当前省份下选择的所有区县
     * 2. 标记当前城市为“选择所有区县的城市”
     */
    const {
      currentSelectedCityCode,
      selectAllAreaCityCodes,
    } = this.state

    const {
      selectedArea,
      selectedAreaCode,
    } = this.props

    // 生成扁平化的区县数据（当前省）
    let allAreasOfCity = cities[currentSelectedCityCode]

    const _selectedArea = selectedArea.slice(0)
    const _selectedAreaCode = selectedAreaCode.slice(0)

    // 清空当前省份下选择的所有区县
    const areaLength = _selectedAreaCode.length
    for (let j = 0; j < areaLength; j++) {
      let code = _selectedAreaCode[j]
      if (!!allAreasOfCity[code]) {
        _selectedAreaCode.splice(j, 1)
        _selectedArea.splice(j, 1)
        j--
      }
    }

    this.setState({
      selectAllAreaCityCodes: [
        ...selectAllAreaCityCodes,
        currentSelectedCityCode,
      ],
    })
    this.props.deliverSelectedArea(_selectedArea)
    this.props.deliverSelectedAreaCode(_selectedAreaCode)
  }

  render() {

    const province = cities['86']
    const provinceKeys = Object.keys(province)

    const {
      citiesData,
      areasData,

      isSelectAllProvince,
      currentSelectedProvinceCode,
      currentSelectedCityCode,
      selectAllCitiedProvinceCodes,
      selectAllAreaCityCodes,

      isProvinceAreaExpanded,
    } = this.state

    const {
      selectedProvinceCode,
      selectedCityCode,
      selectedAreaCode,
    } = this.props


    const cityKeys = Object.keys(citiesData)
    const areaKeys = Object.keys(areasData)

    return (
      <div className='province-list'>
        <div
          className='filter-description'
        >省份地区</div>

        <div
          className='filter-content'
        >
          {/* 省份 */}
          <div
            className={`province-container ${isProvinceAreaExpanded ? 'expanded' : ''}`}
            onClick={this.selectProvince}
          >
            <div className='subs left-container'>
              <span
                className={`city-tag ${isSelectAllProvince ? 'selected' : ''}`}
                code='allProvince'
                province='allProvince'
              >全部</span>
            </div>

            <div className='subs right-container'>
              {
                // 省份标签
                provinceKeys.map((key) => {
                  return (
                    <span
                      className={`city-tag ${this.isItemSelected(key, selectedProvinceCode) ? 'selected' : ''}`}
                      key={key}
                      code={key}
                      province={province[key]}
                    >
                      {province[key]}
                    </span>
                  )
                })
              }
            </div>

            <div
              className='subs fold-container'
              onClick={this.toggleProvinceExpand}
            >
              {
                isProvinceAreaExpanded ?
                '收起' : '展开'
              }
              <span
                className={`triangle ${isProvinceAreaExpanded ? 'reverse' : ''}`}
                onClick={this.toggleProvinceExpand}
              ></span>
            </div>
          </div>

          {/* 市 */}
          {
            cityKeys.length > 0 ?
              <div className='city-container' onClick={this.selectCity}>
                <div className='subs left-container'>
                  <span
                    className={`city-tag ${this.isItemSelected(
                      currentSelectedProvinceCode,
                      selectAllCitiedProvinceCodes
                    ) ? 'selected' : ''}`}
                    code='allCity'
                    city='allCity'
                  >全部</span>
                </div>

                <div className='subs right-container'>
                  {
                    // 城市标签
                    cityKeys.map((key) => {
                      return (
                        <span
                          className={`city-tag ${this.isItemSelected(key, selectedCityCode) ? 'selected' : ''}`}
                          key={key}
                          code={key}
                          city={citiesData[key]}
                        >
                          {citiesData[key]}
                        </span>
                      )
                    })
                  }
                </div>
              </div> : null
          }

          {/* 区 */}
          {
            areaKeys.length > 0 ?
              <div className='area-container' onClick={this.selectArea}>
                <div className='subs left-container'>
                  <span
                    className={`city-tag ${this.isItemSelected(
                      currentSelectedCityCode,
                      selectAllAreaCityCodes
                    ) ? 'selected' : ''}`}
                    code='allArea'
                    area='allArea'
                  >全部</span>
                </div>

                <div className='subs right-container'>
                  {
                    // 区县标签
                    areaKeys.map((key) => {
                      return (
                        <span
                          className={`city-tag ${this.isItemSelected(key, selectedAreaCode) ? 'selected' : ''}`}
                          key={key}
                          code={key}
                          area={areasData[key]}
                        >
                          {areasData[key]}
                        </span>
                      )
                    })
                  }
                </div>

              </div> : null
          }

        </div>
      </div>
    )
  }
}

export default ProvinceArea
