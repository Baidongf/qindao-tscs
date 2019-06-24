import React from 'react'
import './component.scss'
import {Link} from 'react-router-dom'
import {Input, Button, Table, Select, DatePicker, Modal, message, Tabs} from 'antd'
import HzLink from 'components/HzLink'

import HzBreadcrumb from 'components/HzBreadcrumb'
import OrgSelect from 'components/OwnInstitution'
import {commonChangeHandler} from 'utils/antd'
import axios from "axios";
import Auth from "components/Auth"
import {checkPermission} from "utils/permission"

const PAGE_SIZE = 10
const Option = Select.Option
const FILTER_INIT_VALUES = {
  "industryIds": undefined,
  industryId: undefined,
  "institutionIds": undefined,
  "keyAreaFirstIds": undefined,
  "keyAreaFirstId": undefined,
  "nameOrCode": undefined,
  "status": undefined,
  statusSingle: undefined,
  "storeTime": undefined,
  projectStatus: undefined
}

class List extends React.Component {

  // 成员属性、状态的声明，均在构造函数内部
  constructor(props) {
    super(props)

    this.state = {
      filterObj: {
        ...FILTER_INIT_VALUES
      },
      supportList: [],
      keyAreaEnum: [],
      tabKey: '1'
    }
    this.columns = [
      {
        title: '项目名称',
        dataIndex: 'reportProName',
        className: 'td-name',
        render: (value, row, index) => checkPermission("projectStore/details") ?
          <HzLink to={`/root/main/projectReserve/detail?id=${row.id}`}><span
            title={value}>{value}</span></HzLink> : <span
            title={value}>{value}</span>,
      }, {
        title: '项目支持行业',
        dataIndex: 'proSupIndustryName',
        render: (value, row, index) => {
          return (<span title={value}>{value}</span>)
        }
      }, {
        title: '项目申报状态',
        dataIndex: 'projectStatusName',
        render: (value, row, index) => {
          return (<span title={value}>{value}</span>)
        }
      }, {
        title: '机构名称',
        dataIndex: 'institutionName',
      }, {
        title: '项目涉及重点领域',
        dataIndex: 'proMajorAreaFName',
        render: (text) => {
          return text ? text : '暂无'
        }
      }, {
        title: '项目入库时间',
        dataIndex: 'putDate',
      }, {
        title: '操作',
        dataIndex: 'control',
        width: 150,
        render: (text, record) => {
          // <Button type={'primary'} className={'right'} onClick={() => { this.goEdit() }}>编辑</Button>
          // goEdit = () => {
          //
          // }
          return (
            <div>
              <Button size="small" type={'primary'} disabled={!checkPermission("projectStore/update")} className={'right'}
                      onClick={() => {
                        this.props.history.push('/root/main/projectReserve/createOrEdit?operation=edit&id=' + record.id)
                      }}>编辑</Button>&nbsp;
              <Button size="small" disabled={!checkPermission("projectStore/delete")} className={'right'}
                      onClick={() => {
                        this.props.delProjectReserve(record.id, () => {
                          message.success("删除成功")
                          this.setState({
                            filterObj: {
                              ...FILTER_INIT_VALUES
                            }
                          }, () => {
                            this.searchHandler()
                          })
                        })
                      }}>删除</Button>
            </div>
          )
        }
      }
    ]
    checkPermission("projectStore/userQuery") && this.columns.splice(-2, 0, {
      title: '状态',
      width: 80,
      dataIndex: 'projectStatus',
      render: (text) => {
        return text === 1 ? "已完成" : '未完成'
      }
    });

    this.pagination = {
      showQuickJumper: true,
      total: 0,
      current: 1,
      pageSize: PAGE_SIZE,
      onChange: (page, pageSize) => {
        this.pagination.current = page
        this.searchHandler()
      }
    }

    this.searchHandler = this.searchHandler.bind(this)
    this.resetHandler = this.resetHandler.bind(this)
    // this.commonChangeHandler = commonChangeHandler.bind(this)
  }

