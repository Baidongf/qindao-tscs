import React from 'react'
import './component.scss'

class DetailHeader extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {

    const {
      source,
      name,
      type,
      institution,
      username,
      time,
    } = this.props

    return (
      <div className='detail-header-component'>

        <div className='detail-title'>{ name || '-' }</div>

        <div className='tags-container'>

          <div className='tag bank-type'>
            {
              source === '0' ? '行内动态' : '行外事件'
            }
          </div>
          <div className='tag dynamic-type'>{ type || '-' }</div>
          <div className='tag institution'>{ institution || '-' }</div>
          <div className='tag managers'>客户经理：{ username || '-' }</div>
          <div className='tag date'>{ time || '-' }</div>
        </div>

      </div>
    )
  }
}


export default DetailHeader
