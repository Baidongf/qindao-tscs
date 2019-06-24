import React from 'react'
import './component.scss'
import {Input, Button, Select, DatePicker, TreeSelect, Tabs} from 'antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import {checkPermission} from "utils/permission"

import echart from 'echarts'
import moment from 'moment'
import {commonChangeHandler} from 'utils/antd'
import SingleOwnInstitution from 'components/SingleOwnInstitution'


const PAGE_NO = 1
const PAGE_SIZE = 10
const Option = Select.Option

const TabPane = Tabs.TabPane

class List extends React.Component {

  // 成员属性、状态的声明，均在构造函数内部
  constructor(props) {
    super(props)
    this.state = {
      currentOrgTree: [], //当前用户机构树
      parentArr: [],//当前账户父级机构
      currentSelectOrgId: '',//当前选中的机构ID
      currentSelectCustomerManager: undefined,//当前选中的客户经理ID
      // currentSelectTime: new moment(new Date()),
      currentSelectTime: moment().subtract(1,"days"),
      allList: [],
      currentTopTenType: '',
      tabKey: "1"
    }
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
  }

  timeChange = (e) => {
    this.setState({currentSelectTime: e}, () => {
      this.getAllList()
    })
  }

  orgChange = (id) => {
    this.setState({
      currentSelectOrgId: id,
      currentSelectCustomerManager: undefined
    }, () => {
      this.props.findCustomerManagertList(id)
      this.getAllList()
      this.getTopTenList()
      this.getSingleList()
    })
  }


  customerManagerChange = (id) => {
    this.setState({currentSelectCustomerManager: id}, () => {
      this.getAllList()
      this.getTopTenList()
      this.getSingleList()
    })
  }

  getAllList = () => {
    if (this.state.currentSelectCustomerManager) {
      this.props.allByCustomerManagerId(this.state.currentSelectCustomerManager, this.state.currentSelectTime.format('YYYY-MM-DD'), (data) => {
        this.setState({allList: data.data})
      })
    } else {
      this.props.allByOrgId(this.state.currentSelectOrgId, this.state.currentSelectTime.format('YYYY-MM-DD'), (data) => {
        this.setState({allList: data.data})
      })
    }
  }

  getTopTenList = () => {
    if (this.state.currentSelectCustomerManager) {
      this.props.getTopTenListByUser(this.state.currentSelectCustomerManager, this.state.currentSelectTime.format('YYYY-MM-DD'), this.state.currentTopTenType)
    } else {
      this.props.getTopTenListByOrg(this.state.currentSelectOrgId, this.state.currentSelectTime.format('YYYY-MM-DD'), this.state.currentTopTenType)
    }
  }

  getSingleList = () => {
    let cst={}
    Object.assign(cst,this.state.currentSelectTime)
    let endTime = this.state.currentSelectTime.format('YYYY-MM-DD')
    let startTime = moment(cst).subtract(7, 'days').format('YYYY-MM-DD')
    if (this.state.currentSelectCustomerManager) {
      this.props.getSingleByUser(this.state.currentSelectCustomerManager, {
        "reportDateFrom": startTime,
        "reportDateTo": endTime,
        "reportKey": this.state.currentTopTenType
      })
    } else {
      this.props.getSingleByOrg(this.state.currentSelectOrgId, {
        "reportDateFrom": startTime,
        "reportDateTo": endTime,
        "reportKey": this.state.currentTopTenType
      })
    }
  }

  topTenTypeChange = (id) => {
    this.setState({
      currentTopTenType: id
    }, () => {
      this.getTopTenList()
      this.getSingleList()
    })
  }

  drawLine = (xDate, yDate, dom) => {
    let options = {
      xAxis: {
        type: 'category',
        data: xDate,
        axisLabel: {
          color: '#BDBDBD'
        },
        axisLine: {
          lineStyle: {
            color: '#F0F2F3'
          },
          splitLine: {
            show: false
          }
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#BDBDBD'
        },
        axisLine: {
          lineStyle: {
            color: '#F0F2F3'
          }
        },
        splitLine: {
          show: false
        },
      },

      series: [{
        data: yDate,
        type: 'line',
        itemStyle: {
          color: '#DF2323'
        },
        lineStyle: {}
      }]
    }
    echart.init(dom).setOption(options)
  }

