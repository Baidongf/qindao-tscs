import React from 'react'
// import DuckImage from '../assets/Duck.jpg'
import { Form, Icon, Input, Button } from 'antd'
import 'whatwg-fetch'
// import { Link } from 'react-router'
import './component.scss'
import md5 from 'js-md5'
import {Link} from "react-router-dom"
const FormItem = Form.Item
// import { injectReducer } from 'store/reducers'

class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formDatas: {
        name: '',
        password: ''
      },

      // 表示浏览器正在自动填充表单（从页面加载完成时开始算起），为false表示自动填充完成
      isAutoFilling: true,

      // 用于记录输入域是否处于focus状态，值不为空，且focus，则会在输入域出现clear按钮
      focusState: {
        name: false,
        passwod: false
      },
      canSubmit: false
    }

    this.enterHandler = this.enterHandler.bind(this)
  }

  fieldsValidateStatus = {
    name: false,
    password: false
  }

  componentWillMount() {
    // import('./module.js').then(({ loginAsync } = module) => {
    //   injectReducer(store, { key: 'login',  loginAsync})
    // })
    // document.querySelector('.root-layout').style.background = 'red';

    // 清空登录前的角色
    localStorage.removeItem('CURRENT_ROLE')
    localStorage.removeItem('IS_CUSTOMER_MANAGER')
    this.props.setRole({})
  }
  componentDidMount() {
    let _this = this

    document.addEventListener('keyup', this.enterHandler)

    setTimeout(() => {
      let vals = _this.props.form.getFieldsValue()

      /**
       * chrome 的特性是初次进入页面的时候无法获取自动加载的密码值，但是做完其他操作之后可以（如点击）。
       * 所以虽然无法通过 js 获取密码，但直接点登录是可以的。
       * 这里只判断 name 是否有值，有值则认为密码也被自动加载了。
       */
      if (vals.name) {
        this.setState({
          canSubmit: true
        })
      }

      // 组件初始化800ms后，可认为表单已经自动填充完毕
      this.setState({
        isAutoFilling: false
      })
    }, 800)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.enterHandler)
    this.setState = (state) => {
      return;
    }
  }

  enterHandler(e) {
    if (e.keyCode === 13 && this.state.canSubmit) {
      this.submitHandler()
    }
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

  validate(fieldName) {
    this.props.form.validateFields([fieldName], { first: true }, (err, values) => {
      if (!err) {
        const { formDatas } = this.state
        Object.assign(formDatas, values)

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

  submitHandler = (e) => {

    // 浏览器一开始填充完密码时，用户没有执行任何操作，此时js代码是无法获取type为password的input的值
    if (!this.state.formDatas.password) {

      // 用户点击了提交按钮，此时可以用js代码获取到type为password的input的值，补记用户密码
      let value = document.querySelector('input[type="password"]').value
      this.setState({
        formDatas: {
          password: value
        }
      })
    }
    let newformDatas = Object.assign({}, this.state.formDatas)
    //newformDatas.password = md5(newformDatas.password)
    this.props.login(newformDatas)
  }

  handleFocusAndChange(key, event) {

    // react input的值变化完成需要一定时间，等完成之后再验证
    setTimeout(() => {
      this.validate(key)

      // 对于chrome，autofill会触发focus事件但鼠标实际是没有focus到输入域，所以不能够将input的状态记录为focus:true
      if (!this.state.isAutoFilling) {

        // 特别地，valueChange发生时，也可以认为仍处于focus状态
        this.setState({
          focusState: {
            [key]: true
          }
        })
      }
    })
  }

  handleBlur(key) {
    this.setState({
      focusState: {
        [key]: false
      }
    })
  }

  emitEmpty = (key, cb) => {
    cb({
      [key]: ''
    })
    setTimeout(() => {
      this[key].focus()
    })
  }

  render() {
    const { getFieldDecorator, getFieldsValue, setFieldsValue } = this.props.form
    const isShowTips = this.props.login === 'error' ? 'show' : 'hide'
    const values = getFieldsValue()
    const nameSuffix = values.name && this.state.focusState.name ? <Icon type="close-circle" onMouseDown={this.emitEmpty.bind(this, 'name', setFieldsValue)} /> : null
    const passwordSuffix = values.password && this.state.focusState.password ? <Icon type="close-circle" onMouseDown={this.emitEmpty.bind(this, 'password', setFieldsValue)} /> : null
    // const suffix = this.props.name ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    return (
      <div className="login-container">
        <div className='login-component'>
          <div className="form-left">
          <div className="logo"></div>
          <p className="title">青岛银行交易安全防控系统</p>
          </div>
          <div className='form-right'>
            <div className="logo-title">
                <p className="logoti">用户登录 / USER LOGIN</p>
                <Link className="reg" to=''>新用户注册</Link>
            </div>
            <Form>
              <FormItem className='input-item account-item'>
                {getFieldDecorator('name', {
                  rules: [
                    { required: true, message: '请输入用户名!' },
                    { whitespace: true, message: '工号不能为空' },
                  ],
                })(
                  <Input prefix={<Icon type='user' style={{ fontSize: 13 }} />} placeholder='请输入用户名称'
                    ref={node => this.name = node} suffix={nameSuffix}
                    onFocus={this.handleFocusAndChange.bind(this, 'name')}
                    onChange={this.handleFocusAndChange.bind(this, 'name')}
                    onBlur={this.handleBlur.bind(this, 'name')}
                    name='name'
                    autoComplete='off'
                  />
                )}
              </FormItem>
              <FormItem className='input-item password-item'>
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: '请输入密码!' },
                    { min: 6, max: 20, message: '请检查密码长度:6-20位' },
                    { whitespace: true, message: '密码不能为空' },
                  ],
                })(
                  <Input prefix={<Icon type='lock' style={{ fontSize: 13 }} />} placeholder='请输入登录密码' type='password'
                    ref={node => this.password = node} suffix={passwordSuffix}
                    onFocus={this.handleFocusAndChange.bind(this, 'password')}
                    onChange={this.handleFocusAndChange.bind(this, 'password')}
                    onBlur={this.handleBlur.bind(this, 'password')}
                    name='password'
                    autoComplete='off'
                  />
                )}
              </FormItem>
              <span className={isShowTips}>错误提示!</span>
              <FormItem>
                <Button disabled={!this.state.canSubmit} type='primary' onClick={this.submitHandler} className='login-form-button'>登录</Button>
                {/* Or <a href="">注册</a> */}
                {/* {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>记住登录</Checkbox>
                )} */}
                {/* <a className='login-form-forgot' href=''>忘记密码</a> */}
              </FormItem>
            </Form>
          </div>
          <p className="copyright">Copyright © 青岛银行, All Rights Reserved.</p>
        </div>
      </div>
    )
  }
}

const Login = Form.create()(LoginForm)

export default Login
