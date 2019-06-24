import { get, post } from 'utils/dataAccess/axios'
import { combineReducers } from 'redux'


const IS_MOCK =  0 ? '/mock': ''
const GET_CUST_LIST = 'GET_CUST_LIST' // 客户列表
const GET_INSTITUTION_CUSTOMER_LIST = 'GET_INSTITUTION_CUSTOMER_LIST' // 机构客户列表
const GET_MY_CUSTOMER_LIST = 'GET_MY_CUSTOMER_LIST' // 我的客户列表

const GET_MANAGER_TREE = 'GET_MANAGER_TREE'
const GET_MANAGER_BY_ID = 'GET_MANAGER_BY_ID'
const DELIVER_COMPANY_KEY = 'DELIVER_COMPANY_KEY'

const GET_CUSTOMER_DETAIL_BASIC = 'GET_MANAGER_DETAIL_BASIC' // 客户详情-基本信息
const GET_CUSTOMER_DETAIL_ACCOUNT = 'GET_MANAGER_DETAIL_ACCOUNT' // 客户详情-账户信息
const GET_CUSTOMER_DETAIL_FINANCE = 'GET_MANAGER_DETAIL_FINANCE' // 客户详情-财务信息
const GET_ASSET_LIST = 'GET_ASSET_LIST' // 客户详情 - 财务报表 - 资产负债表
const GET_CASH_LIST = 'GET_CASH_LIST' // 客户详情 - 财务报表 - 资产现金表
const GET_PROFIT_LIST = 'GET_PROFIT_LIST' // 客户详情 - 财务报表 - 利润表

const DELIVER_INSTITUTION_IDS = 'DELIVER_INSTITUTION_IDS'

// 高级筛选相关
const DELIVER_OPEN_ACCOUNT_TIME = 'DELIVER_OPEN_ACCOUNT_TIME'
const DELIVER_INDUSTRY_CATEGORY = 'DELIVER_INDUSTRY_CATEGORY'
const DELIVER_INDUSTRY_CATEGORY_OPTIONS = 'DELIVER_INDUSTRY_CATEGORY_OPTIONS'
const DELIVER_OPERATE_RANGE = 'DELIVER_OPERATE_RANGE'
const DELIVER_OPERATE_STATUS = 'DELIVER_OPERATE_STATUS'
const DELIVER_REGISTER_TIME = 'DELIVER_REGISTER_TIME'
const DELIVER_REGISTER_CAPITAL = 'DELIVER_REGISTER_CAPITAL'
const DELIVER_SELECTED_PROVINCE = 'DELIVER_SELECTED_PROVINCE'
const DELIVER_SELECTED_CITY = 'DELIVER_SELECTED_CITY'
const DELIVER_SELECTED_AREA = 'DELIVER_SELECTED_AREA'
const DELIVER_SELECTED_PROVINCE_CODE = 'DELIVER_SELECTED_PROVINCE_CODE'
const DELIVER_SELECTED_CITY_CODE = 'DELIVER_SELECTED_CITY_CODE'
const DELIVER_SELECTED_AREA_CODE = 'DELIVER_SELECTED_AREA_CODE'

const DISTRIBUTE_CUSTOMER = 'DISTRIBUTE_CUSTOMER' // 客户分配

