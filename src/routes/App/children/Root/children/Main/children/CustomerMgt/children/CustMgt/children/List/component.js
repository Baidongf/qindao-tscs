import React from 'react'
import './component.scss'
import defaultSortIcon from './images/defaultSortIcon.png'
import descSortIcon from './images/descSortIcon.png'
import ascSortIcon from './images/ascSortIcon.png'
import AdvancedFilter from './Children/AdvancedFilter'
import SelectedTags from './Children/AdvancedFilter/children/SelectedTags'
import OwnInstitution from './Children/OwnInstitution'
import CustomerAssign from './Children/CustomerAssign'
import { Input, Button, Pagination } from 'antd'
import HzLink from 'components/HzLink'
import RecentBrowsePanel from 'components/RecentBrowsePanel'
import cities from 'config/city'



class CustomerList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      keyword: '',
      regCapitalOrder: 'desc', // desc降序(从大到小) | asc升序(从小到大)
      curentIcon: defaultSortIcon // 默认图标
    }

    this.pagination = {
      current: 1,
      pageSize: 10,
    }

    this.onChangeHandle = this.onChangeHandle.bind(this)
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this)
    this.searchHandler = this.searchHandler.bind(this)
    this.resetHandler = this.resetHandler.bind(this)
    this.sortByCapital = this.sortByCapital.bind(this)
    this.keywordChangeHandler = this.keywordChangeHandler.bind(this)
  }

  keywordChangeHandler(ev) {
    this.setState({ keyword: ev.target.value })
  }

  /**
   * @desc 按照接口要求组装数据
   * @param {已选省份的code} selectedProvinceCode
   * @param {已选城市的code} selectedCityCode
   * @param {已选区县的code} selectedAreaCode
   */
  handleProvinceAreaCodeData(
    selectedProvinceCode,
    selectedCityCode,
    selectedAreaCode,
  ) {

    const regCodeFilter = []

    // 处理省份和城市
    selectedProvinceCode.forEach(provinceCode => {
      regCodeFilter.push(provinceCode)
      const cityCodesOfProvince = Object.keys(cities[provinceCode])
      // 如果没选城市，需要把当前省份的全部城市code传递进去
      // 两个数组去重后的长度如果不变，说明已选中的城市中没有当前省份的城市，即：选择当前省份的全部城市和全部区县
      if (
        [...new Set([...cityCodesOfProvince, ...selectedCityCode])].length ===
        (cityCodesOfProvince.length + selectedCityCode.length)
      ) {
        regCodeFilter.push(...cityCodesOfProvince)
        cityCodesOfProvince.forEach(cityCode => {
          regCodeFilter.push(cityCode)
          const areaCodeOfCity = Object.keys(cities[cityCode])
          regCodeFilter.push(...areaCodeOfCity)
        })
      }
    })

    // 处理城市和区县
    selectedCityCode.forEach(cityCode => {
      regCodeFilter.push(cityCode)
      const areaCodeOfCity = Object.keys(cities[cityCode])
      // 两个数组去重后的长度如果不变，说明已选中的区县中没有当前城市的区县，即：选择当前城市的全部区县
      if (
        [...new Set([...areaCodeOfCity, ...selectedAreaCode])].length ===
        (areaCodeOfCity.length + selectedAreaCode.length)
      ) {
        regCodeFilter.push(...areaCodeOfCity)
      }
    })

    regCodeFilter.push(...selectedAreaCode)

    return regCodeFilter
  }

  /**
   *
   * @param {已选择的行业分类} industryCategory
   * @param {已选择的行业分类及其子分类} industryCategoryOptions
   */
  handleIndustryCategoryData(
    industryCategory,
    industryCategoryOptions
  ) {
    const industryCodeFilter = []

    if(industryCategory.length < 1){
      return []
    }
    industryCodeFilter.push(...industryCategory.slice(0, industryCategory.length - 1))

    const traverse = (item) => {
      const value = item.value
      industryCodeFilter.push(value)
      if (item.children && item.children.length > 0) {
        item.children.forEach(child => {
          traverse(child)
        })
      }
    }

    if (industryCategoryOptions.length > 0) {
      traverse(industryCategoryOptions[industryCategoryOptions.length - 1])
    }

    return industryCodeFilter
  }

  searchHandler() {
    const {
      institutionIds,
      openAccountTime,

      industryCategory,
      industryCategoryOptions,

      operateRange,
      operateStatus,
      registerTime,
      registerCapital,

      // 省份地区数据
      selectedProvinceCode,
      selectedCityCode,
      selectedAreaCode,
    } = this.props

    const industryCodeFilter = this.handleIndustryCategoryData(
      industryCategory,
      industryCategoryOptions
    )

    // 选择的地区code
    const regCodeFilter = this.handleProvinceAreaCodeData(
      selectedProvinceCode,
      selectedCityCode,
      selectedAreaCode
    )

    const obj = {
      isInterFilter: '0', //这里只查询行内客户列表
      pageNo: this.pagination.current,
      pageSize: this.pagination.pageSize,
      keyWord: this.state.keyword,
      regCapitalOrder: this.state.regCapitalOrder,

      institutionIds,

      // 高级筛选字段 done
      operateRange,
      registerCapital,
      openAccountTime,
      registerTime,
      operateStatus,

      // 所选地区数据
      regCodeFilter,

      // 行业分类
      industryCodeFilter,

      industryCategory,

    }

    // 根据 listType 的值，调用不同的接口
    const listType = this.props.listType || 'myCustomer'
    if (listType === 'institutionCustomer') {
      this.props.getInstitutionCustomerList(obj)
    } else if (listType === 'myCustomer') {
      this.props.getMyCustomerList(obj)
    }
  }

  onChangeHandle(page, pageSize) {
    this.pagination.current = page
    this.searchHandler()
  }

  handlePageSizeChange(page, pageSize) {
    this.pagination.pageSize = pageSize
    this.searchHandler()
  }

  // 重置所有筛选条件
  resetHandler() {
    this.setState({ keyword: '' }, () => {
      document.querySelector('#customer-search-input').value = ''
    })

    // 重置所属机构
    this.props.deliverInstitutionIds([])

    // 重置行业分类
    this.props.deliverIndustryCategory([])

    // 重置经营范围
    this.props.deliverOperateRange('')

    // 重置省份地区
    this.props.deliverSelectedProvince([])
    this.props.deliverSelectedProvinceCode([])
    this.props.deliverSelectedCity([])
    this.props.deliverSelectedCityCode([])
    this.props.deliverSelectedArea([])
    this.props.deliverSelectedAreaCode([])

    // 重置经营状态
    this.props.deliverOperateStatus({
      all: false,
      normal: false,
      renew: false,
      moveIn: false,
      moveOut: false,
      closed: false,
      cancel: false,
      revoke: false,
      clear: false,
    })

    // 重置开户时间
    this.props.deliverOpenAccountTime({
      startTime: {},
      endTime: {}
    })

    // 重置注册时间
    this.props.deliverRegisterTime({
      startTime: {},
      endTime: {},
    })

    // 重置注册成本
    this.props.deliverRegisterCapital({
      lower: '',
      upper: '',
    })
  }

  sortByCapital() {
    // 注册资本升序、降序
    const { regCapitalOrder } = this.state
    if (regCapitalOrder === 'desc') {
      this.setState({
        regCapitalOrder: 'asc',
        curentIcon: ascSortIcon,
     }, () => {
        this.searchHandler()
      })
    } else {
      this.setState({
        regCapitalOrder: 'desc',
        curentIcon: descSortIcon,
      }, () => {
        this.searchHandler()
      })
    }
  }

  /**
   * 金钱 千分号 处理法
   * @param {Number} num
   */
  formatNumberRgx(num) {
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  componentDidMount() {
    this.searchHandler()
  }

  shouldComponentUpdate({ custList, institutionCustomerList, myCustomerList }) {
    return (
      custList !== this.props.custList ||
      institutionCustomerList !== this.props.institutionCustomerList ||
      myCustomerList !== this.props.myCustomerList
    )
  }

  render() {
    const { listType, institutionCustomerList, myCustomerList } = this.props
    const { regCapitalOrder } = this.state
    // 根据 listType 决定渲染哪个客户列表
    let renderCustomerList = {}
    if (listType === 'institutionCustomer') {
      renderCustomerList = institutionCustomerList
    } else if (listType === 'myCustomer') {
      renderCustomerList = myCustomerList
    }

    let sort = 'normal'
    if (regCapitalOrder === 'desc') {
      sort='desc'
    } else if (regCapitalOrder === 'asc') {
      sort='asc'
    }

    return (
      <div className='custList-component'>
        <div className='custList-left'>
          <div className='filter-area'>
            <div className='filter-info'>
              <div className='inputs'>

                {
                  listType === 'institutionCustomer' ?
                    <OwnInstitution /> : null
                }

                <Input
                  id='customer-search-input'
                  placeholder='请输入客户名称和客户编号'
                  onChange={this.keywordChangeHandler}
                  style={
                    listType === 'institutionCustomer' ?
                      { width: 310 } : { width: 645 }
                  }
                />
              </div>
              <div className='buttons'>
                <Button type='primary' className='btn-item search-button' onClick={this.searchHandler}>搜索</Button>
                <Button className='btn-item' onClick={this.resetHandler.bind(this)}>重置</Button>
                {
                  listType === 'institutionCustomer' ?
                    <AdvancedFilter /> : null
                }
              </div>
            </div>
            <div className='filter-result'>
              <SelectedTags outOfModal={true} />
            </div>
          </div>
          <div className='result-area'>
            <div className='list-header clearfix'>
              <span className='total-area'>共<span className='total-num'>{renderCustomerList.total}</span>条客户信息</span>
              {/* <div className='btns' onClick={this.sortByCapital}>注册资本</div> */}
            </div>
            <div className='list-area'>
              <div className='list-title'>
                <span>客户</span>

                <span
                  className={`register-title ${
                    listType === 'myCustomer' ?
                      'last-title-column' : ''
                    }`}
                    onClick={this.sortByCapital}
                    >
                  注册资本(万)
                  <i className={`sort-icon ${sort}-icon`} />
                </span>

                {
                  listType === 'institutionCustomer' ?
                    <span className='operation-title'>操作</span> : null
                }

              </div>
              {
                renderCustomerList.total > 0 ?
                  renderCustomerList.data.map((item, index) => {
                    return (
                      <HzLink
                        to={`/root/main/customerMgt/custMgt/detail?companyKey=${item.objectKey}`}
                        key={item.objectKey}
                      >
                        <div className='list-detail'>

                          <div className='customer-detail'>
                            {/* <div className='customer-img'>
                            <img src={CustomerImg} alt='' width='98' height='98' />
                          </div> */}
                            <div className='customer-content'>
                              <div className='customer-name'>
                                <span>{item.name}</span>
                                {/* <span className='customer-id'>{item.code}</span> */}
                              </div>

                              <div className='customer-name'>
                                <span>{item.code}</span>
                              </div>

                              <div className='customer-info'>
                                <div>
                                  <span className='fixed-width'>法人代表：{item.legalPerson}</span>
                                  <span className='found-time'>
                                    企业成立时间：{item.regDate && item.regDate.substr(0, 10)}
                                  </span>
                                </div>
                                <div>
                                  <span className='fixed-width'>信用等级：{item.intCrdtLevel}</span>
                                  <span className='industry-sort'>国际行业分类：{item.industry}</span>
                                </div>
                                <div>办公地址：{item.officeAddress}</div>
                                <div className='manage-range' title={item.operRange}>经营范围：{item.operRange}</div>
                              </div>
                              <div className='customer-market'>
                                {
                                  item.tags.map((el) => <div className='listing-detail' title={el.name} key={item.objectKey}>{el.name}</div>)
                                }
                              </div>
                            </div>
                          </div>

                          <div
                            className={`register-detail ${
                              listType === 'myCustomer' ?
                                'last-detail-column' : ''
                              }`}
                          >{item.regCapital ? this.formatNumberRgx(item.regCapital / 10000) : '暂无'}</div>

                          {
                            listType === 'institutionCustomer' ?
                              <div className='operation-detail'>
                                <CustomerAssign
                                  companyKey={item.objectKey}
                                  companyName={item.name}
                                  companyCode={item.code}
                                />
                              </div> : null
                          }

                        </div>
                      </HzLink>
                    )
                  }) :
                  <div className='no-search-result-tips'>搜索无结果</div>
              }

              {
                renderCustomerList.total && renderCustomerList.total > 10 ?
                  <div className='cust-pagination'>
                    <Pagination
                      showQuickJumper
                      showSizeChanger
                      total={renderCustomerList.total}
                      pageSize={this.pagination.pageSize}
                      onChange={this.onChangeHandle}
                      onShowSizeChange={this.handlePageSizeChange}
                    />
                  </div> : null
              }
            </div>
          </div>
        </div>
        <div className='custList-right'>
          <RecentBrowsePanel />
        </div>
      </div>
    )
  }
}

export default CustomerList
