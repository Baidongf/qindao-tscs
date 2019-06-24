import React from 'react'
import './component.scss'
import { Link } from 'react-router-dom'
import { Input, Button, Table, Select } from 'antd'
import HzLink from 'components/HzLink'
import { commonChangeHandler } from 'utils/antd'
import Auth from 'components/Auth'

const PAGE_SIZE = 10
const Option = Select.Option
const FILTER_INIT_VALUES = {
  status: undefined,
  nameOrNo: undefined,
  tagType: undefined
}

class List extends React.Component {

  // 成员属性、状态的声明，均在构造函数内部
  constructor(props) {
    super(props)

    this.state = {
      filterObj: {
        ...FILTER_INIT_VALUES
      },

      rowStatus: {
        // 0: false
      }
    }

    this.columns = [{
      title: '标签名称',
      dataIndex: 'name',
      width: 120,
      className: 'td-name',
      render: (value, row, index) => <HzLink to={`/root/main/customerMgt/tagMgt/detail?id=${row.id}`}><span title={value}>{value}</span></HzLink>,
    }, {
      title: '标签来源',
      dataIndex: 'source',
      width: 120
    }, {
      title: '标签类型',
      dataIndex: 'type',
      width: 120
    }, {
      title: '标签描述',
      dataIndex: 'description',
      render: (text) => { return text ? text : '暂无' }
    }, {
      title: '创建日期',
      dataIndex: 'createDate',
      width: 150
    }]

    this.pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      total: 0,
      current: 1,
      pageSize: PAGE_SIZE,
      onChange: (page, pageSize) => {
        this.pagination.current = page
        this.searchHandler()
      },
      onShowSizeChange: (page, pageSize) => {
        this.pagination.pageSize = pageSize
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
      type: this.state.filterObj.tagType,
      source: this.state.filterObj.status,
      nameOrDescr: this.state.filterObj.nameOrNo,
      pageNo: this.pagination.current,
      pageSize: this.pagination.pageSize
    }
    this.props.getTagList(obj)
  }

  resetHandler() {
    this.setState({
      filterObj: {
        ...FILTER_INIT_VALUES
      }
    })
  }

  componentDidMount() {
    this.searchHandler()
  }

  componentWillReceiveProps({ tagList }) {
    if (this.props.tagList !== tagList) {
      tagList.data.forEach((item, index) => {
        item.key = item.id
      })
      this.pagination.total = tagList.totalElements
    }
  }
  render() {
    const { filterObj } = this.state
    const { tagList, userPermission } = this.props
    return (
      <div className='tag-list-component'>
        {/* <HzBreadcrumb /> */}
        <div className='filter-area'>
          <div className='inputs'>
            <Select
              value={filterObj.status}
              onChange={this.valueChangeHandler.bind(this, 'status')}
              placeholder='标签来源'
              className='input-item common-length'
              style={{ width: 120 }}
            >
              <Option value='自定义标签'>自定义标签</Option>
              <Option value='系统标签'>系统标签</Option>
            </Select>
            <Select
              value={filterObj.tagType}
              onChange={this.valueChangeHandler.bind(this, 'tagType')}
              placeholder='标签类型'
              className='input-item common-length'
              style={{ width: 120 }}
            >
              <Option value='基本属性'>基本属性</Option>
              <Option value='业务属性'>业务属性</Option>
              <Option value='关系属性'>关系属性</Option>
              <Option value='群体特征属性'>群体特征属性</Option>
              <Option value='扩展类属性'>扩展类属性</Option>
            </Select>
            <Input
              value={filterObj.nameOrNo}
              onChange={this.valueChangeHandler.bind(this, 'nameOrNo')}
              placeholder='请输入标签名称、描述'
              style={{ width: 628 }}
            />
          </div>
          <div className='buttons'>
            <Button type='primary' className='btn-item' onClick={this.searchHandler}>搜索</Button>
            <Button className='btn-item' onClick={this.resetHandler}>重置</Button>
          </div>
        </div>
        <div className='result-area'>
          <div className='list-header clearfix'>
            <span className='total-area'>共<span className='total-num'>{tagList.total || 0}</span>标签信息</span>
            <div className='create-tag-button'>
              {
              <Auth permissionPath={['tag/save']} noPermission={<></>}>
                <Link to='/root/main/customerMgt/tagMgt/createOrEdit?operation=create'>
                  <Button type='primary' className='btn-create'>新建标签</Button>
                </Link>
              </Auth>
              }
            </div>
          </div>
          <div className='table-area'>
            <div className='hz-table'>
              <Table
                columns={this.columns}
                bordered
                dataSource={tagList.data}
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
