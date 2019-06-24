import React from 'react'
import './component.scss'
import Banner from './children/Banner'
import List from './children/List'
import {getQueryString} from 'utils/url'
import HzBreadcrumb from 'components/HzBreadcrumb'


class Detail extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  getQueryString(key) {
    const reg = new RegExp(`(^&)${key}=([^&])(&$)`, 'i')
    const value = this.props.location.search.substr(1).match(reg)
    if (value != null) return unescape(value[2])
    return null
  }

  componentWillMount() {
    const companyKey = getQueryString(window.location.href,'id')
    this.props.getProjectDetail(companyKey)
  }

  shouldComponentUpdate({ location }) {
    return location !== this.props.location
  }


  render() {
    return (
      <div className='project-detail-component'>
        <HzBreadcrumb/>
        <div className='breadcrumb-area'>
        </div>

        {/* 主内容区 start */}
        <div className='main-container'>

          {/* 左容器 start */}
          <div className='left-container'>

            <Banner />


          </div>
          {/* 左容器 end */}
          <div className='left-container'>

            <List />

          </div>

          {/* 右容器 start */}
          <div className='right-container'>
          </div>
          {/* 右容器 end */}

        </div>
        {/* 主内容区 end */}

      </div>
    )
  }
}


export default Detail
