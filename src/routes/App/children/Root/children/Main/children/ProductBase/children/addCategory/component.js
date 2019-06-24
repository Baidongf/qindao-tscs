import React from 'react'
import { Form, Row, Col, Select, Input, Button, message } from 'antd'
import { commonChangeHandler } from 'utils/antd'
import HzBreadcrumb from 'components/HzBreadcrumb'
import './component.scss'
import jiahaoIcon from './img/jiahao.png'

const FormItem = Form.Item
const Option = Select.Option
const labelProps = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

class CreateOrEditFrom extends React.Component {
  constructor(props) {

    super(props)
    this.state = {
      categoryObj: {
        "name": "",
        "parentId": undefined,
      }
    }

  }

  valueChangeHandler(key, value) {
    commonChangeHandler(this, 'categoryObj', key, value)
  }

  submitHandler = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      this.props.saveCategory(this.state.categoryObj, () => {
        message.success('新建二级分类成功')
        this.props.history.goBack()
      })
    })
  }
  goAddProduct = () => {
    this.props.history.push('/root/main/productBase/createOrEdit?operation=create')
  }

  componentWillMount() {
    this.props.getCatList()
  }

  componentDidMount() {
  }

  componentWillReceiveProps({ catList }) {

  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div className='create-product-base'>
        <HzBreadcrumb />
        <div className='breadcrumb-rea'></div>
        <div className='main-body'>
          <Form className='form'>
            <div className='form-content'>
              <div className='form-title'>
                <span className='text'>新建分类</span>
                {/*<div className='add-product' onClick={() => {*/}
                {/*  this.goAddProduct()*/}
                {/*}}>*/}
                {/*  <img src={jiahaoIcon} alt='' />*/}
                {/*  <p>添加明细产品</p>*/}
                {/*</div>*/}
              </div>
              <div className='form-body'>
                <Row>
                  <Col span={12}>
                    <FormItem label='一级分类' {...labelProps}>
                      {getFieldDecorator('parentId', {
                        rules: [{ required: true, message: '请选择一级分类' }
                        ],
                        initialValue: this.state.categoryObj.parentId
                      })(
                        <Select placeholder='请选择一级分类'
                          onChange={this.valueChangeHandler.bind(this, 'parentId')}
                        >
                          {this.props.catList && this.props.catList.data.map(item => {
                            return (
                              <Option value={item.id} key={item.id}>{item.name}</Option>
                            )
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label='二级分类' {...labelProps}>
                      {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入二级分类' }],
                        initialValue: this.state.categoryObj.name
                      })(
                        <Input placeholder='请输入二级分类'
                          onChange={this.valueChangeHandler.bind(this, 'name')}
                        />
                      )}
                    </FormItem>
                  </Col>

                </Row>
              </div>
            </div>
          </Form>

          <div className='btns-area clearfix'>
            <Button
              className='btn-submit  '
              type='primary'
              onClick={() => {
                this.submitHandler()
              }}
            >
              保存
            </Button>
            <Button style={{marginRight:8}} className='btn-cancel' onClick={() => {
              this.props.history.goBack()
            }}>取消</Button>

          </div>

        </div>
      </div>
    )
  }
}

const CreateOrEdit = Form.create()(CreateOrEditFrom)
export default CreateOrEdit