const operateStatusWordings = {
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



// -------------- Actions -------------------

// 客户管理 － 获取客户列表信息
export const getCustList = (filterObj = {}) => {
  let bodyData = {
    // 查询需要的相关参数
    pageNo: filterObj.pageNo,
    pageSize: filterObj.pageSize,
    keyWord: filterObj.keyWord,
  }

  /**
   * 由于后端校验逻辑不严谨，以下字段的值为空时，不传递该字段
  */
  if (!!filterObj.regCapitalOrder) {
    bodyData.regCapitalOrder = filterObj.regCapitalOrder
  }
  if (!!filterObj.institutionIds && filterObj.institutionIds.length > 0) {
    bodyData.institutionId = filterObj.institutionIds
  }
  if (!!filterObj.isInterFilter) {
    bodyData.isInterFilter = filterObj.isInterFilter
  }
  if (!!filterObj.operateRange) {
    bodyData.operRangeFilter = filterObj.operateRange
  }
  if (!!filterObj.registerCapital.lower) {
    bodyData.regCapitalFrom = filterObj.registerCapital.lower + ''
  }
  if (!!filterObj.registerCapital.upper) {
    bodyData.regCapitalTo = filterObj.registerCapital.upper + ''
  }
  if (!!filterObj.registerTime.startTime.dateString) {
    bodyData.regDateFrom = filterObj.registerTime.startTime.dateString
  }
  if (!!filterObj.registerTime.endTime.dateString) {
    bodyData.regDateTo = filterObj.registerTime.endTime.dateString
  }
  if (!!filterObj.openAccountTime.startTime.dateString) {
    bodyData.openDateFrom = filterObj.openAccountTime.startTime.dateString
  }
  if (!!filterObj.openAccountTime.endTime.dateString) {
    bodyData.openDateTo = filterObj.openAccountTime.endTime.dateString
  }
  if (!!filterObj.regCodeFilter && filterObj.regCodeFilter.length > 0) {
    bodyData.regCodeFilter = filterObj.regCodeFilter
  }
  if (!!filterObj.industryCodeFilter && filterObj.industryCodeFilter.length > 0) {
    bodyData.industryCodeFilter = filterObj.industryCodeFilter
  }

  // 经营状态处理
  const operateStatusArr = []
  if (!filterObj.operateStatus.all) {
    // 如果没有勾选全部，传递勾选的；如果勾选了全部，则不传该字段
    const statusKeys = Object.keys(filterObj.operateStatus)
    statusKeys.forEach((key) => {
      if (filterObj.operateStatus[key]) {
        operateStatusArr.push(operateStatusWordings[key])
      }
    })
    bodyData.operStatusFilter = operateStatusArr
  }

  const postConfig = {
    url:  `${IS_MOCK}/crm-fd/api/customer/search`,
    actionType: GET_CUST_LIST,
    bodyData: bodyData,
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取客户列表失败'
    }
  }
  return post(postConfig)
}

// 客户管理 - 获取机构客户列表
export const getInstitutionCustomerList = (filterObj = {}) => {
  let bodyData = {
    // 查询需要的相关参数
    pageNo: filterObj.pageNo,
    pageSize: filterObj.pageSize,
    keyWord: filterObj.keyWord,
  }

  /**
   * 由于后端校验逻辑不严谨，以下字段的值为空时，不传递该字段
  */
  if (!!filterObj.regCapitalOrder) {
    bodyData.regCapitalOrder = filterObj.regCapitalOrder
  }
  if (!!filterObj.institutionIds && filterObj.institutionIds.length > 0) {
    bodyData.institutionId = filterObj.institutionIds
  }
  if (!!filterObj.isInterFilter) {
    bodyData.isInterFilter = filterObj.isInterFilter
  }
  if (!!filterObj.operateRange) {
    bodyData.operRangeFilter = filterObj.operateRange
  }
  if (!!filterObj.registerCapital.lower) {
    bodyData.regCapitalFrom = filterObj.registerCapital.lower + ''
  }
  if (!!filterObj.registerCapital.upper) {
    bodyData.regCapitalTo = filterObj.registerCapital.upper + ''
  }
  if (!!filterObj.registerTime.startTime.dateString) {
    bodyData.regDateFrom = filterObj.registerTime.startTime.dateString
  }
  if (!!filterObj.registerTime.endTime.dateString) {
    bodyData.regDateTo = filterObj.registerTime.endTime.dateString
  }
  if (!!filterObj.openAccountTime.startTime.dateString) {
    bodyData.openDateFrom = filterObj.openAccountTime.startTime.dateString
  }
  if (!!filterObj.openAccountTime.endTime.dateString) {
    bodyData.openDateTo = filterObj.openAccountTime.endTime.dateString
  }
  if (!!filterObj.regCodeFilter && filterObj.regCodeFilter.length > 0) {
    bodyData.regCodeFilter = filterObj.regCodeFilter
  }
  if (!!filterObj.industryCodeFilter && filterObj.industryCodeFilter.length > 0) {
    bodyData.industryCodeFilter = filterObj.industryCodeFilter
  }

  // 经营状态处理
  const operateStatusArr = []
  if (!filterObj.operateStatus.all) {
    // 如果没有勾选全部，传递勾选的；如果勾选了全部，则不传该字段
    const statusKeys = Object.keys(filterObj.operateStatus)
    statusKeys.forEach((key) => {
      if (filterObj.operateStatus[key]) {
        operateStatusArr.push(operateStatusWordings[key])
      }
    })
    bodyData.operStatusFilter = operateStatusArr
  }

  const postConfig = {
    url:  `${IS_MOCK}/crm-fd/api/customer/institutionSearch`,
    actionType: GET_INSTITUTION_CUSTOMER_LIST,
    bodyData: bodyData,
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取机构客户列表失败'
    }
  }
  return post(postConfig)
}

