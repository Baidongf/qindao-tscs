import React from 'react'
import './component.scss'

class InnerDetailContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }


  render() {

    const { detail } = this.props
    let content = []
    if (!!detail) {
      try {
        content = (JSON.parse(detail)).data
      } catch(error) {
        content = []
        console.log(error)
      }
    }

    return (
      <div className='inner-detail-content-component'>
        <div className='title'>事件内容</div>

        {
          content.map(item => {
            return (
              <div className='detail-row' key={item.name}>
                <span className='row-title'>{item.name}</span>
                <span className='row-content'>{item.value}</span>
              </div>
            )
          })
        }

      </div>
    )
  }
}


export default InnerDetailContent
