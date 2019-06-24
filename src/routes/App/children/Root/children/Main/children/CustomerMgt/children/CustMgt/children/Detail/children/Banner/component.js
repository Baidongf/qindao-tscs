import React from 'react'
import './component.scss'

class Banner extends React.Component {
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
      companyType,
      industry,
      tags
    } = this.props.customerBasicInfo
    console.log(tags)
    return (
      <div className='banner-component'>
        <div className='banner-content'>
          <div className='logo'></div>
          <div className='content'>
            <div className='title'>{ name }</div>
            <div className='tags'>
              {/* {
                companyType ?
                <div className='tag'>{ companyType }</div> : ''
              }
              {
                industry ?
                <div className='tag'>{ industry }</div> : ''
              } */}
              {
                tags && tags.map((el) => <span className='tag' key={el.objectKey}>{el.name}</span> )
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Banner