// 客户管理 - 获取我的客户列表
export const getMyCustomerList = (filterObj = {}) => {
  let bodyData = {
    // 查询需要的相关参数
    pageNo: filterObj.pageNo,
    pageSize: filterObj.pageSize,
    keyWord: filterObj.keyWord,
  }

  /**
   * 由于后端校验逻辑不严谨，以下字段的值为空时，不传递该字段
  */
  if (!!filterObj.regCapitalOrder) {
    bodyData.regCapitalOrder = filterObj.regCapitalOrder
  }
  if (!!filterObj.institutionIds && filterObj.institutionIds.length > 0) {
    bodyData.institutionId = filterObj.institutionIds
  }
  if (!!filterObj.isInterFilter) {
    bodyData.isInterFilter = filterObj.isInterFilter
  }
  if (!!filterObj.operateRange) {
    bodyData.operRangeFilter = filterObj.operateRange
  }
  if (!!filterObj.registerCapital.lower) {
    bodyData.regCapitalFrom = filterObj.registerCapital.lower + ''
  }
  if (!!filterObj.registerCapital.upper) {
    bodyData.regCapitalTo = filterObj.registerCapital.upper + ''
  }
  if (!!filterObj.registerTime.startTime.dateString) {
    bodyData.regDateFrom = filterObj.registerTime.startTime.dateString
  }
  if (!!filterObj.registerTime.endTime.dateString) {
    bodyData.regDateTo = filterObj.registerTime.endTime.dateString
  }
  if (!!filterObj.openAccountTime.startTime.dateString) {
    bodyData.openDateFrom = filterObj.openAccountTime.startTime.dateString
  }
  if (!!filterObj.openAccountTime.endTime.dateString) {
    bodyData.openDateTo = filterObj.openAccountTime.endTime.dateString
  }
  if (!!filterObj.regCodeFilter && filterObj.regCodeFilter.length > 0) {
    bodyData.regCodeFilter = filterObj.regCodeFilter
  }
  if (!!filterObj.industryCodeFilter && filterObj.industryCodeFilter.length > 0) {
    bodyData.industryCodeFilter = filterObj.industryCodeFilter
  }

  // 经营状态处理
  const operateStatusArr = []
  if (!filterObj.operateStatus.all) {
    // 如果没有勾选全部，传递勾选的；如果勾选了全部，则不传该字段
    const statusKeys = Object.keys(filterObj.operateStatus)
    statusKeys.forEach((key) => {
      if (filterObj.operateStatus[key]) {
        operateStatusArr.push(operateStatusWordings[key])
      }
    })
    bodyData.operStatusFilter = operateStatusArr
  }

  const postConfig = {
    url:  `${IS_MOCK}/crm-fd/api/customer/userSearch`,
    actionType: GET_MY_CUSTOMER_LIST,
    bodyData: bodyData,
    successConfig: {
      callback: (payload) => {

      }
    },
    failConfig: {
      message: '获取我的客户列表失败'
    }
  }
  return post(postConfig)
}

// 获取用户权限内的机构树
export function getManagerTree(callback) {
  return get({
    url: '/crm-fd/api/auth/institution/managerTree',
    actionType: GET_MANAGER_TREE,
    successConfig: {
      callback
    },
    failConfig: {
      message: '获取机构失败'
    }
  })
}

//根据机构ID获取客户经理列表
export function getManagerListById(id, callback) {
  return get({
    url:`/crm-fd/api/user/findManager/${id}`,
    actionType: GET_MANAGER_BY_ID,
    successConfig: {
      callback
    },
    failConfig: {
      message: '获取机构失败'
    }
  })
}

export function deliverCompanyKeyToStore(companyKey) {
  return (dispatch) => {
    dispatch({
      type: DELIVER_COMPANY_KEY,
      data: companyKey,
    })
  }
}

// 客户详情 - 获取客户基本信息
export function getCustomerDetailBasic(companyKey, callback) {
  return get({
    url: `/crm-fd/api/customer/basic/general/${companyKey}`,
    actionType: GET_CUSTOMER_DETAIL_BASIC,
    successConfig: { callback },
    failConfig: { message: '获取客户基本信息失败' },
  })
}

