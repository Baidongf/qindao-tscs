import React from 'react'
import './component.scss'
import excelButton from './images/excelButton.svg'
import XLSX from 'xlsx'
import { message } from 'antd'


/**
 * @desc 详情页的下载excel按钮，封装了excel导出功能
 * @prop {string} wording 按钮文案
 * @prop {AOA} sheetData 表单数据
 */
class DownloadExcel extends React.Component {

  static defaultProps = {
    wording: '客户名单',
    sheetData: [[]]
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

  checkSheetData() {
    const { sheetData } = this.props
    if (this.getDataType(sheetData) !== 'Array') {
      message.error('sheetData should be Array')
      return true
    }
  }

  download() {
    // TODO: 1. 校验表单数据合法性
    if (this.checkSheetData()) {
      return false
    }

    const { wording } = this.props

    let wb = XLSX.utils.book_new()

    let ws = XLSX.utils.aoa_to_sheet([
      "SheetJS".split(""),
      [1,2,3,4,5,6,7],
      [2,3,4,5,6,7,8]
    ])

    let _ws = XLSX.utils.json_to_sheet([
      { S:1, h:2, e:3, e_1:4, t:5, J:6, S_1:7 },
      { S:2, h:3, e:4, e_1:5, t:6, J:7, S_1:8 }
    ]);

    XLSX.utils.book_append_sheet(wb, _ws, wording);
    XLSX.writeFile(wb, `${wording}_test.xlsx`)

    message.info('success')
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

export default DownloadExcel
