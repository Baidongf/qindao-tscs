// 最开始展开的中心企业，用于在URL中无法获取企业名称的情况，如 lp_type=Invest_and_officer
export function initCompanyName (state = '', action) {
  if (action.type === 'SET_INIT_COMPANY_NAME') {
    return action.companyName
  } else {
    return state
  }
}
