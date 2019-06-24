import React from 'react'
import './component.scss'
import { Button, Col, DatePicker, Input, message, Modal, Popover, Row, Select } from 'antd'

import HzBreadcrumb from 'components/HzBreadcrumb'
import Auth from 'components/Auth'
import { dateFmt, isToday } from "utils/timeFormat";
import searchIcon from './image/search.png'
import axios from "axios";
import moment from "moment"

class List extends React.Component {

  // 成员属性、状态的声明，均在构造函数内部
  constructor(props) {
    super(props)
    this.state = {
      dateArr: [],
      weekMap: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      selectYear: new Date().getFullYear(),
      monthArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      selectMonth: new Date().getMonth() + 1,
      scheduleList: [],
      searchKeyWords: '',
      exportVisible: false,
      exportFormData: {
        startDate: undefined,
        endDate: undefined,
        status: "",
        endOpen: false,
      },
      selectDate: moment(),
      curSelected: null, // 当前选中的日期

    }
    this.currentDayScheduleList = []
  }

  getDay = (month, year) => {
    let dayInMonth = new Date(year, month + 1, 0).getDate()
    return {
      dayInMonth: dayInMonth,//一个月总天数
      firstDay: new Date(year, month, 1),//第一天
      lastDay: new Date(year, month, dayInMonth),//最后一天
    }
  }

  setDateArr = (month, year, callback) => {
    let result = []
    let currentDay = this.getDay(month, year)
    let firstWeek = currentDay.firstDay.getDay()
    let lastWeek = currentDay.lastDay.getDay()
    for (let i = currentDay.dayInMonth - 1; i >= 0; i--) {
      result.push({
        date: new Date(currentDay.lastDay.getTime() - i * 24 * 60 * 60 * 1000)
      })
    }
    for (let i = 1; i <= firstWeek; i++) {
      result.unshift({
        date: new Date(currentDay.firstDay.getTime() - i * 24 * 60 * 60 * 1000)
      })
    }
    for (let i = 1; i < (7 - lastWeek); i++) {
      result.push({
        date: new Date(currentDay.lastDay.getTime() + i * 24 * 60 * 60 * 1000)
      })
    }
    this.setState(Object.assign({}, this.state, { dateArr: result }), callback)
  }

  yearChangeHandler = (value) => {
    this.setState({
      selectYear: value,
      selectMonth: ''
    })
  }

  monthChangeHandler = (value) => {
    this.setState({
      selectMonth: value
    }, () => {
      let date = this.state.selectDate.format("YYYY-M-D")
      let dateArr = date.split("-")
      let month = Number(dateArr[1])
      let year = Number(dateArr[0])
      this.setDateArr(month, year, () => {
        this.props.getScheduleListByTime(date, (payload) => {
          this.setTodayScheduleList(year, month, payload.data)
          this.scheduleData(payload.data)
        })
      })
    })
  }

  todayHandler = () => {
    let now = new Date()
    this.setState({
      selectYear: now.getFullYear(),
      selectMonth: now.getMonth() + 1
    }, () => {
      this.setDateArr(this.state.selectMonth - 1, this.state.selectYear)
    })

  }

  newScheduleHandler = (item) => {
    if (item) {
      this.props.history.push('/root/main/schedule/createOrEdit?operation=create&startTime=' + dateFmt(item.date, 'yyyy-MM-dd'))
    } else {
      this.props.history.push('/root/main/schedule/createOrEdit?operation=create')
    }

  }

  scheduleData = (data) => {
    let dateArr = this.state.dateArr
    data.forEach(item => {
      let itemTime = new Date(item.startTime.replace(/-/g, '/'))
      let itemYear = itemTime.getFullYear()
      let itemMonth = itemTime.getMonth()
      let itemDay = itemTime.getDate()
      dateArr.forEach(date => {
        let dateYear = date.date.getFullYear()
        let dateMonth = date.date.getMonth()
        let dateDay = date.date.getDate()
        if (itemYear === dateYear && itemMonth === dateMonth && itemDay === dateDay) {
          if (date.data) {
            date.data.push(item)
          } else {
            date.data = [item]
          }
        }
      })
    })
    this.setState({ dateArr: dateArr })
  }

  calendarClickHandler = (item) => {
    this.setState({
      scheduleList: item.data || []
    })
    this.currentDayScheduleList = item.data || []
  }

