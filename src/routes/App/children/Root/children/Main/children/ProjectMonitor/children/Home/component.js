import React from 'react'
import './component.scss'
import {Link, HashRouter} from 'react-router-dom'
import {Input, Button, Table, Select, Tag, DatePicker, Modal, Breadcrumb, Switch} from 'antd'
import HzLink from 'components/HzLink'
import OwnInstitution from 'components/OwnInstitution'
import {getQueryString} from 'utils/url'
import HzBreadcrumb from 'components/HzBreadcrumb'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import {commonChangeHandler} from 'utils/antd'

const PAGE_SIZE = 10
const Option = Select.Option
const FILTER_INIT_VALUES = {
  keyWord: undefined,
  nameOrNo: undefined,
  name: undefined,
  institutionIds: undefined,
  createTime: undefined
};

class List extends React.Component {

  // 成员属性、状态的声明，均在构造函数内部
  constructor(props) {
    super(props)

    this.state = {
      filterObj: {
        ...FILTER_INIT_VALUES
      },

      rowStatus: {
        // 0: false   {row.sortNum}
      }
    }

    this.columns = [{
      title: '项目编号',
      dataIndex: 'sortNum'
    },{
      title: '项目名称',
      dataIndex: 'name',
      className: 'td-name',
      render: (value, row, index) => <HzLink to={`/root/main/projectMonitor/detail?id=${row.id}`}><span
        title={value} className={'over-flow-e'}>{value}</span></HzLink>,
    }, {
      title: '项目描述',
      dataIndex: 'description',
      render: (value, row, index) => {
        return (<span title={value} className={'over-flow-e'}>{value}</span>)
      }
    }, {
      title: '所属机构',
      dataIndex: 'institutionName',
      render: (value, row, index) => {
        return (<span title={value}>{value}</span>)
      }
    }, {
      title: '项目建立人',
      dataIndex: 'userName',
      render: (text) => {
        return text ? text : '暂无'
      }
    }, {
      title: '项目建立日期',
      dataIndex: 'createTime',
    }]

    this.pagination = {
      showQuickJumper: true,
      total: 0,
      current: 1,
      pageSize: PAGE_SIZE,
      onChange: (page, pageSize) => {
        this.pagination.current = page
        window.history.pushState(null, null, '#/root/main/projectMonitor/home?pageNo=' + page)
        this.searchHandler()
      }
    }

    this.searchHandler = this.searchHandler.bind(this)
    this.resetHandler = this.resetHandler.bind(this)
    // this.commonChangeHandler = commonChangeHandler.bind(this)
  }


  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'filterObj', key, value)
  }

  searchHandler() {
    const obj = {
      createTime: this.state.filterObj.createTime&&this.state.filterObj.createTime.format('YYYY-MM-DD'),
      institutionIds: this.state.filterObj.institutionIds,
      keyWord: this.state.filterObj.keyWord,
      pageNo: this.pagination.current,
      pageSize: this.pagination.pageSize
    }
    this.props.getProjectList(obj)
  }

  resetHandler() {
    this.setState({
      filterObj: {
        ...FILTER_INIT_VALUES
      }
    })
    this.searchHandler()
  }

  handlePopupConfirm = (keys) => {
    let ids = keys.map(key => {
      let keyArr = key.split('-')
      return keyArr[keyArr.length - 1]
    })
    this.valueChangeHandler('institutionIds', ids)
  }

  componentWillMount() {
    let pageNo = getQueryString(window.location.href, 'pageNo') || 1
    this.pagination.current = parseInt(pageNo)
    this.searchHandler()
    // this.props.getProjectList()
  }

  componentDidMount() {
    // this.searchHandler()
  }

  componentWillReceiveProps({projectList}) {
    if (this.props.projectList !== projectList) {
      projectList.data.forEach((item, index) => {
        item.key = item.id
      })

      this.pagination.total = projectList.total
    }

  }

  render() {
    const {filterObj} = this.state
    const {projectList} = this.props

    return (
      <div className='project-monitor'>
        <HzBreadcrumb/>
        <div className='filter-area'>
          <div className='inputs'>
            <DatePicker
              value={filterObj.createTime}
              onChange={this.valueChangeHandler.bind(this, 'createTime')}
              placeholder='项目建立日期'
              className='input-item common-length'
              style={{width: 240}}
            >
            </DatePicker>
            <OwnInstitution
              handlePopupConfirm={this.handlePopupConfirm}
              btnStyle={{width:'190px'}}
            />
            <Input
              value={filterObj.keyWord}
              onChange={this.valueChangeHandler.bind(this, 'keyWord')}
              placeholder='请输入项目名称、项目编号、项目建立人'
              style={{width: 328}}
            />
          </div>
          <div className='buttons'>
            <Button type='primary' className='btn-item' onClick={this.searchHandler}>搜索</Button>
            <Button className='btn-item' onClick={this.resetHandler.bind(this)}>重置</Button>
          </div>
        </div>
        <div className='result-area'>
          <div className='list-header clearfix'>
            <span className='total-area'>共找到<span className='total-num'>{projectList.total || 0}</span>条项目信息</span>
            <div className='btns'>
              <Link to='/root/main/projectMonitor/createOrEdit?operation=create'>
                <Button type='primary' className='btn-create'>新建项目</Button>
              </Link>
            </div>
          </div>
          <div className='table-area'>
            <div className='hz-table'>
              <Table
                columns={this.columns}
                bordered
                dataSource={projectList.data}
                pagination={this.pagination.total > 10 ? this.pagination : false}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default List
