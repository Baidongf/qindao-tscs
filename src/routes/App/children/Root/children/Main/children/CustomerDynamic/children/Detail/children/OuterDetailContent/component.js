import React from 'react'
import './component.scss'
import { Button } from 'antd'

class OuterDetailContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }

    this.toggleExpand = this.toggleExpand.bind(this)
  }

  toggleExpand() {
    const { expanded } = this.state
    this.setState({ expanded: !expanded })
  }

  render() {

    const { detail } = this.props
    const { expanded } = this.state

    return (
      <div className='outer-detail-content-component'>
        <div className='title'>事件内容</div>
        <div
          id='content'
          className={`content ${expanded ? 'content-expanded' : ''}`}
          dangerouslySetInnerHTML={{ __html: detail }}
        ></div>
        <div className='button-area'>
          <Button
            className='button'
            onClick={this.toggleExpand}
          >
            {
              expanded ?
              '收起内容' : '展开更多'
            }
          </Button>
        </div>
      </div>
    )
  }
}


export default OuterDetailContent
