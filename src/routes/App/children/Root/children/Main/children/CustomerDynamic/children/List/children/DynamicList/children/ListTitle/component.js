import React from 'react'
import './component.scss'
import { checkPermission } from 'utils/permission'

// 获取权限
const canRelateSchedule = checkPermission('customerDynamicWorkSchedule/join')
const canRelateBusiness = checkPermission('customerDynamicBusiness/joinBusiness')

class ListTitle extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isCustomerManager: null
    }
  }

  componentWillMount() {
    const isCustomerManager = localStorage.getItem('IS_CUSTOMER_MANAGER')
    this.setState({ isCustomerManager })
  }

  render() {
    const { isCustomerManager } = this.state
    const { type } = this.props
    const isMyDynamic = type === 'myDynamic'
    const isInstitutionDynamic = type === 'institutionDynamic'
    return (
      <div className={`list-title-component ${isInstitutionDynamic ? 'institution-dynamic-title-content' : ''}`}>
        <span className={`title-name name`}>动态名称</span>
        <span className={`title-name source`}>动态来源</span>
        <span className={`title-name type`}>动态类型</span>
        {/* {
          isCustomerManager === '0' ?
          <span className='title-name institution'>所属机构</span> :  null
        }

        {
          isCustomerManager === '0' ?
          <span className='title-name manager'>客户经理</span> : null
        } */}

        <span className={`title-name time ${
          canRelateBusiness || canRelateSchedule ?
          'is-customer-manager' : ''
        }`}>推送时间</span>

        {
          isMyDynamic && (canRelateBusiness || canRelateSchedule) ?
          <span className='title-name operation'>操作</span> : null
        }

      </div>
    )
  }
}

export default ListTitle