// 客户详情 - 获取账户信息
export function getCustomerDetailAccount(companyKey, callback) {
  return get({
    url: `/crm-fd/api/customer/basic/account/${companyKey}`,
    actionType: GET_CUSTOMER_DETAIL_ACCOUNT,
    successConfig: { callback },
    failConfig: { message: '获取账户信息失败' },
  })
}

// 客户详情 - 获取财务信息(财务报表的列表)
export function getCustomerDetailFinance(bodyData, callback) {
  return post({
    url: `/crm-fd/api/finance/findAll`,
    bodyData,
    actionType: GET_CUSTOMER_DETAIL_FINANCE,
    successConfig: { callback },
    failConfig: { message: '获取财务列表失败' }
  })
}

/**
 * @desc 客户详情 - 财务报表 - 获取资产负债表
 * @param companyKeyFilter {String} 公司(客户)主键
 * @param reptPeriodFilter {String} 报表周期 月/季/年
 * @param reptTermMinorFIlter {String} 报表期次
 * @param callback {Function} 成功回调
 */
export function getAssetList(companyKeyFilter, reptPeriodFilter, reptTermMinorFilter, callback) {
  return post({
    url: '/crm-fd/api/finance/findAsset',
    bodyData: {
      companyKeyFilter,
      reptPeriodFilter,
      reptTermMinorFilter,
    },
    actionType: GET_ASSET_LIST,
    successConfig: { callback },
    failConfig: { message: '获取负债表失败' }
  })
}

/**
 * @desc 客户详情 - 财务报表 - 获取资产现金表
 * @param companyKeyFilter {String} 公司(客户)主键
 * @param reptPeriodFilter {String} 报表周期 月/季/年
 * @param reptTermMinorFilter {String} 报表期次
 * @param callback {Function} 成功回调
 */
export function getCashList(companyKeyFilter, reptPeriodFilter, reptTermMinorFilter, callback) {
  return post({
    url: '/crm-fd/api/finance/findCash',
    bodyData: {
      companyKeyFilter,
      reptPeriodFilter,
      reptTermMinorFilter,
    },
    actionType: GET_CASH_LIST,
    successConfig: { callback },
    failConfig: { message: '获取现金表失败' }
  })
}

/**
 * @desc 客户详情 - 财务报表 - 获取利润表
 * @param companyKeyFilter {String} 公司(客户)主键
 * @param reptPeriodFilter {String} 报表周期 月/季/年
 * @param reptTermMinorFilter {String} 报表期次
 * @param callback {Function} 成功回调
 */
export function getProfitList(companyKeyFilter, reptPeriodFilter, reptTermMinorFilter, callback) {
  return post({
    url: '/crm-fd/api/finance/findProfit',
    bodyData: {
      companyKeyFilter,
      reptPeriodFilter,
      reptTermMinorFilter,
    },
    actionType: GET_PROFIT_LIST,
    successConfig: { callback },
    failConfig: { message: '获取利润表失败' }
  })
}


// 传递所属机构id
export function deliverInstitutionIds(institutionIds) {
  return (dispatch) => {
    dispatch({
      type: DELIVER_INSTITUTION_IDS,
      data: institutionIds,
    })
  }
}


// 高级筛选相关
// ===================================
// 传递开户时间
export function deliverOpenAccountTime(openAccountTime) {
  return (dispatch) => {
    dispatch({
      type: DELIVER_OPEN_ACCOUNT_TIME,
      data: openAccountTime,
    })
  }
}

// 传递行业分类
export function deliverIndustryCategory(category) {
  return (dispatch) => {
    dispatch({
      type: DELIVER_INDUSTRY_CATEGORY,
      data: category,
    })
  }
}

// 传递行业分类的所有选项
export function deliverIndustryCategoryOptions(categoryOptions) {
  return (dispatch) => {
    dispatch({
      type: DELIVER_INDUSTRY_CATEGORY_OPTIONS,
      data: categoryOptions
    })
  }
}

// 传递经营范围
export function deliverOperateRange(range) {
  return (dispatch) => {
    dispatch({
      type: DELIVER_OPERATE_RANGE,
      data: range,
    })
  }
}

// 传递经营状态
export function deliverOperateStatus(status) {
  return (dispatch) => {
    dispatch({
      type: DELIVER_OPERATE_STATUS,
      data: status,
    })
  }
}

