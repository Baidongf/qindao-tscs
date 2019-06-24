import React, { Component } from 'react'
import { Router, Route, Switch, withRouter, HashRouter } from 'react-router-dom'
import history from '../../history'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'

import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import AuthRouter from 'components/AuthRouter/index.js'

import 'styles/less/main.less'
import 'styles/sass/main.scss'
import './component.scss'
import Root from './children/Root/index'

class App extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  }
  static childContextTypes = {
    reduxStore: PropTypes.object
  }

  // 返回Context对象，方法名是约定好的
  getChildContext() {
    return {
      reduxStore: this.props.store
    }
  }

  requireAuth() {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/#/login'
      window.location.reload()
    }
  }

  componentWillMount() {

    this.props.setReduxStore(this.props.store)
  }
  componentDidMount() {
    // if (window.location.hash !== '#/login') {
    //   this.requireAuth()
    // }
    // history.listen (location => {
    //   if(location.hash !== '#/login') {
    //     this.requireAuth()
    //   }
    // })
  }

  render() {
    return (
      <LocaleProvider locale={zh_CN}>
        <Provider store={this.props.store}>
          <HashRouter history={history}>
            <Switch>
              <Route path="/root" component={withRouter(Root)}></Route>
              <Route path="/" component={withRouter(Root)}></Route>
            </Switch>
          </HashRouter>
        </Provider>
      </LocaleProvider>
    )
  }
}

export default App
