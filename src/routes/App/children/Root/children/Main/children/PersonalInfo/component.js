import React from 'react'
import './component.scss'
import { Form, Input, Button } from 'antd'
import { commonChangeHandler } from 'utils/antd'

class resetPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      canSubmit: false,
      resetPassword: {
        newPassword: '',
        oldPassword: '',
        reNewPassword: ''
      }
    }

    this.fieldsValidateStatus = {
      newPassword: false,
      oldPassword: false,
      reNewPassword: false
    }
  }

  valueChangeHandler = (key, value) => {
    commonChangeHandler(this, 'resetPassword', key, value)
    setTimeout(() => {
      this.validate(key)
    })
  }

  validate(fieldName) {
    this.props.form.validateFields([fieldName], { first: true }, (err, values) => {
      if (!err) {
        for (let key in values) {
          this.fieldsValidateStatus[key] = true
        }
      } else {
        for (let key in values) {
          this.fieldsValidateStatus[key] = false
        }
      }
      this.updateSubmitStatus(this.fieldsValidateStatus, 'canSubmit')
    })
  }

  updateSubmitStatus(fieldsValidateStatus, stateKey) {
    for (let key in fieldsValidateStatus) {
      if (!fieldsValidateStatus[key]) {
        this.setState({
          [stateKey]: false
        })
        return
      }
    }
    this.setState({
      [stateKey]: true
    })
  }

  validateFn = (rule, value, callback) => {
    const { getFieldValue } = this.props.form
    if (value && value !== getFieldValue('newPassword')) {
      this.setState({
        canSubmit: false
      })
      callback('两次输入的密码不一致！')
    }
    this.setState({
      canSubmit: true
    })
    callback()
  }


  render() {
    const { getFieldDecorator } = this.props.form
    return (<Form>
      <FormItem label='原密码' {...labelProps} colon={false}>
        {getFieldDecorator('oldPassword', {
          rules: [{ required: true, message: '请输入原密码' }, { min: 6, max: 20, message: '6到15个字符之间，包括字母和数字' }],
        })(
          <Input placeholder='请输入原密码'
            onChange={this.valueChangeHandler.bind(this, 'oldPassword')}
          />
        )}
      </FormItem>
      <FormItem label='新密码' {...labelProps} colon={false}>
        {getFieldDecorator('newPassword', {
          rules: [{ required: true, message: '请输入新密码' }, { min: 6, max: 20, message: '6到15个字符之间，包括字母和数字' }],
        })(
          <Input placeholder='6到15个字符之间，包括字母和数字'
            onChange={this.valueChangeHandler.bind(this, 'newPassword')}
          />
        )}
      </FormItem>
      <FormItem label='新密码' {...labelProps} colon={false}>
        {getFieldDecorator('reNewPassword', {
          rules: [{ required: true, message: '请输入新密码' }, { validator: this.validateFn }],
        })(
          <Input placeholder='再次输入您设置的新密码'
            onChange={this.valueChangeHandler.bind(this, 'reNewPassword')}
          />
        )}
      </FormItem>
      <Button className='confirm' type="primary" onClick={() => {
        this.props.submitHandler(this.state.resetPassword)
      }} disabled={!this.state.canSubmit}>确定</Button>
    </Form>)
  }
}

const FormItem = Form.Item
const labelProps = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}

class PersonalInfo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: 0,//0个人信息，1修改密码
      userInfo: {}
    }
  }

  navHandler = (index) => {
    this.setState({
      activeIndex: index
    })
  }

  submitHandler = (data) => {
    this.props.updatePassword(data)
  }

  componentDidMount() {
    try {
      let userInfo = JSON.parse(localStorage.getItem('currentUser'))
      let sexLabel = ['', '男', '女', '其他']
      userInfo.sexLabel = sexLabel[userInfo.sex]
      userInfo.roleLabel = ''
      userInfo.roles.forEach(item => {
        userInfo.roleLabel = userInfo.roleLabel + item.name + ','
      })
      this.setState({
        userInfo: userInfo
      })
    } catch (e) {
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const ResetPasswordForm = Form.create()(resetPassword)
    return (
      <div className='personalInfo'>
        <div className='content'>
          <div className='left'>
            <div className={this.state.activeIndex === 0 ? 'nav-item active' : 'nav-item'} onClick={() => {
              this.navHandler(0)
            }}>
              <span className='flag'></span>
              <p>个人信息</p>
            </div>
            <div className={this.state.activeIndex === 1 ? 'nav-item active' : 'nav-item'} onClick={() => {
              this.navHandler(1)
            }}>
              <span className='flag'></span>
              <p>修改密码</p>
            </div>
          </div>
          <div className='right'>
            <div className='info' style={{ display: this.state.activeIndex === 0 ? 'block' : 'none' }}>
              <div className='title'>基本信息</div>
              <div className='form'>
                <Form>
                  <FormItem label='姓名' {...labelProps} colon={false}>
                    {getFieldDecorator('name', { initialValue: this.state.userInfo.name })(
                      <Input
                        disabled
                      />
                    )}
                  </FormItem>
                  <FormItem label='性别' {...labelProps} colon={false}>
                    {getFieldDecorator('sexLabel', { initialValue: this.state.userInfo.sexLabel })(
                      <Input
                        disabled
                      />
                    )}
                  </FormItem>
                  <FormItem label='工号' {...labelProps} colon={false}>
                    {getFieldDecorator('userNo ', { initialValue: this.state.userInfo.userNo })(
                      <Input
                        disabled
                      />
                    )}
                  </FormItem>
                  <FormItem label='岗位' {...labelProps} colon={false}>
                    {getFieldDecorator('emplyPost ', { initialValue: this.state.userInfo.emplyPost })(
                      <Input
                        disabled
                      />
                    )}
                  </FormItem>
                  <FormItem label='角色' {...labelProps} colon={false}>
                    {getFieldDecorator('roleLabel', { initialValue: this.state.userInfo.roleLabel })(
                      <Input
                        disabled
                      />
                    )}
                  </FormItem>
                  <FormItem label='机构名称' {...labelProps} colon={false}>
                    {getFieldDecorator('institutionName', { initialValue: this.state.userInfo.institutionName })(
                      <Input
                        disabled
                      />
                    )}
                  </FormItem>
                  <FormItem label='机构编号' {...labelProps} colon={false}>
                    {getFieldDecorator('institutionCode', { initialValue: this.state.userInfo.institutionCode })(
                      <Input
                        disabled
                      />
                    )}
                  </FormItem>
                  <FormItem label='邮箱' {...labelProps} colon={false}>
                    {getFieldDecorator('email', { initialValue: this.state.userInfo.email })(
                      <Input
                        disabled
                      />
                    )}
                  </FormItem>
                  <FormItem label='手机' {...labelProps} colon={false}>
                    {getFieldDecorator('phone', { initialValue: this.state.userInfo.phone })(
                      <Input disabled
                      />
                    )}
                  </FormItem>
                </Form>
              </div>
            </div>
            <div className='reset-password' style={{ display: this.state.activeIndex === 0 ? 'none' : 'block' }}>
              <div className='title'>修改密码</div>
              <div className='form'>
                <ResetPasswordForm submitHandler={this.submitHandler} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(PersonalInfo)
