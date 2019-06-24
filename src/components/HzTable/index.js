import React from 'react'
export default function reColumns(columns) {
  columns.forEach(item => {
    if (!item.render) {
      item.render = (text, record, index) => {
        // 行内元素才能使外层的溢出省略号生效
        return (<span title={text}>
          {text}
        </span>)
      }
    }
    if (item.className) {
      item.className += ' hz-cell'
    } else {
      item.className = 'hz-cell'
    }
  })
}


/*
import React from 'react'
import { Table } from 'antd'
import { Object } from 'core-js'
import './component.scss'

class HzTable extends React.Component {
  constructor(props) {
    super()

    // 避免影响父元素中的 columns
    this.columns = props.columns.map(item => {
      return {...item}
    })
    this.columns.forEach(item => {
      item.render = (text, record, index) => {
        let type = Object.prototype.toString.call(text).match(/^\[object (\w+)\]$/)[1]

        if (type === 'Object') {
          text = null
        }

        return <div className="hz-cell" title={text}>
          {item.hzRender ? item.hzRender(text, record, index) : text}
        </div>
      }
    })
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.columns === this.props.columns && nextProps.dataSource === this.props.dataSource) {
      return false
    }
    return true
  }

  render() {
    console.log('table');

    return (
      <Table
        {...this.props}
      />
    )
  }
}

export default HzTable
*/
