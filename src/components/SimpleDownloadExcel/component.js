import React from 'react'
import './component.scss'
import excelButton from './images/excelButton.svg'
import { message } from 'antd'
import axios from 'axios'


/**
 * @desc 详情页的下载excel按钮，封装了excel导出功能，用于后端接口可直接导出表格的情况
 * @prop {string} wording 按钮文案
 * @prop {AOA} downloadUrl 下载地址
 */
class SimpleDownloadExcel extends React.Component {

  static defaultProps = {
    wording: '客户名单',
    downloadUrl: '',
    // sheetData: [[]]
  }

  constructor(props) {
    super(props)
    this.state = {}

    this.download = this.download.bind(this)
  }

  getDataType(data) {
    const type = Object.prototype.toString.call(data)
    return type.substring(8, type.length - 1)
  }

  download() {
    const { downloadUrl, wording } = this.props

    if (!!downloadUrl === false) {
      message.warning('需要传递 downloadUrl 字段')
      return false
    }

    axios({
      url: downloadUrl,
      method: 'get',
      responseType: 'blob',
    }).then(response => {
      const blob = new Blob(
        [response.data],
        {
          type: 'application/octet-stream;charset=utf-8'
        }
      )
      const fileName = `${wording}.xls`
      const linkNode = document.createElement('a')
      const href = window.URL.createObjectURL(blob)
      linkNode.href = href
      linkNode.download = fileName
      linkNode.style.display = 'none'
      document.body.appendChild(linkNode)
      linkNode.click()
      document.body.removeChild(linkNode)
      window.URL.revokeObjectURL(href)
    }).catch(error => {
      console.log(error)
      message.error('下载失败')
    })
  }


  render() {
    const { wording } = this.props

    return (
      <div className='excel-button-component' onClick={this.download}>
        <img alt='' src={excelButton} className='icon' />
        <span className='wording'>下载{ wording }</span>
      </div>
    )
  }
}

export default SimpleDownloadExcel
