import React from 'react'
import './component.scss'
import { Tabs } from 'antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import Loadable from 'react-loadable'
import RouteLoading from 'components/RouteLoading'

const TabPane = Tabs.TabPane

const AssetForm = Loadable({
  loader: () => import('./children/AssetForm'),
  loading: RouteLoading,
})


const ProfitForm = Loadable({
  loader: () => import('./children/ProfitForm'),
  loading: RouteLoading,
})

const CashForm = Loadable({
  loader: () => import('./children/CashForm'),
  loading: RouteLoading,
})

class FinanceReportForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.formFilters = {
      companyKey: '',
      period: '',
      term: '',
    }

    this.customerName = ''
  }

  getQueryString(key) {
    const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`, 'i')
    const value = this.props.location.search.substr(1).match(reg)
    if (value != null) return decodeURIComponent(value[2])
    return null
  }

  componentWillMount() {
    const companyKey = this.getQueryString('companyKey')
    const period = this.getQueryString('period')
    const term = this.getQueryString('term')
    const name = this.getQueryString('name')
    this.formFilters = {
      companyKey, period, term
    }
    this.customerName = name
  }

  render() {

    const { companyKey, period, term } = this.formFilters
    const { customerName } = this

    return (
      <div className='finance-report-form-component'>
        <HzBreadcrumb />

        <div className='finance-form-container'>
          {/* header 公司名 */}
          <div className='company-name'>{ customerName }</div>

          {/* 财务报表表 切换区 */}
          <div className='form-switch-container'>
            <Tabs
              animated={false}
              tabBarExtraContent={(
                <div className='form-header-tip'>
                  <span>单位:元</span>
                  <span>  |  </span>
                  <span>报表期次: {term}</span>
                </div>
              )}
            >
              <TabPane tab="资产负债表" key="1">
                <AssetForm
                  companyKey={companyKey}
                  period={period}
                  term={term}
                />
              </TabPane>

              <TabPane tab="利润表" key="2">
                <ProfitForm
                  companyKey={companyKey}
                  period={period}
                  term={term}
                />
              </TabPane>

              <TabPane tab="现金流量表" key="3">
                <CashForm
                  companyKey={companyKey}
                  period={period}
                  term={term}
                />
              </TabPane>
            </Tabs>
          </div>

        </div>
      </div>
    )
  }

}

export default FinanceReportForm
