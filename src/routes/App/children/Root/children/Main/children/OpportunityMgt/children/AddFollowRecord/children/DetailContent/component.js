import React from 'react'
import './component.scss'
import { Button, Form, Row, Col, Spin ,Radio} from 'antd'
class OpportunityDetailContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status:{
        "0": '新建',
        "1": '沟通',
        "2": '完成',
        "3": '终止'
      }
    }
  }

  render() {
    const {
      customerType,
      // customerName,
      createTime,
      source,
      type,
      description
    } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 28 },
    };
    const { status } = this.state
    return (
      <div className='add-record-opportunity-detail-content-component'>
        <div className='title'>商机内容</div>

        <div className='detail-row'>
          <span className='row-title'>客户类型</span>
          <span className='row-content'>{customerType || '-'}</span>
        </div>

        {/* <div className='detail-row'>
          <span className='row-title'>客户名称</span>
          <span className='row-content'>{customerName || '-'}</span>
        </div> */}

        <div className='detail-row'>
          <span className='row-title'>创建时间</span>
          <span className='row-content'>{createTime || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>商机来源</span>
          <span className='row-content'>{source || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>商机类型</span>
          <span className='row-content'>{type || '-'}</span>
        </div>

        <div className='detail-row'>
          <span className='row-title'>商机描述</span>
          <span className='row-content'>{description || '-'}</span>
        </div>

        <div className='detail-row special-detail-row'>
          <span className='row-title'>商机状态</span>
          {/* <span className='row-content'>{status || '-'}</span> */}
          <span  className="row-content">
            <Form {...formItemLayout}>
              <Form.Item>
                {getFieldDecorator('radio-group',{
                  initialValue:this.props.curStatus === 0 ? String(this.props.curStatus+1):String(this.props.curStatus)
                })(
                  <Radio.Group>
                    {
                      Object.keys(status).map((key,index) =>{
                        return(<Radio disabled={index === 0} value={key}>{status[key]}</Radio>)
                      })
                    }
                  </Radio.Group>
                )}
              </Form.Item>
            </Form>
          </span>
        </div>
      </div>
    )
  }
}


export default Form.create({"onValuesChange":(props, changedValues, allValues)=>{
  props.changeStatus(changedValues["radio-group"])
}})(OpportunityDetailContent)