  componentWillMount() {

    this.props.getReportTypes({}, () => {
      this.props.getOrgTree({}, () => {
        this.setState({
          currentSelectOrgId: this.currentUser.institutionId,//当前选中的机构ID
          // currentSelectCustomerManager: this.currentUser.id//当前选中的客户经理ID
        })
      })
    })


  }

  componentDidMount() {
  }

  componentWillReceiveProps({orgTree, reportTypes, topTenList}) {
    if (this.props.orgTree !== orgTree) {
      let currentUser = JSON.parse(window.localStorage.currentUser)
      let step = (obj) => {
        obj.title = obj.name
        obj.value = obj.id
        if (obj.id === currentUser.institutionId) {
          this.setState({
            currentOrgTree: [obj],
            currentSelectOrgId: obj.id,
            currentTopTenType: reportTypes.data[0].objectKey
          }, () => {
            this.getAllList()
            this.getTopTenList()
            this.getSingleList()
          })
          this.props.findCustomerManagertList(obj.id)

        }
        obj.children && obj.children.forEach(child => {
          child.parent = obj
          step(child)
        })
      }
      step(orgTree)
      setTimeout(() => {
        let result = []
        let findParent = (obj) => {
          if (obj.parent) {
            result.unshift(obj.parent.name)
            findParent(obj.parent)
          }
        }
        findParent(this.state.currentOrgTree[0])
        this.setState({parentArr: result})
      }, 0)
    }

    if (this.props.topTenList !== topTenList) {
      let result = []
      let indexMap = [0, 5, 1, 6, 2, 7, 3, 8, 4, 9]
      indexMap.forEach(indexItem => {
        topTenList.data.forEach((item, index) => {
          if (index === indexItem) {
            item._index = index
            result.push(item)
          }
        })
      })
      topTenList.data = result
    }
  }

  handleTabChange = (key) => {
    if (key === "1") {
      this.setState({
        tabKey: key,
        currentSelectOrgId: this.currentUser.institutionId,
        currentSelectCustomerManager: undefined
      }, () => {
        this.getAllList()
        this.getTopTenList()
        this.getSingleList()
      })
    } else {
      this.setState({
        tabKey: key,
        currentSelectOrgId: this.currentUser.institutionId,
        currentSelectCustomerManager: this.currentUser.id
      }, () => {
        this.getAllList()
        this.getTopTenList()
        this.getSingleList()
      })
    }
  }

