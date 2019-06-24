import React from 'react'
import './component.scss'
import InfoRow from './children/InfoRow'

/**
 * @desc 行内客户的基本信息
 */
class BasicInfo extends React.Component {
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
      code,
      certType,
      certCode,
      intCrdtLevel,
      regNo,
      regDate,
      regCurrency,
      regCapital,
      regProvince,
      regAddress,
      nationTaxRegCd,
      regType,
      basicOpenAcctBank,
      industry,
      employeeCnt,
      contTel,
      operRange,
      officeAddress,
      officeZip,
      establishmentDate,
      overdueCreditInquiries,
      groupName,
    } = this.props.customerBasicInfo

    return (
      <div className='basic-info-component'>
        <InfoRow
          leftTitle='客户名称' rightTitle='客户编号'
          leftContent={name} rightContent={code}
        />
        <InfoRow
          leftTitle='证件类型' rightTitle='证件编号'
          leftContent={certType} rightContent={certCode}
        />
        <InfoRow
          leftTitle='信用等级' rightTitle='征信逾期次数'
          leftContent={intCrdtLevel} rightContent={overdueCreditInquiries}
        />
        <InfoRow
          leftTitle='工商营业执照注册号码' rightTitle='营业执照发证日期'
          leftContent={regNo} rightContent={regDate}
        />
        <InfoRow
          leftTitle='注册资本币种' rightTitle='注册资本(元)'
          leftContent={regCurrency} rightContent={regCapital}
        />
        <InfoRow
          leftTitle='企业成立日期' rightTitle='所在国家(地区)'
          leftContent={establishmentDate} rightContent={regProvince}
        />
        <InfoRow
          leftTitle='住所' rightTitle='税务登记证号码'
          leftContent={regAddress} rightContent={nationTaxRegCd}
        />
        <InfoRow
          leftTitle='登记注册类型' rightTitle='基本账户开户行'
          leftContent={regType} rightContent={basicOpenAcctBank}
        />
        <InfoRow
          leftTitle='国际行业分类' rightTitle='职工人数'
          leftContent={industry} rightContent={employeeCnt}
        />
        <InfoRow
          leftTitle='办公地址' rightTitle='办公地址邮政编码'
          leftContent={officeAddress} rightContent={officeZip}
        />
        <InfoRow
          leftTitle='联系电话' rightTitle='所属集团名称'
          leftContent={contTel} rightContent={groupName}
        />
        <InfoRow leftTitle='经营范围' leftContent={operRange} />
      </div>
    )
  }
}

export default BasicInfo