// 传递注册时间
export function deliverRegisterTime(registerTime) {
  return (dispatch) => {
    dispatch({
      type: DELIVER_REGISTER_TIME,
      data: registerTime,
    })
  }
}

// 传递注册资本
export function deliverRegisterCapital(registerCapital) {
  return (dispatch) => {
    dispatch({
      type: DELIVER_REGISTER_CAPITAL,
      data: registerCapital,
    })
  }
}

/**
 * @desc 传递省份地区（省）
 * @param {Array} provinces
 */
export function deliverSelectedProvince(provinces) {
  return (dispatch) => {
    dispatch({
      type: DELIVER_SELECTED_PROVINCE,
      data: provinces,
    })
  }
}

/**
 * @desc 传递省份地区代码（省）
 * @param {Array} provinces
 */
export function deliverSelectedProvinceCode(codes) {
  return (dispatch) => {
    dispatch({
      type: DELIVER_SELECTED_PROVINCE_CODE,
      data: codes,
    })
  }
}

/**
 * @desc 传递省份地区（市）
 * @param {Array} cities
 */
export function deliverSelectedCity(cities) {
  return (dispatch) => {
    dispatch({
      type: DELIVER_SELECTED_CITY,
      data: cities,
    })
  }
}

/**
 * @desc 传递省份地区代码（市）
 * @param {Array} cities
 */
export function deliverSelectedCityCode(codes) {
  return (dispatch) => {
    dispatch({
      type: DELIVER_SELECTED_CITY_CODE,
      data: codes,
    })
  }
}

/**
 * @desc 传递省份地区（区/县）
 * @param {Array} areas
 */
export function deliverSelectedArea(areas) {
  return (dispatch) => {
    dispatch({
      type: DELIVER_SELECTED_AREA,
      data: areas,
    })
  }
}

/**
 * @desc 传递省份地区代码（区/县）
 * @param {Array} areas
 */
export function deliverSelectedAreaCode(codes) {
  return (dispatch) => {
    dispatch({
      type: DELIVER_SELECTED_AREA_CODE,
      data: codes,
    })
  }
}


// 客户分配
export function distributeCustomer(companyKey, data, callback = () => {}) {
  return post({
    url: `/crm-fd/api/allocationCustomer/updateCustomer/${companyKey}`,
    actionType: DISTRIBUTE_CUSTOMER,
    bodyData: data,
    successConfig: {
      callback
    },
    failConfig: {
      message: '分配客户失败'
    }
  })
}





// -------------------- Reducers ---------------------

export function custList (previousState = {data: []}, action) {
  if (action.type === GET_CUST_LIST) {
    return action.data
  } else {
    return previousState
  }
}

const institutionCustomerList = (previousState = {data: []}, action) => {
  if (action.type === GET_INSTITUTION_CUSTOMER_LIST) {
    return action.data
  } else {
    return previousState
  }
}

const myCustomerList = (previousState = {data: []}, action) => {
  if (action.type === GET_MY_CUSTOMER_LIST) {
    return action.data
  } else {
    return previousState
  }
}

export function managerTree(previousState = { data: {} }, action) {
  if (action.type === GET_MANAGER_TREE) {
    return action.data
  } else {
    return previousState
  }
}

export function managerList(previousState = { data: {} }, action) {
  if (action.type === GET_MANAGER_BY_ID) {
    return action.data
  } else {
    return previousState
  }
}

// 从 url 上获取 companyKey
const companyKey = (previousState = '', action) => {
  if (action.type === DELIVER_COMPANY_KEY) {
    return action.data || ''
  } else {
    return previousState
  }
}

// 客户详情 - 客户基本信息
const customerBasicInfo = (previousState = { data: {} }, action) => {
  if (action.type === GET_CUSTOMER_DETAIL_BASIC) {
    return action.data
  } else {
    return previousState
  }
}

// 客户详情 - 账户信息
const customerAccountInfo = (previousState = { data: [] }, action) => {
  if (action.type === GET_CUSTOMER_DETAIL_ACCOUNT) {
    return action.data.data
  } else {
    return previousState
  }
}

// 客户详情 - 财务信息（获取财务报表）
const customerFinanceInfo = (previousState = { data: [] }, action) => {
  if (action.type === GET_CUSTOMER_DETAIL_FINANCE) {
    return action.data
  } else {
    return previousState
  }
}

// 资产负债表
const customerAssetList = (previousState = [], action) => {
  if (action.type === GET_ASSET_LIST) {
    return action.data.data
  } else {
    return previousState
  }
}

