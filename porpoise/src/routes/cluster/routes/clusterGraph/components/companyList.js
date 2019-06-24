import React from 'react'
import SearchSuggested from 'components/SearchSuggested'
import { connect } from 'react-redux'
import { setSingleCompanyState } from 'actions/InitOperateBtn'
import {
  toggleCompanyFilterModal, changeClusterCompanyFilter, startFilter,
  getExchangeRate
} from '../modules/filterModal'
import './lib/forceStyle.css'
import './companyList.scss'
import './filterCard.scss'
import doraemon from 'services/utils'
import { selectCenterTreeNode, selectCenterClusterNode } from '../../../../../actions/Card'
import { getCompanyList, getGroupMembers } from '../modules/GroupRelationCard'
import SelectedFilters from './modals/components/selectedFilters'

class CompanyList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      companies: [],  // 企业列表
      isCardSelect: false,
      showFilterCard: false,
      selectObj: {},
      searchValue: '',
      showCompanyIndex: [false],
      renderIcon: false
    }

    this.companyList = []
    this.companyListCache = []
    this.singleCompanyName = ''
    this.noContentText = '正在获取数据中...'
    this.searchHandler = this.searchHandler.bind(this)
    this.showSingleCompany = this.showSingleCompany.bind(this)
    this.selectCenterClusterNode = this.selectCenterClusterNode.bind(this)
    this.toggleList = this.toggleList.bind(this)
    this.selectFilterItem = this.selectFilterItem.bind(this)
    this.getFilterResult = this.getFilterResult.bind(this)
    this.initFilterObj = this.initFilterObj.bind(this)
  }

  componentWillMount() {
    this.initFilterObj(false)
    this.setState({
      companies: this.props.companyList,
    })
    getExchangeRate()
  }

  initFilterObj(bol) {
    const { selectObj } = this.state
    selectObj['belongInner'] = -1
    this.setState({
      selectObj
    })
    this.noContentText = '正在获取数据中...'
    if (bol) {
      this.props.getCompanyList()
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.companyList !== nextProps.companyList) {
      this.setState({
        companies: nextProps.companyList
      })
      setTimeout(() => {
        this.setState({
          renderIcon: true
        })
      })
    }
    if (this.props.curNode !== nextProps.curNode) {
      this.getCurCompany(nextProps.curNode._id)
    }
    if (this.props.startFilterFlag !== nextProps.startFilterFlag) {
      this.startFilter()
    }
    if (this.props.singleCompany !== nextProps.singleCompany) {
      this.value = null
      this.setState({
        searchValue: ''
      })
      this.props.changeClusterCompanyFilter({})
    }
    // if (nextProps.renderChartStatus.status === 'success' && this.props.renderChartStatus.status === 'drawing') {
    // }
  }

  componentDidUpdate(prevProps) {
    if (this.props.renderChartStatus.status === 'success') {
      if (this.companyList.length && Object.keys(this.props.clusterChartData).length && !this.props.curNode.name) {
        this.selectCompanyOnload()
      }
    }
  }

  startFilter = () => {
    this.companyList = this.companyListCache
    this.searchCompanyList(this.value)  // 先执行一遍搜索，然后再筛选
    this.filterCompanies()
    this.setState({
      companies: this.companyList
    })
  }

  filterCompanies = () => {
    const { filters } = this.props
    const condition = filters.condition
    if (!condition || !Object.keys(filters.condition).length) {
      return
    }
    this.companyList = this.companyList.filter((company) => {
      let isMatch = true
      if ('belong_inner' in condition) {
        isMatch = doraemon.isTrue(company.belong_inner) === condition.belong_inner
        if (!isMatch) return false
      }
      if ('city' in condition) {
        isMatch = condition.city.some((c) => company.city && company.city.includes(c))
        if (!isMatch) return false
      }
      if ('industry' in condition) {
        // console.log(condition, company)
        // company.industry_labels = [{ 'recordId': '1165c88b2ac55679194b60912b5908f6', 'name': 'A农、林、牧、渔业', 'industryLabel': [{ 'name': '畜牧业', 'recordId': 'fc214c6ba3e0d0aba94d6be26c04265f' }, { 'name': '农、林、牧、渔专业及辅助性活动', 'recordId': 'c2bdb6c919dd8cc9dea980db117187d2' }] }]
        isMatch = false
        if (company.industry_labels) {
          for (let key in condition.industry) {
            if (condition.industry[key].includes(company.industry_labels[0].industryLabel[0].name)) {
              isMatch = true
            }
            if (condition.industry[key] === '全部' && key === company.industry_labels[0].name) {
              isMatch = true
            }
          }
        }

        if (!isMatch) return false
      }
      if ('business_status' in condition) {
        isMatch = condition.business_status.some((status) =>
          company.business_status && company.business_status.includes(status))
        if (!isMatch) return false
      }
      if ('registered_date' in condition) {
        isMatch = !(condition.registered_date.min > company.registered_date ||
          condition.registered_date.max < company.registered_date)
        if (!company.registered_date) {
          isMatch = false
        }
        if (!isMatch) return false
      }
      if ('registered_capital' in condition) {
        let capital = company.registered_capital
        const unit = company.registered_capital_unit
        if (unit !== '元') {
          let exchangeMap = localStorage.getItem('exchange_rate_map')
          if (exchangeMap) {
            exchangeMap = JSON.parse(exchangeMap)
            capital *= (exchangeMap[unit] || 1)
          }
        }
        isMatch = !(condition.registered_capital.min > capital ||
          condition.registered_capital.max < capital)
        if (!company.registered_capital) {
          isMatch = false
        }
        if (!isMatch) return false
      }
      if ('is_listed' in condition) {
        isMatch = doraemon.isTrue(company.is_listed) === condition.is_listed
        if (!isMatch) return false
      }
      if ('linked_types' in condition) {
        if (condition.linked_types.every((type) => !company.linkedTypes || !company.linkedTypes.includes(type))) {
          return false
        }
      }
      return isMatch
    })
    if (!this.companyList.length) {
      this.noContentText = '未能找到相关企业'
    }
  }

  getUrlObj(name) {
    let urlObj = {}
    window.location.search.split('?')[1].split('&').forEach((d) => {
      let key = d.split('=')[0]
      let value = d.split('=')[1]
      urlObj[key] = value
    })
    return decodeURIComponent(urlObj[name])
  }

  selectCompanyOnload() {
    const company = this.getUrlObj('company')
    if (this.companyList.length && company !== 'undefined') {
      const newList = this.companyList.filter((item) => item.company.indexOf(company) > -1)
      const id = newList[0]['_id']
      this.selectCenterClusterNode(id)
    }
  }

  searchHandler(value = '') {
    this.value = value

    this.searchCompanyList(value)
    this.filterCompanies()
    this.setState({
      companies: this.companyList
    })
  }

  searchCompanyList(name) {
    if (name && name.value !== '') {
      this.companyList = this.companyList.filter((item) => {
        if (this.props.singleCompany) {
          return item.name.indexOf(name.value) > -1
        }
        return item.company && item.company.indexOf(name.value) > -1
      })
      this.total = this.companyList.length
      if (!this.companyList.length) {
        this.noContentText = '未能找到该企业'
      }
    } else {
      this.companyList = this.companyListCache
      this.total = this.companyListCache.length
    }
  }

  selectCenterClusterNode(vertex) {
    if (!this.props.singleCompany) {
      this.props.selectCenterClusterNode(vertex._id)
    } else {
      this.getCurCompany(vertex._id)
      this.props.selectCenterTreeNode(vertex)
    }
  }

  // 点击图谱节点高亮卡片
  getCurCompany(id) {
    if (this.companyList.length) {
      const body = document.querySelector('.result-body')
      const card = body.querySelectorAll('.company-card')
      let height = 0
      let curIndex = 0
      this.companyList.forEach((element, index) => {
        if (element._id === id) {
          curIndex = index
        }
      })
      for (let i = 0; i < card.length; i++) {
        card[i].className = 'relation-card company-card'
        if (i < curIndex) {
          height += card[i].clientHeight
        }
      }
      card[curIndex].className = 'relation-card company-card active'
      body.scrollTop = height
    }
  }

  showSingleCompany(e, name) {
    e.preventDefault()
    e.stopPropagation()
    if (this.props.getSingleCompanyChart) {
      this.props.getSingleCompanyChart(name)
      this.props.setSingleCompanyState(true)
    }
  }
  toggleList() {
    this.setState({
      showFilterCard: !this.state.showFilterCard
    })
  }
  selectFilterItem(parentKey, curKey) {
    const selectObj = this.state.selectObj
    selectObj[parentKey] = curKey
    this.setState({
      selectObj
    })
  }
  getFilterResult() {
    const selectObj = this.state.selectObj
    const reduxLocation = this.props.reduxLocation
    selectObj['groupName'] = reduxLocation.query.group_name
    selectObj['groupType'] = reduxLocation.query.type
    this.props.getGroupMembers(selectObj)
    this.noContentText = '未能找到相关企业'
  }
  getFilterCard() {
    const filterCard = (
      <div className='filter-body'>
        <div className='filter-body-top' onClick={() => this.toggleList()}>
          <span className='filter-body-tit'>
            筛选条件
          </span>
          <i className={this.state.showFilterCard ? 'i-arrow-up' : 'i-arrow-up i-arrow-down'}></i>
        </div>
        {
          this.state.showFilterCard ? (
            <div className='filter-body-bottom'>
              {this.getFilterBody()}
            </div>
          ) : ''
        }
      </div>
    )
    return (
      <div className='filter-box'>
        {filterCard}
      </div>
    )
  }

  onChange = (newFilters) => {
    this.props.changeClusterCompanyFilter(newFilters)
    setTimeout(this.props.startFilter)  // 下一事件循环，让开始筛选时，使用的是 newFilters
  }

  // 渲染已选条件面板初始状态 & 已筛选条件
  getFilterBody = () => {
    const { filters } = this.props
    const filterOptionProps = {
      filters: filters,
      onChange: this.onChange
    }

    if (!Object.keys(filters).length) {
      return (
        <button className='add-filter-btn no-content-add-btn' onClick={this.showFilterModal}>
          添加筛选
        </button>
        // <p className='no-filter-msg'>未添加筛选条件，<a className='add-filter-btn' onClick={this.showFilterModal}>添加</a></p>
      )
    } else {
      return (
        <div className='filter-result-card clearfix'>
          <div className='filter-result-container'>
            <SelectedFilters {...filterOptionProps} />
          </div>
          <button className='clear-all-filter-btn' onClick={this.clearAllFilter}>清空</button>
          <button className='add-filter-btn' onClick={this.showFilterModal}>筛选</button>
        </div>
      )
    }
  }

  showFilterModal = () => {
    this.props.toggleCompanyFilterModal(true)
  }

  clearAllFilter = () => {
    this.onChange({})
  }

  changeSearchSuggested = (v) => {
    this.setState({
      searchValue: v
    })
  }

  getRenderMoreIcon (ref, index) {
    if (this.refs[ref] && this.refs[ref].offsetHeight > 72) {
      return (
        <i
          className={`arrow-icon  ${this.state.showCompanyIndex[index] ? 'arrow-up-icon' : 'arrow-down-icon'}`}
          onClick={(ele) => this.showMoreCompanyDetail(ref, ele, index)} >
          <div className='arrow-icon-tip'>查看更多</div>
        </i>
      )
    } else {
      return ''
    }
  }

  showMoreCompanyDetail (ref, e, index) {
    e.stopPropagation()
    let showIndex = this.state.showCompanyIndex
    showIndex[index] = !showIndex[index]
    this.setState({
      showCompanyIndex: showIndex
    })
    // console.log(showIndex)
  }

  getCompanyList () {
    const { companies } = this.state
    const { singleCompany, companyList } = this.props
    this.companyListCache = companyList
    this.companyList = companies
    this.total = companies.length // 没用到

    const navType = this.getUrlObj('type')
    const titleClassName = singleCompany ? 'full' : 'left'
    const companyItem = (
      <div className='result-body scroll-style'>
        {
          this.companyList.length ? (
            this.companyList.map((d, index) => {
              const belongInner = d.belong_inner === 'true' ? (<span className='special belong-inner'>授信客户</span>) : ''
              const blackList = doraemon.isBlacklist(d) ? (<span className='special black-list'>黑名单</span>) : ''
              const listedPlate = (d.public_sector) ? (<span className='special listed-plate'>{d.public_sector}</span>) : ''
              const exceptionCompany = (d.is_abnormal_status) ? (<span className='special bexception-company'>异常经营</span>) : ''
              const sameGroup = d.is_match ? (<span className='special belong-inner'>同一集团</span>) : ''
              const actualController = d.actual_controller === 'true' ? (<span className='special actual-controller'>控股股东</span>) : ''
              const controlShareholder = d.control_shareholder === 'true' ? (<span className='special control-shareholder'>疑似实际控制人</span>) : ''
              return (
                <div className='relation-card company-card'
                  key={d.company || d.name}
                  onClick={() => this.selectCenterClusterNode(d)}>
                  <div className='relation-name company-name clearfix '>
                    {
                      (
                        <div className={titleClassName}>
                          <span
                            className={`name company-list-name ${(d.company && d.company.length > 28) || (d.name && d.name.length > 28) ? 'eclipse-name' : ''}`}>
                            {d.company || d.name}
                          </span>
                          <br />
                          {belongInner}
                          {blackList}
                          {listedPlate}
                          {exceptionCompany}
                          {sameGroup}
                          {actualController}
                          {controlShareholder}
                        </div>
                      )
                    }
                    {
                      navType === 'profile_enterprise_info' && !singleCompany ? (
                        <a className='change-sight' onClick={(e) => this.showSingleCompany(e, d.company)} />
                      ) : null
                    }
                  </div>
                  <div className='relation-info company-info'>
                    <p className='position'>
                      <i />
                      地区：{d.city || '--'}
                    </p>
                    <p className='belong'>
                      <i />
                      行业：<a title={d.industry}>{d.industry || '--'}</a>
                    </p>
                    <p className='boss'>
                      <i />
                      法定代表人：{d.legal_man || '--'}
                    </p>
                  </div>
                  <div className={`company-detail  ${this.state.showCompanyIndex[index] ? 'more-detail' : ''}`}>
                    <i className='company-detail-icon' />
                    <div className={'company-detail-content'} ref={`company_detail_content_${index}`}>
                      经营范围：{d.business_scope}
                    </div>
                  </div>
                  {this.state.renderIcon && this.getRenderMoreIcon(`company_detail_content_${index}`, index)}
                </div>
              )
            })
          ) : (
              <div className='no-content'>{this.noContentText}</div>
            )
        }
      </div>
    )

    return (
      <div className={this.state.showFilterCard ? 'result-list short' : 'result-list'}>
        {companyItem}
      </div>
    )
  }

  render () {
    const singleCompany = this.props.singleCompany
    return (
      <div className='tab-list scroll-style'>
        <SearchSuggested
          selectSuggest={(value) => this.searchHandler({ value })}
          placeholder='输入企业名进行查询'
          searchHandler={(value) => this.searchHandler({ value })}
          value={this.state.searchValue}
          handleChange={this.changeSearchSuggested}
        />
        {this.getCompanyList()}
        {this.getFilterCard()}
      </div>
    )
  }
}

/**
 * map state to props
 * @param {Object} state state
 * @return {Object} state
 */
const mapStateToProps = function (state) {
  return {
    curNode: state.curNode,
    companyListObj: state.companyListObj,
    clusterChartData: state.clusterChartData,
    reduxLocation: state.location,
    renderChartStatus: state.renderChartStatus,
    filters: state.clusterCompanyFilter.filters,
    startFilterFlag: state.clusterCompanyFilter.startFilterFlag
  }
}

/**
 * map dispatch to props
 * @param {Object} dispatch dispatch
 * @return {Object} action
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setSingleCompanyState: (v) => dispatch(setSingleCompanyState(v)),
    getCompanyList: () => dispatch(getCompanyList()),
    selectCenterClusterNode: (id) => dispatch(selectCenterClusterNode(id)),
    selectCenterTreeNode: (id) => dispatch(selectCenterTreeNode(id)),
    getGroupMembers: (filterObj) => dispatch(getGroupMembers(filterObj)),
    toggleCompanyFilterModal: (visible) => dispatch(toggleCompanyFilterModal(visible)),
    changeClusterCompanyFilter: (filters) => dispatch(changeClusterCompanyFilter(filters)),
    startFilter: () => dispatch(startFilter())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyList)
