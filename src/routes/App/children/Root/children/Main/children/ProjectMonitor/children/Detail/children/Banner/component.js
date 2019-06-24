import React from 'react'
import './component.scss'

class Banner extends React.Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  shouldComponentUpdate({ projectDetail}) {
    return projectDetail !== this.props.projectDetail
  }

  render() {

    const {
      name,
      institutionName,
      userName,
      createTime,
      institutionId
    } = this.props.projectDetail
    console.log(this.props.projectDetail)
    return (
      <div className='banner-component'>
        <div className='banner-content'>
          <div className='logo'></div>
          <div className='content'>
            <div className='title'>{ name }</div>
            <div className='tags'>
              {
                institutionId ?
                <div className='tag'>{ institutionId }</div> : ''
              }
              {
                institutionName ?
                  <div className='tag'>{ institutionName }</div> : ''
              }
              {
                userName ?
                  <div className='tag'>{ userName }</div> : ''
              }
              {
                createTime ?
                  <div className='tag'>{ createTime }</div> : ''
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Banner
