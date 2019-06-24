import React from 'react'
import './component.scss'
import HzBreadcrumb from 'components/HzBreadcrumb'
import DetailHeader from './children/DetailHeader'
import OuterDetailContent from './children/OuterDetailContent'
import InnerDetailContent from './children/InnerDetailContent'
import Business from './children/Business'
import Schedule from './children/Schedule'

class DynamicDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      source: null, // '0'行内 '1'行外
      detailKey: null,
    }
  }

  getQueryString(key) {
    const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`, 'i')
    const value = this.props.location.search.substr(1).match(reg)
    if (value != null) return unescape(value[2])
    return null
  }

  componentWillMount() {
    const detailKey = this.getQueryString('key')
    const source = this.getQueryString('source')
    this.setState({ source, detailKey })
  }

  componentDidMount() {
    const { detailKey } = this.state
    this.props.getDynamicDetail(detailKey)
  }

  render() {

    const { source, detailKey } = this.state
    const { dynamicDetail } = this.props

    return (
      <div className='dynamic-detail-component'>
        <HzBreadcrumb />

        <div className='detail-content-container'>
          <DetailHeader
            source={source}
            name={dynamicDetail.name}
            type={dynamicDetail.typeName}
            institution={dynamicDetail.inistitutionName}
            username={dynamicDetail.userName}
            time={dynamicDetail.pushTime}
          />


          {
            source === '0' ?
            <InnerDetailContent
              detail={dynamicDetail.content}
            /> :
            <OuterDetailContent
              detail={dynamicDetail.content}
            />
          }

          <Business
            relateKey={detailKey}
          />

          <Schedule
            relateWith='dynamic'
            relateKey={detailKey}
            oneCheck={true}
            relateOneByOne={true}
          />
        </div>

      </div>
    )
  }
}


export default DynamicDetail
