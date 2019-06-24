import React from 'react'
import './component.scss'
import HzLink from 'components/HzLink'

class SearchResultItem extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {

    const { data } = this.props
    const isInter = data.isInter === '0'

    return (
      <div className='search-result-item-component'>
        <HzLink
          to={`/root/main/customerMgt/custMgt/detail?companyKey=${data.objectKey}`}
        >
          {/* <div className='left-area'></div> */}

          <div className='right-area'>
            <div className='company-name'>
              <span>{data.name}</span>
            </div>

            <div className='company-code'>
              {
                isInter ?
                  <span>{` ${data.code}`}</span> : null
              }
            </div>

            <div className='description-area'>

              {
                isInter ?
                  <div className='left-description-area'>
                    <div className='description'>法人代表：{data.legalPerson}</div>
                    <div className='description'>信用等级：{data.intCrdtLevel}</div>
                    <div className='description'>注册资本：{data.regCapital}</div>
                  </div> :
                  <div className='left-description-area'>
                    <div className='description'>法人代表：{data.legalPerson}</div>
                    <div className='description'>注册资本：{data.regCapital}</div>
                    <div className='description'>注册日期：{data.regDate}</div>
                  </div>
              }

              {
                isInter ?
                  <div className='right-description-area'>
                    <div className='description'>企业成立时间：{data.establishmentDate}</div>
                    <div className='description'>国际行业分类：{data.industry}</div>
                    <div className='description'>办公地址：{data.officeAddress}</div>
                  </div> :
                  <div className='right-description-area'>
                    <div className='description'>经营状态：{data.operStatus}</div>
                    <div className='description'>主营行业：{data.industry}</div>
                    <div className='description'>公司地址：{data.officeAddress}</div>
                  </div>

              }


              {
                isInter ?
                  <div className='bottom-description-area'>
                    <div className='description'>经营范围: {data.operRange}</div>
                  </div> : null
              }



            </div>

            <div className='tags-area'>
              {
                data.tags.map((el) => <span className='tag' key={el.objectKey}>{el.name}</span> )
              }
              {/* {
                data.companyType ?
                  <span className='tag'>{data.companyType}</span> : null
              } */}
            </div>
          </div>
        </HzLink>
      </div>
    )
  }
}

export default SearchResultItem