  render() {
    let {customerManagerList, reportTypes, topTenList, singleList, tabKey} = this.props
    let topTenMaxValue = 0
    if (topTenList.data) {
      topTenList.data.forEach(item => {
        if (item.value >= topTenMaxValue) {
          topTenMaxValue = item.value
        }
      })
    }

    if (singleList.data) {
      let dateArr = []
      let valueArr = []
      singleList.data.forEach(item => {
        dateArr.push(item.reportDate)
        valueArr.push(item.value)
        setTimeout(() => {
          this.drawLine(dateArr, valueArr, document.getElementById('single-line-wrap'))
        }, 100)
      })
    }

    return (
      <div className='mark-result'>
        <HzBreadcrumb/>
        <div className='content'>

          <Tabs

            defaultActiveKey={tabKey}
            animated={false}
            onChange={this.handleTabChange}
          >

            {checkPermission("marketingCampaignsReport/insitution")&&<TabPane
              tab={'机构成果'}
              key="1"
            >
              {/*<Auth permissionPath={['customer/search']}>*/}
              {/*  <CustList />*/}
              {/*</Auth>*/}
              <div className='card-wrap'>
                <div className='filter clearfix'>
                  <DatePicker className='filter-item' value={this.state.currentSelectTime} onChange={(e) => {
                    this.timeChange(e)
                  }}/>
                  {/*{this.state.parentArr.map((item, index) => {*/}
                  {/*  return (*/}
                  {/*    <Input disabled={true} value={item} className='filter-item' key={index}/>*/}
                  {/*  )*/}
                  {/*})}*/}
                  <TreeSelect
                    // disabled={!checkPermission("marketingCampaignsReport/insitution")}
                    style={{width:280}}
                    dropdownClassName="markresult-select-tree"
                    placeholder="请选择机构"
                    treeData={this.state.currentOrgTree} className='filter-item'
                    value={this.state.currentSelectOrgId} onChange={(e) => {
                    this.orgChange(e)
                  }}/>
                  {/*<SingleOwnInstitution*/}
                  {/*  value={this.state.currentSelectOrgId}*/}
                  {/*  onChange={(e) => {*/}
                  {/*    console.log(e)*/}
                  {/*    this.orgChange(e)*/}
                  {/*  }}*/}
                  {/*/>*/}
                  <Select
                    placeholder="请选择客户经理"
                    className='filter-item'
                    onChange={(e) => {
                    this.customerManagerChange(e)
                  }}
                    value={this.state.currentSelectCustomerManager}>
                    {customerManagerList.map(item => {
                      return (
                        <Option value={item.id} key={item.id}>{item.name}</Option>
                      )
                    })}
                  </Select>
                  {/*<Button type='primary' className='out-btn'>导出</Button>*/}
                </div>
                <div className='card-list'>
                  {this.state.allList.map(item => {
                    return (
                      <div className='item' key={item.objectKey}>
                        <div className='name'>{item.reportName}</div>
                        <div className='money clearfix'>
                          <div className='value'>{item.value}</div>
                          <div className='unit'>{item.unit}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </TabPane>}
            {checkPermission("marketingCampaignsReport/user")&&<TabPane
              tab={'个人成果'}
              key="2"
            >
              {/*<Auth permissionPath={['customer/search']}>*/}
              {/*  <CustList />*/}
              {/*</Auth>*/}
              <div className='card-wrap'>
                <div className='filter clearfix'>
                  <DatePicker className='filter-item' value={this.state.currentSelectTime} onChange={(e) => {
                    this.timeChange(e)
                  }}/>
                  {this.state.parentArr.map((item, index) => {
                    return (
                      <Input disabled={true} value={item} className='filter-item' key={index}/>
                    )
                  })}
                  {/*<Button type='primary' className='out-btn'>导出</Button>*/}
                </div>
                <div className='card-list'>
                  {this.state.allList.map(item => {
                    return (
                      <div className='item' key={item.objectKey}>
                        <div className='name'>{item.reportName}</div>
                        <div className='money clearfix'>
                          <div className='value'>{item.value}</div>
                          <div className='unit'>{item.unit}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </TabPane>}
          </Tabs>
          <div className='top-ten'>
            <div className='filter'>
              <Select className='select' value={this.state.currentTopTenType} onChange={(id) => {
                this.topTenTypeChange(id)
              }}>
                {reportTypes.data && reportTypes.data.map(item => {
                  return (
                    <Option value={item.objectKey} key={item.objectKey}>{item.name}</Option>
                  )
                })}
              </Select>
            </div>
            <div className='top-ten-content'>
              {topTenList.data && topTenList.data.map((item, index) => {
                return (
                  <div className='item clearfix' key={item.objectKey}>
                    <div className='label'>{item._index + 1}</div>
                    <div
                      className='name'>{this.state.currentSelectCustomerManager ? item.userName : item.institutionName}</div>
                    <div className='value-wrap'>
                      <div className='value' style={{width: item.value / topTenMaxValue * 100 + '%'}}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className='one-type'>
            <div className='filter'>
              <Select className='select' value={this.state.currentTopTenType} onChange={(id) => {
                this.topTenTypeChange(id)
              }}>
                {reportTypes.data && reportTypes.data.map(item => {
                  return (
                    <Option value={item.objectKey} key={item.objectKey}>{item.name}</Option>
                  )
                })}
              </Select>
            </div>
            <div id='single-line-wrap'></div>
          </div>
        </div>
      </div>
    )
  }
}

export default List
