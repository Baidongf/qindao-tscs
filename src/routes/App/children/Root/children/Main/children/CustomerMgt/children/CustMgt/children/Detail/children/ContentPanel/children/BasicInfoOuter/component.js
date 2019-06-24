import React from 'react'
import './component.scss'
import InfoRow from '../BasicInfo/children/InfoRow'

/**
 * @desc 行外客户的基本信息
 */
class BasicInfoOuter extends React.Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  shouldComponentUpdate({ customerBasicInfo }) {
    return customerBasicInfo !== this.props.customerBasicInfo
  }

  render() {
    const {
      name,
      regDate,
      regCapital,
      regAddress,
      industry,
      officeAddress,
      officeZip,
      contTel,
      unifiedSocialCode,
      certCode,
      regProvince,
      operStatus,
      companyType,
      establishmentDate,
      legalPerson,
      businessLimit,
      apprvDate,
      regOrg,
      localTaxRegCd, // 地税代码
      nationTaxRegCd, // 国税代码
      operRange,
    } = this.props.customerBasicInfo

    return (
      <div className='basic-info-component'>
        <InfoRow
          leftTitle='客户名称' rightTitle='注册时间'
          leftContent={name} rightContent={regDate}
        />
        <InfoRow
          leftTitle='注册资本(元)' rightTitle='注册地址'
          leftContent={regCapital} rightContent={regAddress}
        />
        <InfoRow
          leftTitle='主营行业' rightTitle='办公地址'
          leftContent={industry} rightContent={officeAddress}
        />
        <InfoRow
          leftTitle='办公地址邮政编码' rightTitle='联系电话'
          leftContent={officeZip} rightContent={contTel}
        />
        <InfoRow
          leftTitle='统一社会信用代码' rightTitle='注册号'
          leftContent={unifiedSocialCode} rightContent={certCode}
        />
        <InfoRow
          leftTitle='省份' rightTitle='经营状态'
          leftContent={regProvince} rightContent={operStatus}
        />
        <InfoRow
          leftTitle='公司类型' rightTitle='成立日期'
          leftContent={companyType} rightContent={establishmentDate}
        />
        <InfoRow
          leftTitle='法定代表人' rightTitle='营业期限'
          leftContent={legalPerson} rightContent={businessLimit}
        />
        <InfoRow
          leftTitle='核准日期' rightTitle='登记机关'
          leftContent={apprvDate} rightContent={regOrg}
        />
        <InfoRow
          leftTitle='税务登记证号码' rightTitle=''
          leftContent={nationTaxRegCd} rightContent={''}
        />
        <InfoRow leftTitle='经营范围' leftContent={operRange} />
      </div>
    )
  }
}

export default BasicInfoOuter
