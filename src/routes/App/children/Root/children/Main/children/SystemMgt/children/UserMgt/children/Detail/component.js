import React from 'react'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import DetailPage from 'components/DetailPage'
import HzBreadcrumb from 'components/HzBreadcrumb'
import './component.scss'


class Detail extends React.Component {
  constructor(props) {

    super(props)
    this.config = {
      title: '用户详情',
      fields: [
        [
          {name: '姓名', key: 'name'},
          {name: '性别', key: 'sex'},
          {name: '工号', key: 'userNo'},
          {name: '身份证号', key: 'idNumber'},

        ],
        [
          {name: '机构名称', key: 'institutionId'},
          {name: '机构编号', key: 'institutionId'},
          {name: '岗位', key: 'emplyPost'},
          {name: '状态', key: 'status'},
          {name: '所属团队', key: 'groupName'},
          {name: '擅长业务', key: 'firstBusiness'}
        ],
        [
          {name: '手机', key: 'phone'},
          {name: '邮箱', key: 'email'},
          {name: '所属角色', key: 'roles'}
        ]
      ],
      valueObj: {
      }
    }
    this.queryObj = queryString.parse(props.location.search)
    this.id = this.queryObj.id
  }

  componentDidMount() {
    this.props.getUserDetail(this.id)
  }

  componentWillReceiveProps({ userDetail }) {

    if (userDetail !== this.props.userDetail) {
      userDetail.status = userDetail.status === '1' ? '有效' : '无效'

      // 所属角色处理
      const roles = userDetail.roles
      let rolesValue = roles[0].name
      userDetail.roles = rolesValue

      this.config.valueObj = userDetail
    }
  }
  render() {
    return (
      <div className='detail-component'>
        <div className='breadcrumb-rea'>
          <HzBreadcrumb/>
        </div>
        <div className='main-body'>
          <DetailPage options={ this.config } />
        </div>
      </div>
    )
  }
}
export default withRouter(Detail)