  searchScheduleHandler = (value) => {
    let str = value.target.value
    this.state.searchKeyWords = str
    if (!str) {
      this.setState({
        scheduleList: this.currentDayScheduleList,
        searchKeyWords: str
      })
      return
    }
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => { //搜索节流
      this.props.getScheduleList({
        "pageNo": 1,
        "pageSize": 100000,
        keyWord: str
      }, (data) => {
        // data.data.forEach(item => {
        //   item.title = this.handleSearchStr(item.title, str)
        // })
        this.setState({
          scheduleList: data.data
        })
      })
    }, 300)
  }

  deleteScheduleHandler = (item, index, e) => {
    e.stopPropagation()
    Modal.confirm({
      title: '删除日程',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.deleteSchedule([item.id], () => {
          this.currentDayScheduleList = this.currentDayScheduleList.filter(schedule => {
            return schedule.id !== item.id
          })
          this.setState({
            scheduleList: this.state.scheduleList.filter((schedule) => {
              return schedule.id !== item.id
            })
          })
          let dateArr = this.state.dateArr
          dateArr.forEach(dateItem => {
            if (dateItem.data) {
              dateItem.data = dateItem.data.filter(data => {
                return data.id !== item.id
              })
            }
          })
          this.setState({
            dateArr: dateArr
          })
        })
      }
    })
  }

  editScheduleHandler = (item, e) => {
    e.stopPropagation()
    this.props.history.push(`/root/main/schedule/createOrEdit?operation=edit&id=${item.id}`)
  }

  goDetailHandler = (item, e) => {
    if (e) {
      e.stopPropagation()
    }
    // this.props.history.push(`/root/main/schedule/detail?id=${item.id}`)
    window.open(`/#/root/main/schedule/detail?id=${item.id}`)
  }

  setTodayScheduleList = (year, month, list) => { // 当前时间和传入时间不在同一年月，则把右侧显示设置为全部，否则设置为当天的日程
    let now = new Date()
    // if (now.getMonth() === month && now.getFullYear() === year) {
    //   let result = []
    //   list.forEach(item => {
    //     if (isToday(item.startTime)) {
    //       result.push(item)
    //     }
    //   })
    //   this.setState({scheduleList: result})
    //   this.currentDayScheduleList = result
    // } else {
    this.setState({ scheduleList: list })
    this.currentDayScheduleList = list
    // }
  }
  handleSearchStr = (str, searchWorks) => {
    if (!searchWorks) {
      return str
    }
    let reg = new RegExp(`${searchWorks}`)
    let result = str.replace(reg, `<font color="#e25555">${searchWorks}</font>`)
    return result
  }

  exportScheduleHandler = () => {

    this.setState({
      exportVisible: true
    })

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
  exportOk = () => {
    const { startDate, endDate, status } = this.state.exportFormData
    const obj = {
      startTimeFrom: startDate ? startDate.format("YYYY-MM-DD") : "",
      startTimeTo: endDate ? endDate.format("YYYY-MM-DD") : "",
      status,
    }
    // var exportParams = makeUrlString('/crm-fd/api/workSchedule/export', obj)
    var exportParams = `/crm-fd/api/workSchedule/export?startTimeFrom=${obj.startTimeFrom}&startTimeTo=${obj.startTimeTo}&status=${obj.status}`
    this.downloadHandler(exportParams, "工作日程")
    this.setState({
      exportVisible: false
    })
  }
  exportCannle = () => {
    this.setState({
      exportVisible: false
    })
  }
  disabledStartDate = (startValue) => {
    const endValue = this.state.exportFormData.endDate;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.exportFormData.startDate;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  onExpDataChange = (field, value) => {
    this.setState({
      exportFormData: { ...this.state.exportFormData, [field]: value },
    });
  }

  onStartChange = (value) => {
    this.onExpDataChange('startDate', value);
  }

  onEndChange = (value) => {
    this.setState({
      exportFormData: { ...this.state.exportFormData, endOpen: false },
    }, () => {
      this.onExpDataChange('endDate', value);
    });
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({
        exportFormData: { ...this.state.exportFormData, endOpen: true },
      });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({
      exportFormData: { ...this.state.exportFormData, endOpen: open },
    });
  }
  handleExpStatusChange = (val) => {
    this.setState({ exportFormData: { ...this.state.exportFormData, status: val } });
  }
  renderHightColor = (world, key) => {
    let renderRes = world.replace(new RegExp(key, "gm"), "<span style='color:red'>" + key + "</span>")
    return renderRes;
  }
  searchDateChange = (value) => {
    this.setState({
      selectDate: value
    }, () => {
      let date = value.format("YYYY-M-D")
      let dateArr = date.split("-")
      let month = Number(dateArr[1])
      let year = Number(dateArr[0])
      this.setDateArr(month - 1, year, () => {
        this.props.getScheduleListByTime(date, (payload) => {
          this.setTodayScheduleList(year, month - 1, payload.data)
          this.scheduleData(payload.data)
        })
      })
    })

  }

  componentWillMount() {
    let now = new Date()
    this.setDateArr(now.getMonth(), now.getFullYear(), () => {
      this.props.getScheduleListByTime(moment().format("YYYY-M-D"), (payload) => {
        this.setTodayScheduleList(now.getFullYear(), now.getMonth(), payload.data)
        this.scheduleData(payload.data)
      })
    })

  }

  render() {
    let getWeek = (date) => {
      if (typeof date === 'string') {
        date = new Date(date.replace(/-/g, '/'))
      }
      let weekMap = ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
      return weekMap[date.getDay()]
    }

    let Option = Select.Option
    let years = []
    for (let i = 1970; i <= new Date().getFullYear(); i++) {
      years.push(i)
    }
    let scheduleContent = (item) => {
      return (
        <div className='scheduleContent'>
          <div className='time'>{dateFmt(item.startTime, 'hh:mm')}</div>
          <div className='title'>{item.name}</div>
          <div className='description'>{item.description}</div>
        </div>
      )
    }

    let scheduleList = this.state.scheduleList
    let scheduleListMap = {}
    scheduleList.forEach((item, index) => {
      let currentTime = dateFmt(item.startTime, 'yyyy-MM-dd')
      item._index = index
      if (scheduleListMap[currentTime]) {
        scheduleListMap[currentTime].push(item)
      } else {
        scheduleListMap[currentTime] = [item]
      }
    })


    const { startDate, endDate, status, endOpen } = this.state.exportFormData

    return (
      <div className='schedule'>
        <HzBreadcrumb />
        <div className='content clearfix'>

          <div className='big-calendar'>
            <div className='calendar-header clearfix'>
              <div className='left'>
                {/*<Select*/}
                {/*  style={{width: '100px'}}*/}
                {/*  value={this.state.selectYear}*/}
                {/*  onChange={this.yearChangeHandler}*/}
                {/*>*/}
                {/*  {years.map((item, index) => {*/}
                {/*    return (*/}
                {/*      <Option value={item} key={index}>{item}</Option>*/}
                {/*    )*/}
                {/*  })}*/}
                {/*</Select>*/}
                {/*<Select*/}
                {/*  style={{width: '100px', marginLeft: '10px'}}*/}
                {/*  value={this.state.selectMonth}*/}
                {/*  onChange={this.monthChangeHandler}*/}
                {/*>*/}
                {/*  {this.state.monthArr.map((item, index) => {*/}
                {/*    return (*/}
                {/*      <Option value={item} key={index}>{item}</Option>*/}
                {/*    )*/}
                {/*  })}*/}
                {/*</Select>*/}
                {/*<Button style={{marginLeft: '10px'}} onClick={this.todayHandler}>今天</Button>*/}
                <DatePicker allowClear={false} onChange={this.searchDateChange} value={this.state.selectDate}></DatePicker>
              </div>
              <div className='right'>
                <Auth permissionPath={['workSchedule/save']}>
                  <Button type='primary' onClick={() => {
                    this.newScheduleHandler()
                  }} style={{ marginRight: '10px' }}>新建日程</Button>
                </Auth>
                <Button onClick={this.exportScheduleHandler}>导出日程</Button>
              </div>
            </div>
            <div className='week-map'>
              {this.state.weekMap.map((item, index) => {
                return (<div className='item' key={index}>
                  {item}
                </div>)
              })}
            </div>
            <div className='day-wrap'>
              {this.state.dateArr.map((item, index) => {
                return (<div className='item'
                  key={index}
                  onClick={() => {
                    // this.calendarClickHandler(item)
                    // this.newScheduleHandler(item)
                    this.setState({
                      selectDate: moment(item.date),
                      curSelected: item.date,
                    }, () => {
                      let date = this.state.selectDate.format("YYYY-M-D")
                      let dateArr = date.split("-")
                      let month = Number(dateArr[1])
                      let year = Number(dateArr[0])
                      this.setDateArr(month - 1, year, () => {
                        this.props.getScheduleListByTime(date, (payload) => {
                          this.setTodayScheduleList(year, month - 1, payload.data)
                          this.scheduleData(payload.data)
                        })
                      })
                    })
                  }}

                >
                  <div className='day-text-wrap clearfix'>
                    <div className={(this.state.curSelected && this.state.curSelected.getDate()) === item.date.getDate() ? 'day-text cur-selected' : (isToday(item.date) ? 'day-text today' : 'day-text')}> {item.date.getDate()}</div>                  </div>
                  <div className='day-schedule-wrap'>
                    {item.data && item.data.map((data, index) => {
                      return (
                        <Popover content={scheduleContent(data)} key={index} className={'schedule-pop'}
                          onClick={(e) => {
                            this.goDetailHandler(data, e)
                          }}>
                          <div className='schedule-item'>
                            <div className='title'>
                              <span></span>
                              <p>{data.title}</p>
                              {/*<div className='description'*/}
                              {/*     dangerouslySetInnerHTML={{__html: this.renderHightColor(item.description, this.state.searchKeyWords)}}/>*/}
                            </div>
                          </div>
                        </Popover>
                      )
                    })}
                  </div>
                </div>)
              })}
            </div>
          </div>
          <div className='schedule-wrap'>
            <div className='search-wrap'>
              <Input placeholder='搜索日程' onChange={this.searchScheduleHandler}
                addonAfter={<img alt='' src={searchIcon} style={{ width: '20px', height: '20px' }} />} />
            </div>
            <div className='schedule-list-wrap'>
              <div className='schedule-list'>
                {Object.keys(scheduleListMap).map((key) => {
                  return (
                    <div className='schedule-day-wrap' key={key}>
                      <div className='day-title'>
                        <span></span>
                        <p>{isToday(key) && '今天 '}{key} {getWeek(key)}</p>
                      </div>
                      <div className='day-item-wrap'>
                        {scheduleListMap[key].map((item, index) => {
                          return (<div className='day-item' key={index} onClick={() => {
                            this.goDetailHandler(item)
                          }}>
                            <div className='clock'></div>
                            <div className='schedule-item-content'>
                              <div className='time clearfix'>
                                <div className='label'>{dateFmt(item.startTime, 'hh:mm')}</div>
                                <div className='icon-wrap'>
                                  {item.canEdit && <div className='edit' onClick={(e) => {
                                    this.editScheduleHandler(item, e)
                                  }}></div>}
                                  {item.canEdit && <div className='delete' onClick={(e) => {
                                    this.deleteScheduleHandler(item, item._index, e)
                                  }}></div>}
                                </div>
                              </div>
                              <div className='name'
                                dangerouslySetInnerHTML={{ __html: this.renderHightColor(item.title, this.state.searchKeyWords) }} />
                              <div className='description'
                                dangerouslySetInnerHTML={{ __html: this.renderHightColor(item.description, this.state.searchKeyWords) }} />
                              {/*<div className='name'>{this.renderHightColor(item.title, "")}</div>*/}
                              {/*<div className='description'>{item.description}</div>*/}
                            </div>
                          </div>)
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
        <Modal
          className="exportModal"
          title="导出日程"
          visible={this.state.exportVisible}
          onOk={this.exportOk}
          onCancel={this.exportCannle}
          width={600}
        >
          <Row style={{ marginBottom: 10 }} type="flex" align="middle">
            <Col style={{ textAlign: 'right' }} span={4}>时间范围：</Col>
            <Col span={20}>
              <DatePicker
                disabledDate={this.disabledStartDate}
                format="YYYY-MM-DD"
                value={startDate}
                placeholder="开始时间"
                onChange={this.onStartChange}
                onOpenChange={this.handleStartOpenChange}
              />&nbsp;&nbsp;
              <DatePicker
                disabledDate={this.disabledEndDate}
                format="YYYY-MM-DD"
                value={endDate}
                placeholder="结束时间"
                onChange={this.onEndChange}
                open={endOpen}
                onOpenChange={this.handleEndOpenChange}
              /></Col>
          </Row>
          <Row type="flex" align="middle">
            <Col style={{ textAlign: 'right' }} span={4}>状态：</Col>
            <Col span={20}>
              <Select defaultValue="" style={{ width: 120 }} onChange={this.handleExpStatusChange}>
                <Option value="">全部</Option>
                <Option value={1}>已完成</Option>
                <Option value={0}>未完成</Option>
              </Select>
            </Col>
          </Row>
        </Modal>
      </div>

    )
  }
}

export default List