  deleteOrg(id) {
    Modal.confirm({
      title: '确定删除',
      content: '确认删除该机构？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.deleteOrg(id).then(() => {
          this.searchHandler()
        })
      }
    })
  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'filterObj', key, value)
  }

  searchHandler() {
    const obj = Object.assign({}, this.state.filterObj)
    obj.pageNo = this.pagination.current
    obj.pageSize = this.pagination.pageSize
    obj.industryIds = obj.industryId
    obj.keyAreaFirstIds = obj.keyAreaFirstId && [obj.keyAreaFirstId]
    obj.status = obj.statusSingle && [obj.statusSingle]
    this.props.getProjectReserveList(obj)
  }

  resetHandler() {
    this.setState({
      filterObj: {
        ...FILTER_INIT_VALUES
      }
    })
  }

  handlePopupConfirm = (keys) => {
    // let result = keys.map(item => {
    //   let arr = item.split('-')
    //   return arr[arr.length - 1]
    // })
    // this.setState({filterObj: Object.assign(this.state.filterObj, {institutionIds: result})})
    this.setState({filterObj: Object.assign(this.state.filterObj, {institutionIds: keys})})
  }
  downloadHandler = (downloadUrl, wording) => {
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
      const fileName = `${wording}.xls`
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

  componentWillMount() {
    this.searchHandler()
    this.props.getManagerTree()
    this.props.getQueryEnum()


  }

  componentDidMount() {

  }

  componentWillReceiveProps({projectReserveList, queryEnum}) {
    if (this.props.projectReserveList !== projectReserveList) {
      projectReserveList.data.forEach((item, index) => {
        item.key = index
      })

      this.pagination.total = projectReserveList.total
    }

    if (this.props.queryEnum !== queryEnum) {

    }

  }

  handleTabChange = (key) => {
    this.setState({
      tabKey: key
    })
  }

  render() {
    const {filterObj, tabKey} = this.state
    const {projectReserveList, queryEnum, managerTreeToSelect} = this.props
    return (
      <div className=' project-reserve'>
        <HzBreadcrumb/>

        <div className='filter-area'>
          <div className='clearfix'>
            <div className='inputs'>
              <Select
                value={filterObj.industryId}
                onChange={this.valueChangeHandler.bind(this, 'industryId')}
                placeholder='项目支持行业'
                className='input-item common-length'
                mode="multiple"
                style={{width: 240}}
              >
                {queryEnum.industryEnum && Object.keys(queryEnum.industryEnum).map(key => {
                  return (
                    <Option value={key} key={key}>{queryEnum.industryEnum[key]}</Option>
                  )
                })}

              </Select>
              <Select
                value={filterObj.statusSingle}
                onChange={this.valueChangeHandler.bind(this, 'statusSingle')}
                placeholder='项目申报状态'
                className='input-item common-length'
                style={{width: 240}}
              >
                {queryEnum.reportProStatusEnum && Object.keys(queryEnum.reportProStatusEnum).map(key => {
                  return (
                    <Option value={key} key={key}>{queryEnum.reportProStatusEnum[key]}</Option>
                  )
                })}
              </Select>
              <DatePicker
                value={filterObj.storeTime}
                onChange={this.valueChangeHandler.bind(this, 'storeTime')}
                placeholder='项目入库时间'
                className='input-item common-length'
                style={{width: 240}}
              >
              </DatePicker>
              {
                checkPermission("projectStore/userQuery") && (
                  <Select
                    value={filterObj.projectStatus}
                    onChange={this.valueChangeHandler.bind(this, 'projectStatus')}
                    placeholder='状态'
                    className='input-item common-length'
                    style={{width: 200}}
                  >
                    {["未完成", '已完成'].map((key, index) => {
                      return (
                        <Option value={index} key={index}>{key}</Option>
                      )
                    })}
                  </Select>
                )
              }
            </div>
          </div>

          <div className='clearfix'>
            <div className='inputs'>
              {/*<OrgSelect _title='一级分行' handlePopupConfirm={this.handlePopupConfirm}/>*/}
              <Select
                mode="multiple"
                value={filterObj.institutionIds}
                onChange={this.handlePopupConfirm.bind(this)}
                placeholder='一级分行'
                className='input-item common-length'
                style={{width: 240}}
              >
                {/*{queryEnum.keyAreaEnum && Object.keys(queryEnum.keyAreaEnum).map(key => {*/}
                {/*  return (*/}
                {/*    <Option value={key} key={key}>{Object.keys(queryEnum.keyAreaEnum[key])[0]}</Option>*/}
                {/*  )*/}
                {/*})}*/}
                {managerTreeToSelect.map(item => {
                  return <Option value={item.id} key={item.id}>{item.name}</Option>
                })}
              </Select>
              <Select
                value={filterObj.keyAreaFirstId}
                onChange={this.valueChangeHandler.bind(this, 'keyAreaFirstId')}
                placeholder='项目设计重点领域'
                className='input-item common-length'
                style={{width: 240}}
              >
                {queryEnum.keyAreaEnum && Object.keys(queryEnum.keyAreaEnum).map(key => {
                  return (
                    <Option value={key} key={key}>{Object.keys(queryEnum.keyAreaEnum[key])[0]}</Option>
                  )
                })}
              </Select>
              <Input
                value={filterObj.nameOrCode}
                onChange={this.valueChangeHandler.bind(this, 'nameOrCode')}
                placeholder='请输入项目名称、项目编号'
                style={{width: 328}}
              />
            </div>
            <div className='buttons'>
              <Button type='primary' className='btn-item' onClick={this.searchHandler}>搜索</Button>
              <Button className='btn-item' onClick={this.resetHandler.bind(this)}>重置</Button>
            </div>
          </div>

        </div>

        <div className='result-area'>
          <div className='list-header clearfix'>
            <span className='total-area'>共<span className='total-num'>{projectReserveList.total || 0}</span>条项目</span>
            <div className='btns'>
              <Auth permissionPath={['projectStore/save']}>
                <Link to='/root/main/projectReserve/createOrEdit?operation=create'>
                  <Button type='primary'>新建项目</Button>
                </Link>
              </Auth>
              {/*<Auth permissionPath={['projectStore/export']}>*/}
              {/*  <Button onClick={this.downloadHandler.bind(this, "xxx", "项目储备表.xls")}*/}
              {/*          style={{marginLeft: "8px"}}>导出</Button>*/}
              {/*</Auth>*/}
            </div>
          </div>
          <div className='table-area'>
            <div className='hz-table'>
              <Table
                columns={this.columns}
                bordered
                dataSource={projectReserveList.data}
                pagination={this.pagination.total > 10 ? this.pagination : false}
                rowKey={'id'}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default List
