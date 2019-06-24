import React from 'react'
import axios from 'axios'
import { BASE_URL } from 'config/baseUrl.js'
import queryString from 'query-string'
import './component.scss'
import moment from 'moment'
import HzBreadcrumb from 'components/HzBreadcrumb'
import DetailPage from 'components/DetailPage'
import AnchorLink from 'antd/lib/anchor/AnchorLink';

class Detail extends React.Component {
  constructor(props) {

    super(props)
    this.state = {
      orgObj: {
      }
    }
    this.queryObj = queryString.parse(props.location.search)
    this.id = this.queryObj.id

    this.config = {
      title: '标签详情',
      fields: [
        [
          { name: '标签名称', key: 'name' },
          { name: '标签来源', key: 'source' },
          { name: '标签类型', key: 'type' },
          { name: '创建日期', key: 'createDate' }
        ],
        [
          { name: '标签描述', key: 'description' },
        ],
        [
          { name: '覆盖企业', key: 'companyQuantity' },
        ]
      ],
      valueObj: {},
      history: props.history
    }

  }

  textExcel() {
    axios({
      url: `/crm-fd/api/tag/export/1`, // 接口名字
      method: 'get',
      responseType: 'blob',
    }).then(response => {
      const blob = new Blob(
        [response.data],
        {
          type: 'application/octet-stream;charset=utf-8'
        }
      )
      const fileName = '客户名单.xls'
      const linkNode = document.createElement('a')
      const href = window.URL.createObjectURL(blob)
      linkNode.href = href
      linkNode.download = fileName
      linkNode.style.display = 'none'
      document.body.appendChild(linkNode)
      linkNode.click()
      document.body.removeChild(linkNode)
      window.URL.revokeObjectURL(href)
    })
  }

  componentDidMount() {
    this.props.getTagDetail(this.id)
  }

  componentWillReceiveProps({ tagDetail }) {
    if (tagDetail !== this.props.tagDetail) {

      // 日期转化为时间戳格式
      ['effectiveDate', 'expiryDate'].forEach(dateKey => {
        if (tagDetail[dateKey]) {
          tagDetail[dateKey] = moment(tagDetail[dateKey], 'x').format('YYYY-MM-DD')
        }
      })
      tagDetail.status = tagDetail.status === '0' ? '有效' : '无效'
      this.config.valueObj = tagDetail
    }
  }
  render() {
    return (
      <div className='detail-component'>
        <div className='breadcrumb-rea'>
          <HzBreadcrumb />
        </div>
        <div className='main-body'>
          <DetailPage options={this.config} id={this.id} />
        </div>
      </div>
    )
  }
}
export default Detail
