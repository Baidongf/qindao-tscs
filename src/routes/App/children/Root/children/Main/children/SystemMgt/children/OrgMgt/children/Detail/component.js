import React from 'react'
import queryString from 'query-string'
import styles from './component.module.scss'
import moment from 'moment'
import DetailPage from 'components/DetailPage'
import HzBreadcrumb from 'components/HzBreadcrumb'


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
      title: '机构详情',
      fields: [
        [
          {name: '机构名称', key: 'name'},
          {name: '机构编号', key: 'orgNo'},
          {name: '上级机构', key: 'parentName'},
          {name: '主要业务', key: 'primaryBusiness'}
        ],
        [
          {name: '主要客群', key: 'customerGroup'},
          {name: '邮编', key: 'distAreaCd'},
          {name: '主要行业', key: 'industry'},
          {name: '机构地址', key: 'address'},
          // {name: '机构状态', key: 'status'},
          {name: '联系电话', key: 'tel'}
        ],
        [
          {name: '负责人', key: 'principal'},
          // {name: '生效日期', key: 'effectiveDate'},
          // {name: '失效日期', key: 'expiryDate'}
        ]
      ],
      valueObj: {
      },
      history: props.history
    }

  }

  componentWillMount() {
    this.props.getOrgDetail(this.id)
  }

  componentDidMount() {
  }
  componentWillReceiveProps({ orgDetail }) {
    if (orgDetail !== this.props.orgDetail) {

      // 日期转化为时间戳格式
      ['effectiveDate', 'expiryDate'].forEach(dateKey => {
        if (orgDetail[dateKey]) {
          orgDetail[dateKey] = moment(orgDetail[dateKey], 'x').format('YYYY-MM-DD')
        }
      })
      orgDetail.status = orgDetail.status === '1' ? '有效' : '无效'
      this.config.valueObj = orgDetail
    }
  }
  render() {
    return (
      <div className={styles['detail-component']}>
        <div className='breadcrumb-rea'>
          <HzBreadcrumb />
        </div>
        <div className='main-body'>
          <DetailPage options={ this.config }/>
        </div>
      </div>
    )
  }
}
export default Detail
