import React from 'react'
import queryString from 'query-string'
import './component.scss'
import moment from 'moment'
import HzBreadcrumb from "components/HzBreadcrumb";


const TYPE_CONV = {
  '1': '行内规章（管理方法）',
  '2': '行内规章（操作规范）',
  '3': '行内规章（价格指导）',
  '4': '外部政策',
  '5': '行业动态',
  '6': '经典案例'
}

class Detail extends React.Component {
  constructor(props) {

    super(props)
    this.state = {
      knowlObj: {
        title: this.initStatus, // 标题
        type: this.initStatus, // 类型
        content: this.initStatus, // 正文
        important: this.initStatus, // 重要程度
        status: this.initStatus, // 状态
        viewCount: this.initStatus // 阅读次数
      }
    }
    this.queryObj = queryString.parse(props.location.search)
    this.id = this.queryObj.id
  }

  //saveKnowl(knowlObj, noop) {}

  componentWillMount() {
    if(this.props.history.action === "POP"){
      this.props.getKnowlColectionDetail(this.id)
    }
  }

  componentWillReceiveProps({ knowlDetail }) {
    if (knowlDetail !== this.props.knowlDetail) {

      // 日期转化为时间戳格式
      ['effectiveDate', 'expiryDate'].forEach(dateKey => {
        if (knowlDetail[dateKey]) {
          knowlDetail[dateKey] = moment(knowlDetail[dateKey])
        }
      })
      this.setState({
        knowlObj: { ...knowlDetail }
      })
    }
  }

  render() {
    const { knowlObj } = this.state
    const importantMap = ['', '普通', '重要', '特别重要']
    return (
      <div className='knowledge-detail'>
        <HzBreadcrumb />
        <div className='content'>
          <div className='title'>{knowlObj.title}</div>
          <div className='label-group clearfix'>
            <div className='type'>{knowlObj.type}</div>
            {importantMap[knowlObj.important]&&<div className='important'>{importantMap[knowlObj.important]}</div>}
            <div className='view'>阅读：{knowlObj.viewCount}</div>
            <div className='time'>{knowlObj.createTime && knowlObj.createTime.split(' ')[0]}</div>
          </div>
          <div className='description'>
            <div className='title'>主要内容</div>
            <div className='description-content'>{knowlObj.content}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Detail
