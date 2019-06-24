import React from 'react'
import './component.scss'
import {Link, HashRouter} from 'react-router-dom'
import {Input, Button, Table, Select, Tag, DatePicker, Modal, Breadcrumb, Switch, message} from 'antd'
import HzLink from 'components/HzLink'

import HzBreadcrumb from 'components/HzBreadcrumb'

import Locale from 'antd/lib/date-picker/locale/zh_CN'
import moment from 'moment'
import {commonChangeHandler} from 'utils/antd'

import xing_red from '../../../img/xing-red.png'
import xing_black from '../../../img/xing-black.png'
import {checkPermission} from "../../../../../../../../../../../utils/permission";

const confirm = Modal.confirm;
const PAGE_NO = 1
const PAGE_SIZE = 10
const Option = Select.Option
const FILTER_INIT_VALUES = {
  startDate: "",
  keyWord: undefined,
  pageNo: PAGE_NO,
  pageSize: PAGE_SIZE,
  type: undefined,
  status: undefined,
  endDate:"",
  sortType:"",
  sortField:"",
  viewSort:"",  //控制显示
  timeSort:"" //控制显示
}

const IMPORTANT_CONV = ['', '普通', '重要', '特别重要']

class List extends React.Component {

  // 成员属性、状态的声明，均在构造函数内部
  constructor(props) {
    super(props)

    this.state = {
      filterObj: {
        ...FILTER_INIT_VALUES
      },

      knowlObj: {
        id: undefined,
      },

      rowStatus: {
        // 0: false
      },

      startValue: null,
      endValue: null,
      endOpen: false,
    }


    this.pagination = {
      total: 0,
      current: 1,
      pageSize: PAGE_SIZE,
      onChange: (page, pageSize) => {
        this.pagination.current = page
        // this.jobsQueryConfig.page = page - 1
        this.searchHandler()
      }
    }
    this.searchHandler = this.searchHandler.bind(this)
    this.resetHandler = this.resetHandler.bind(this)
    this.collectKnowl = this.collectKnowl.bind(this)
    this.collectDelKnowl = this.collectDelKnowl.bind(this)
    // this.commonChangeHandler = commonChangeHandler.bind(this)
  }

  sendHandler = (knowlObj) => {
    // const knowlObj = Object.assign({}, this.state.knowlObj)
    knowlObj.notifyFlag = false;
    // 日期转化为时间戳格式
    ['effectiveDate', 'expiryDate'].forEach(dateKey => {
      if (knowlObj[dateKey]) {
        knowlObj[dateKey] = knowlObj[dateKey].valueOf()
      }
    })
    knowlObj.status = 1
    this.props.updateKnowl(knowlObj, this.searchHandler)
  }

