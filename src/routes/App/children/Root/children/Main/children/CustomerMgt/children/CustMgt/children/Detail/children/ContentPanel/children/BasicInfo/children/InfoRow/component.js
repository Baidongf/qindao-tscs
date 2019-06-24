import React from 'react'
import './component.scss'

class InfoRow extends React.Component {

  static defaultProps = {
      leftTitle: '',
      leftContent: '',
  }

  render() {

    const {
      leftTitle,
      leftContent,
      rightTitle,
      rightContent,
    } = this.props

    return (
      <div className='info-row-component'>
      {
        !!rightTitle ?
        (
          <div>
            <div className='left-cell'>
              <div className='title'>{`${leftTitle}:`}</div>
              <div className='content'>{leftContent}</div>
            </div>

            <div className='right-cell'>
              <div className='title'>{`${rightTitle}:`}</div>
              <div className='content'>{rightContent}</div>
            </div>
          </div>
        ) : (
          <div className='single-item-row'>
            <div className='title'>{`${leftTitle}:`}</div>
            <div className='content'>{leftContent}</div>
          </div>
        )
      }

      </div>
    )
  }
}

export default InfoRow
