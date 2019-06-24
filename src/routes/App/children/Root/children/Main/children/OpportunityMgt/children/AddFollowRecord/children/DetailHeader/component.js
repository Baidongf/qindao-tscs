import React from 'react'
import './component.scss'

class DetailHeader extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }


  render() {
    const {
      name,
      updateTime
    } = this.props

    return (
      <div className='add-record-opportunity-detail-header-component'>

        <div className='detail-title'>{name || '-'}</div>

        <div className='tags-container'>
          <div className='tag '>最近维护日期：{updateTime || '-'}</div>
        </div>
      </div>
    )
  }
}


export default DetailHeader