  deleteRole(id) {
    Modal.confirm({
      title: '确定删除该条目？',
      content: '删除后该数据将无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        //this.props.deleteRole(id).then(() => {
        //  this.searchHandler()
        //})
      }
    })
  }

  collectKnowl(id) {
    this.props.collectKnowl(id, this.searchHandler)
  }

  collectDelKnowl(id) {
    this.props.collectDelKnowl(id, this.searchHandler)
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'filterObj', key, value)
  }

  searchHandler() {
    let params = Object.assign({}, this.state.filterObj)
    params.startDate = params.startDate && params.startDate.format('YYYY-MM-DD')
    params.endDate = params.endDate && params.endDate.format('YYYY-MM-DD')
    params.pageNo = this.pagination.current
    this.props.getALLKnowList(params)
  }
  tableSortHandler = (pagination, filters, sorter) => {
    if(sorter&&sorter.field&&this.state.filterObj.filed!==(sorter.field==='viewCount'?1:0)&&!(this.state.filterObj.viewSort===sorter.order||this.state.filterObj.timeSort===sorter.order)){
      this.pagination.current=1
      // this.state.filterObj[sorter.field+"Sort"]=sorter.order
      let type,filed,viewSort,timeSort
      if(sorter.field==="viewCount"){
        filed=1
        viewSort=sorter.order
        timeSort=""
      }else {
        filed=0
        viewSort=""
        timeSort=sorter.order
      }
      type=sorter.order==="ascend"?0:1
      this.setState({
        filterObj: {...this.state.filterObj,sortField:filed,sortType:type,timeSort,viewSort}
      },()=>{
        this.searchHandler()
      })

    }
  }
  resetHandler() {
    this.setState({
      filterObj: {
        ...FILTER_INIT_VALUES
      }
    })
  }

  editHandler = (item) => {
    this.props.history.push('/root/main/managerKnowlMgt/createOrEdit?operation=edit&id=' + item.id)
  }

  deleteHandler = (item) => {
    Modal.confirm({
      title: '确定删除该信息？',
      content: '删除后该信息将无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.deleteKnowlItem(item.id, data => {
          this.searchHandler()
          message.success('删除成功')
        })
      }
    })

  }

  // 时间控件
  disabledStartDate = (startValue) => {
    const endValue = this.state.filterObj.endDate;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.filterObj.startDate;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({endOpen: true});
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({endOpen: open});
  }


  componentWillMount() {

    this.props.getKnowlParams((data) => {
      /* this.setState({
         filterObj: Object.assign(this.state.filterObj, {
           type: data.data[0].value.split(',')[0]
         })
       }, () => {
         this.searchHandler()
       })*/
      this.searchHandler()
    })

  }

  componentDidMount() {

  }

  componentWillReceiveProps({knowlAllList}) {
    if (this.props.knowlList !== knowlAllList) {
      knowlAllList.data.forEach((item, index) => {
        item.key = item.id + item.title
      })

      // FIXME: knowlList 为数组，需要从 store 重新获取分页信息
      this.pagination.total = knowlAllList.total
    }

  }

  render() {
    const {filterObj, endOpen} = this.state
    const {knowlAllList} = this.props
    let paramsStr = this.props.knowlParams.data[0] && this.props.knowlParams.data[0].value
    let params = []
    if (paramsStr) {
      params = paramsStr.split(',')
    }
    let columns = [
      {
      title: '标题',
      dataIndex: 'title',
      className: 'td-name',
      render: (value, row, index) => <HzLink to={`/root/main/managerKnowlMgt/detail?id=${row.id}`}><span
        title={value}>{value}</span></HzLink>,
    },
      {
      title: '信息类型',
      dataIndex: 'type',

      render: (value, row, index) => {
        return (<span title={value}>{value}</span>)
      }
    },
      {
        title: '重要程度',

        dataIndex: 'important',
        render: (value, row, index) => {
          return (<span title={value}>{IMPORTANT_CONV[value]}</span>)
        }
      },
      {
        title: '状态',
        dataIndex: 'status',

        render: (value, row, index) => {
          return (<span title={value}>{parseInt(value) === 0 ? '未发布' : '已发布'}</span>)
        }
      },
      {
        title: '阅读量',
        dataIndex: 'viewCount',
        sorter: true,
        sortOrder: this.state.filterObj.viewSort,
      },
      {
        title: '更新时间',
        dataIndex: 'modifyTime',
        sorter: true,
        sortOrder: this.state.filterObj.timeSort,
        render: (value, row, index) => {
          return (<span title={value}>{value.split(' ')[0]}</span>)
        }
      },
    ]
    if(checkPermission(["knowledge/update","knowledge/delete","knowledge/publish"])){
      columns.push( {
        title: '操作',
        width: 210,
        dataIndex: 'collection',
        render: (value, row, index) => {
          return (<div className='operation'>
            {checkPermission("knowledge/update")&&<span onClick={() => {
              this.editHandler(row)
            }}>编辑</span>}
            {checkPermission("knowledge/delete")&&<span onClick={() => {
              this.deleteHandler(row)
            }}>删除</span>}
            {checkPermission("knowledge/publish")&&row.status === 0 && <span onClick={() => {
              this.sendHandler(row)
            }}>发表</span>}
          </div>)
        }
      })
    }
    return (
      <div className='home-component knowlMgt-list'>
        <div className='list-component'>
          {/*<HzBreadcrumb/>*/}
          <div className='filter-area'>
            <div style={{display: "block", float: "none"}} className='inputs'>
              <Select
                value={filterObj.type}
                onChange={this.valueChangeHandler.bind(this, 'type')}
                placeholder='信息类型'
                className='input-item common-length'
                style={{width: 240}}
              >
                {params.map(item => {
                  return (<Option value={item} key={item}>{item}</Option>)
                })}
              </Select>
              <Select
                value={filterObj.status}
                onChange={this.valueChangeHandler.bind(this, 'status')}
                placeholder='状态'
                className='input-item common-length'
                style={{width: 240}}
              >
                {["未发布", "已发布"].map((item, index) => {
                  return (<Option value={index} key={index}>{item}</Option>)
                })}
              </Select>
            </div>
            <div className='inputs'>
              {/*<locale*/}
              {/*  v-model="value1"*/}
              {/*  type="date"*/}
              {/*  placeholder="选择日期">*/}
              {/*  <DatePicker*/}
              {/*    value={filterObj.startDate}*/}
              {/*    onChange={this.valueChangeHandler.bind(this, 'startDate')}*/}
              {/*  />*/}
              {/*</locale>*/}
              <DatePicker
                disabledDate={this.disabledStartDate}
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                value={filterObj.startDate}
                placeholder="开始时间"
                onChange={this.valueChangeHandler.bind(this, 'startDate')}
                onOpenChange={this.handleStartOpenChange}
                style={{marginRight: 8}}
              />
              <DatePicker
                disabledDate={this.disabledEndDate}
                format="YYYY-MM-DD"
                value={filterObj.endDate}
                placeholder="结束时间"
                onChange={this.valueChangeHandler.bind(this, 'endDate')}
                open={endOpen}
                onOpenChange={this.handleEndOpenChange}
              />
              <Input
                value={filterObj.keyWord}
                onChange={this.valueChangeHandler.bind(this, 'keyWord')}
                placeholder='请输入信息名称、内容'
                style={{width: 328, marginLeft: 10}}
              />
            </div>
            <div className='buttons'>
              <Button type='primary' className='btn-item' onClick={() => {
                this.pagination.current = 1
                this.searchHandler()
              }}>搜索</Button>
              <span className='btn-item reset-btn' onClick={this.resetHandler.bind(this)}>重置</span>
            </div>
          </div>
          <div className='result-area'>
            <div className='list-header clearfix'>
              <span className='total-area'>共找到<span className='total-num'>{knowlAllList.total || 0}</span>条知识库条目</span>
              <div className='btns'>
                {checkPermission("knowledge/save")&&<Link to='/root/main/managerKnowlMgt/createOrEdit?operation=create'>
                  <Button type="primary"
                  >信息创建</Button>
                </Link>}
              </div>
            </div>
            <div className='table-area'>
              <div className='hz-table'>
                <Table
                  columns={columns}
                  bordered
                  dataSource={knowlAllList.data}
                  onChange={this.tableSortHandler}
                  rowKey={'key'}
                  pagination={this.pagination.total > 10 ? this.pagination : false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default List