// 资产现金表
const customerCashList = (previousState = [], action) => {
  if (action.type === GET_CASH_LIST) {
    return action.data.data
  } else {
    return previousState
  }
}

// 利润表
const customerProfitList = (previousState = [], action) => {
  if (action.type === GET_PROFIT_LIST) {
    return action.data.data
  } else {
    return previousState
  }
}


// 客户管理列表 - 所属机构
const institutionIds = (previousState = [], action) => {
  if (action.type === DELIVER_INSTITUTION_IDS) {
    return action.data
  } else {
    return previousState
  }
}


// 高级筛选 - 开户时间
const openAccountTime = (previousState = {
  startTime: {},
  endTime: {},
}, action) => {
  if (action.type === DELIVER_OPEN_ACCOUNT_TIME) {
    return action.data
  } else {
    return previousState
  }
}

// 高级筛选 - 行业分类
const industryCategory = (previousState = [], action) => {
  if (action.type === DELIVER_INDUSTRY_CATEGORY) {
    return action.data
  } else {
    return previousState
  }
}

// 高级筛选 - 已选择行业分类的所有options
const industryCategoryOptions = (previousState = [], action) => {
  if (action.type === DELIVER_INDUSTRY_CATEGORY_OPTIONS) {
    return action.data
  } else {
    return previousState
  }
}

// 高级筛选 - 经营范围
const operateRange = (previousState = '', action) => {
  if (action.type === DELIVER_OPERATE_RANGE) {
    return action.data
  } else {
    return previousState
  }
}

// 高级筛选 - 经营状态
const operateStatus = (previousState = {
  all: false,
  normal: false,
  renew: false,
  moveIn: false,
  moveOut: false,
  closed: false,
  cancel: false,
  revoke: false,
  clear: false,
}, action) => {
  if (action.type === DELIVER_OPERATE_STATUS) {
    return action.data
  } else {
    return previousState
  }
}

// 高级筛选 - 注册时间
const registerTime = (previousState = {
  startTime: {},
  endTime: {},
}, action) => {
  if (action.type === DELIVER_REGISTER_TIME) {
    return action.data
  } else {
    return previousState
  }
}

// 高级筛选 - 注册资本
const registerCapital = (previousState = {
  lower: '',
  upper: '',
}, action) => {
  if (action.type === DELIVER_REGISTER_CAPITAL) {
    return action.data
  } else {
    return previousState
  }
}

// 高级筛选 - 省份地区（省）
const selectedProvince = (previousState = [], action) => {
  if (action.type === DELIVER_SELECTED_PROVINCE) {
    return action.data
  } else {
    return previousState
  }
}

// 高级筛选 - 省份地区代码（省）
const selectedProvinceCode = (previousState = [], action) => {
  if (action.type === DELIVER_SELECTED_PROVINCE_CODE) {
    return action.data
  } else {
    return previousState
  }
}

// 高级筛选 - 省份地区（市）
const selectedCity = (previousState = [], action) => {
  if (action.type === DELIVER_SELECTED_CITY) {
    return action.data
  } else {
    return previousState
  }
}

// 高级筛选 - 省份地区代码（市）
const selectedCityCode = (previousState = [], action) => {
  if (action.type === DELIVER_SELECTED_CITY_CODE) {
    return action.data
  } else {
    return previousState
  }
}

// 高级筛选 - 省份地区（区/县）
const selectedArea = (previousState = [], action) => {
  if (action.type === DELIVER_SELECTED_AREA) {
    return action.data
  } else {
    return previousState
  }
}

// 高级筛选 - 省份地区代码（区/县）
const selectedAreaCode = (previousState = [], action) => {
  if (action.type === DELIVER_SELECTED_AREA_CODE) {
    return action.data
  } else {
    return previousState
  }
}

const customerMgt = combineReducers({
  custList,
  institutionCustomerList,
  myCustomerList,
  managerTree,
  managerList,
  companyKey,
  customerBasicInfo,
  customerAccountInfo,
  customerFinanceInfo,
  customerAssetList,
  customerCashList,
  customerProfitList,

  institutionIds,

  openAccountTime,
  industryCategory,
  industryCategoryOptions,
  operateRange,
  operateStatus,
  registerTime,
  registerCapital,

  selectedProvince,
  selectedProvinceCode,
  selectedCity,
  selectedCityCode,
  selectedArea,
  selectedAreaCode,
})

export default customerMgt
