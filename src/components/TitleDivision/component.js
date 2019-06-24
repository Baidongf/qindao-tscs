import React from 'react'
import './component.scss'


class TitleDivision extends React.Component {
  constructor(props) {
    super(props)
    this.options = props.options? props.options : {
      title: {},
      line: {},
    }
  }

  render() {
    let { title, className } = this.props
    if (!title) {
      title = this.options.title.text
    }
    className = className || ''
    return (
      <div className={`hz-division ${className}`}>
        <div className='hz-division-title'>
          <span
            className='text'
            style={ this.options.title.styles }
          >{ title }</span>
          <span
            className='middle-line'
            style={ this.options.line.styles }
          ></span>
        </div>
        <div className='hz-division-content'>
          { this.props.children }
        </div>

      </div>

    )
  }
}

export default TitleDivision
