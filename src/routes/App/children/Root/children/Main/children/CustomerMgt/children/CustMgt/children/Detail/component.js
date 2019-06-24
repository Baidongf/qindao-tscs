import React from 'react'
import './component.scss'
import HzBreadcrumb from 'components/HzBreadcrumb'
import Banner from './children/Banner'
import NavigatePanel from './children/NavigatePanel'
import ContentPanel from './children/ContentPanel'
import RelationPanel from './children/RelationPanel';


class Detail extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  getQueryString=(key)=> {
    const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`, 'i')
    const value = this.props.location.search.substr(1).match(reg)
    if (value != null) return unescape(value[2])
    return null
  }

  componentWillMount() {
    const companyKey = this.getQueryString('companyKey')
    this.props.deliverCompanyKeyToStore(companyKey)
    this.props.getCustomerDetailBasic(companyKey)
  }

  shouldComponentUpdate({ location, customerBasicInfo }) {
    if (
      location !== this.props.location ||
      customerBasicInfo.objectKey !== this.props.customerBasicInfo.objectKey
    ) {
      return true
    } else {
      return false
    }
  }


  render() {

    const { isInter, name } = this.props.customerBasicInfo

    return (
      <div className='customer-detail-component'>

        <div className='breadcrumb-area'>
          <HzBreadcrumb />
        </div>

        {/* 主内容区 start */}
        <div className='main-container'>

          {/* 左容器 start */}
          <div className='left-container'>

            <Banner />
            <ContentPanel contentType={0} />

            {
              isInter === '0' ?
              <ContentPanel contentType={1} /> : null
            }

            {
              isInter === '0' ?
              <ContentPanel contentType={2} customerName={name} /> : null
            }

            <RelationPanel companyKey={this.getQueryString('companyKey')}/>
          </div>
          {/* 左容器 end */}

          {/* 右容器 start */}
          <div className='right-container'>
            <NavigatePanel />
          </div>
          {/* 右容器 end */}

        </div>
        {/* 主内容区 end */}

      </div>
    )
  }
}

export default Detail
