import React from 'react'
import './component.scss'
import {Link} from 'react-router-dom'
import {Button, Pagination, DatePicker, message} from 'antd'
import HzLink from 'components/HzLink'
import {getQueryString} from 'utils/url'
import InfoRow from "./InfoRow"
import {checkPermission} from "utils/permission"
import moment from "moment"


import {commonChangeHandler} from 'utils/antd'
import {makeUrlString} from "../../../../../../../../../../../../utils";
import axios from "axios";


const PAGE_SIZE = 10
const FILTER_INIT_VALUES = {
  status: undefined,
  nameOrNo: undefined,
  name: undefined,
  date:null
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
        // 0: false
      },
      total: 1,
      currentPage: 1,
      pageSize: 10
    }

    this.selectDate=moment()
    this.pagination = {
      showQuickJumper: true,
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
    // this.commonChangeHandler = commonChangeHandler.bind(this)
  }


  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'filterObj', key, value)
  }

  searchHandler() {
    const obj = {
      projectDetector: getQueryString(window.location.href, 'id'),
      pageNo: this.state.currentPage,
      pageSize: this.state.pageSize,
      createDate:this.state.date?moment(this.state.date).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD")
    }
    this.props.getCustomerList(obj)
  }

  resetHandler() {
    this.setState({
      filterObj: {
        ...FILTER_INIT_VALUES
      }
    })
  }

  pageChange = (page, pageSize) => {
    this.setState({
      currentPage: page
    }, () => {
      this.searchHandler()
    })
  }
  dateChangeHandle=(date, dateString)=>{
    if(date!==null){
      date = date.format("YYYY-MM-DD")
    }
    this.setState({
      date:date
    },()=>{this.searchHandler()})
  }

  componentWillMount() {
    this.props.getProjectList()
  }

  componentDidMount() {
    this.searchHandler()
  }

  componentWillReceiveProps({customerList}) {
    if (customerList !== this.props.customerList) {
      this.setState({
        total: customerList.total
      })
    }
  }

  render() {
    const {filterObj} = this.state
    const {customerList} = this.props

    return (
      <div className='list-component'>
        <div className='result-area'>
          <div className='list-header clearfix'>
            <span className='total-area'>共找到<span className='total-num'>{customerList.total || 0}</span>家关联客户</span>
            <DatePicker format="YYYY-MM-DD"  style={{marginLeft:22}} onChange={this.dateChangeHandle} />
            {checkPermission("projectDector/export")&&<div che style={{marginLeft:10}} className='btns'>
              <Button onClick={()=>{
                const obj = {
                  projectDetector: getQueryString(window.location.href, 'id'),
                  createDate:this.selectDate?moment(this.selectDate).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD")
                }
                var exportParams = makeUrlString('/crm-fd/api/projectDetector/export',obj)
                  axios({
                    url: exportParams,
                    method: 'get',
                    responseType: 'blob',
                  }).then(response => {
                    const blob = new Blob(
                      [response.data],
                      {
                        type: 'application/octet-stream;charset=utf-8'
                      }
                    )
                    const fileName = `项目监测.xls`
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
              }} className='btn-create'>导出</Button>
            </div>}
            {checkPermission("projectDetector/save")&&<div className='btns'>
              <Link to={`/root/main/projectMonitor/customerInsert?id=${getQueryString(window.location.href, 'id')}`}>
                <Button type='primary' className='btn-create'>添加客户</Button>
              </Link>
            </div>}

          </div>
          <div className='table-area clearfix'>
            {
              customerList.data.map((item, index) => {
                return (<InfoRow key={index} data={item}/>)
              })
            }
            <Pagination
              total={this.state.total}
              pageSize={this.state.pageSize}
              current={this.state.currentPage}
              style={{float: 'right', marginRight: '20px', marginTop: '20px'}}
              onChange={this.pageChange}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default List
