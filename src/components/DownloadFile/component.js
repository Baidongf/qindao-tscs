import React from 'react'
import './component.scss'
import { message } from 'antd'
import axios from 'axios'


/**
 * @desc 下载文件的组件
 * @prop {String} fileName 文件名，需要包含文件格式后缀
 * @prop {AOA} downloadUrl 下载地址
 */
class DownloadFile extends React.Component {

  static defaultProps = {
    fileName: '',
    downloadUrl: ''
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
    const { fileName, downloadUrl } = this.props

    if (!!fileName === false) {
      message.warning('需要传递 fileName 字段')
      return false
    }

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

    return (
      <div className='download-file-component' onClick={this.download}>
        { this.props.children }
      </div>
    )
  }
}

export default DownloadFile
