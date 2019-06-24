import React from 'react'
import './component.scss'
import { Modal, Form, Input, Button } from 'antd'
import md5 from 'js-md5'
import { updatePassword } from 'store/modules/account'
import { connect } from 'react-redux'

const FormItem = Form.Item

class UpdatePassForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      canSubmit: false,
      formFields: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  }

  lenthRule = {min: 6, max: 20, message: '请检查密码长度:6-20位'}

  submitHandler() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.closeModalHandler()
        this.props.updatePassword(md5(this.state.formFields.oldPassword), md5(this.state.formFields.newPassword))
      }
    })
  }

  validate (fieldNames) {
    this.props.form.validateFields(fieldNames, { first: true }, (err, values) => {
      const { formFields } = this.state
      Object.assign(formFields, values)
    })
  }

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次输入的新密码不匹配！');
    } else {
      callback();
    }
  }

  blurHandler(key) {
    this.validate([key])
  }

  cancelHandler() {
    this.props.closeModalHandler()
  }

  valueChangeHandler(key, value) {
    if (typeof value === 'object') {
      this.state.formFields[key] = value.target.value
    } else {
      this.state.formFields[key] = value
    }
    this.setState({
      formFields: this.state.formFields
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const isShowTips = this.props.login === 'error' ? 'show' : 'hide'
    return (
    <Modal title='修改密码' visible={true}
      okText={'保存'}
      onOk={this.submitHandler.bind(this)} onCancel={this.cancelHandler.bind(this)}
    >
      <Form>
        <FormItem
            label="原密码"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 8 }}
        >
          {getFieldDecorator('oldPassword', {
            rules: [{ required: true, message: '请输入密码!' }, this.lenthRule],
          })(
            <Input placeholder='请输入原密码' type='password'
              // ref={node => this.password = node} suffix={passwordSuffix}
              // onFocus={this.handleFocus.bind(this, 'password')}
              onChange={this.valueChangeHandler.bind(this, 'oldPassword')}
              onBlur={this.blurHandler.bind(this, 'oldPassword')}
            />
          )}
        </FormItem>
        <FormItem
            label="新密码"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 8 }}
            className='newPass-form-item'
        >
          {getFieldDecorator('newPassword', {
            rules: [{ required: true, message: '请输入新密码!' }, this.lenthRule],
          })(
            <Input placeholder='请输入新密码' type='password'
              // ref={node => this.password = node} suffix={passwordSuffix}
              // onFocus={this.handleFocus.bind(this, 'password')}
              onChange={this.valueChangeHandler.bind(this, 'newPassword')}
              onBlur={this.blurHandler.bind(this, 'newPassword')}
            />
          )}
            <span>6-20位字符，区分大小写</span>
        </FormItem>
        <FormItem
            label="确认密码"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 8 }}
        >
          {getFieldDecorator('confirmPassword', {
            rules: [
              { required: true, message: '请输入确认密码!' },
              this.lenthRule,
              { validator: this.checkPassword }
            ],
            validateFirst: true
          })(
            <Input placeholder='请输入确认密码' type='password'
              // ref={node => this.password = node} suffix={passwordSuffix}
              // onFocus={this.handleFocus.bind(this, 'password')}
              onChange={this.valueChangeHandler.bind(this, 'confirmPassword')}
              onBlur={this.blurHandler.bind(this, 'confirmPassword')}
            />
          )}
        </FormItem>
      </Form>
    </Modal>

    )
  }
}

const mapDispatchToProps = {
  updatePassword
}

const mapStateToProps = (state) => ({
})

const WrappedUpdatePassForm = Form.create()(connect(mapStateToProps, mapDispatchToProps)(UpdatePassForm))
export default WrappedUpdatePassForm
