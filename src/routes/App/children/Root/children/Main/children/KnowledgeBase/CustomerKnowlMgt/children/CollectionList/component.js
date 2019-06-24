import React from 'react'
import './component.scss'
import {Input, Button, Table, Select, DatePicker, Modal} from 'antd'
import HzLink from 'components/HzLink'

import locale from 'antd/lib/date-picker/locale/zh_CN'
import {commonChangeHandler} from 'utils/antd'
import xing_red from "../../../img/xing-red.png";
import xing_black from "../../../img/xing-black.png";
import { FILTER_INIT_VALUES } from 'config/baseFilter'
const PAGE_NO = 1
const PAGE_SIZE = 10
const Option = Select.Option

const IMPORTANT_CONV = ['', '普通', '重要', '特别重要']

class List extends React.Component {

  // 成员属性、状态的声明，均在构造函数内部
  constructor(props) {
    super(props)
    this.props.onRef(this)
    this.state = {
      filterObj: {
        ...this.props.collectionListFilter
      },

      knowlObj: {
        id: undefined,
        status: undefined
      },

      rowStatus: {
        // 0: false
      }
    }



    this.pagination = {
      total: 0,
      current: this.props.collectionListFilter.pageNum,
      pageSize: this.props.collectionListFilter.pageSize,
      onChange: (page, pageSize) => {
        this.pagination.current = page
        this.props.collectionListFilter.pageNum = page
        // this.jobsQueryConfig.page = page - 1
        this.searchHandler()
      }
    }
    this.searchHandler = this.searchHandler.bind(this)
    this.resetHandler = this.resetHandler.bind(this)
    this.releaseKnowl = this.releaseKnowl.bind(this)
    this.collectKnowl = this.collectKnowl.bind(this)
    this.collectDelKnowl = this.collectDelKnowl.bind(this)
    // this.commonChangeHandler = commonChangeHandler.bind(this)
  }

  deleteRole(id) {
    Modal.confirm({
      title: '确定删除该条目？',
      content: '删除后该数据将无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.deleteKnowl(id).then(() => {
          this.searchHandler()
        })
      }
    })
  }

  collectKnowl(id) {
    this.props.collectKnowl(id, () => {
      this.searchHandler()
      this.props.collectionListHandler && this.props.collectionListHandler()
    })
  }

  collectDelKnowl(id) {
    this.props.collectDelKnowl(id, () => {
      this.searchHandler()
      this.props.collectionListHandler && this.props.collectionListHandler()
    })
  }

  releaseKnowl(id) {
    Modal.confirm({
      title: '确定发布',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const knowlObj = Object.assign(this.state.knowlObj, {id: id, status: '1'})
        this.props.saveKnowl(this.state.knowlObj, this.searchHandler())
      }
    })
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'filterObj', key, value)
  }

  searchHandler() {
    let params = Object.assign({}, this.state.filterObj)
    params.createTime = params.createTime && params.createTime.format('YYYY-MM-DD')
    params.pageNo = this.pagination.current

    this.props.getCollectionKnowlList(params)
  }

  resetHandler() {
    this.setState({
      filterObj: {
        ...FILTER_INIT_VALUES
      }
    })
  }
  tableSortHandler(currentPage,pagination, filters, sorter){
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
      // this.setState({
      //   filterObj: {...this.state.filterObj,sortField:filed,sortType:type,timeSort,viewSort}
      // },()=>{
      //   this.searchHandler()
      // })
      this.setState({
        filterObj: {...this.state.filterObj,sortField:filed,sortType:type,timeSort,viewSort}
      },()=>{
        this.props.setCollectionListFilter({...this.state.filterObj,sortField:filed,sortType:type,timeSort,viewSort})
        this.searchHandler()
      })
    }else{
    	if(pagination.current === undefined || (pagination.current===1&&currentPage===1)){
    		let filter = this.state.filterObj;
	    	filter.timeSort=""
	    	filter.viewSort=""
	    	this.setState({
	        filterObj: filter
	      },()=>{
          this.props.setCollectionListFilter({...filter})
		      this.searchHandler()
		    })
    	}
		}
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

  componentWillReceiveProps({knowlCollectionList}) {
    if (this.props.knowlCollectionList !== knowlCollectionList) {
      knowlCollectionList.data.forEach((item, index) => {
        item.key = item.id
      })

      // FIXME: knowlList 为数组，需要从 store 重新获取分页信息
      this.pagination.total = knowlCollectionList.total
    }
  }

  render() {
    const {filterObj} = this.state
    const {knowlCollectionList} = this.props
    let paramsStr = this.props.knowlParams.data[0] && this.props.knowlParams.data[0].value
    let params = []
    if (paramsStr) {
      params = paramsStr.split(',')
    }
    this.columns = [{
      title: '标题',
      dataIndex: 'title',
      width: 60,
      className: 'td-name',
      render: (value, row, index) => <HzLink to={`/root/main/customerKnowlMgt/detail?id=${row.id}`}><span
        title={value}>{value}</span></HzLink>,
    }, {
      title: '信息类型',
      dataIndex: 'type',
      width: 100,
      render: (value, row, index) => {
        return (<span title={value}>{value}</span>)
      }
    },
    {
      title: '重要程度',
      width: 30,
      dataIndex: 'important',
      render: (value, row, index) => {
        return (<span title={value}>{IMPORTANT_CONV[value]}</span>)
      }
      }, {
        title: '阅读量',
        width: 30,
        dataIndex: 'viewCount',
        sorter: true,
	      sortOrder: this.state.filterObj.viewSort,
        render: (value, row, index) => {
          return (<span title={value}>{value}</span>)
        }
      }, {
        title: '发布时间',
        dataIndex: 'publishTime',
        width: 30,
        sorter: true,
        sortOrder: this.state.filterObj.timeSort,
        render: (value, row, index) => {
          return (<span title={value}>{value ? value.split(' ')[0] : '暂无'}</span>)
        }
      }, , {
        title: '收藏',
        width: 30,
        dataIndex: 'collection',
        render: (value, row, index) => {
          return (
            <img src={value ? xing_red : xing_black}
                 onClick={value ? this.collectDelKnowl.bind(this, row.id) : this.collectKnowl.bind(this, row.id)}
                 className='star-icon'
                 alt=''
            />
          )
        }
      },]
    return (
      <div className='home-component knowlMgt-list'>
        <div className='list-component'>
          <div className='filter-area'>
            <div className='inputs'>
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
              <locale
                v-model="value1"
                type="date"
                placeholder="选择日期">
                <DatePicker
                  value={filterObj.createTime}
                  onChange={this.valueChangeHandler.bind(this, 'createTime')}
                />
              </locale>
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
              <Button className='btn-item' onClick={this.resetHandler.bind(this)}>重置</Button>
            </div>
          </div>
          <div className='result-area'>
            <div className='list-header clearfix'>
              <span className='total-area'>共找到<span className='total-num'>{knowlCollectionList.total || 0}</span>条知识库条目</span>
              {/*   <div className='btns'>
                <Link to='/root/main/knowledgeBase/knowlMgt/createOrEdit?operation=create'>
                  <Button type='primary' className='btn-create'>添加知识条目</Button>
                </Link>
              </div>*/}
            </div>
            <div className='table-area'>
              <div className='hz-table'>
                <Table
                  columns={this.columns}
                  bordered
                  dataSource={knowlCollectionList.data}
                  onChange={this.tableSortHandler.bind(this,this.pagination.current)}
                  rowKey={'key'}
                  pagination={this.pagination.total > this.props.collectionListFilter.pageSize ? this.pagination : false}
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
