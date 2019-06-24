import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './store/createStore'
import AppContainer from './containers/AppContainer'

import 'styles/main.scss'

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.__INITIAL_STATE__
const store = createStore(initialState)

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

// 设置 cookie
let token = store.getState().location.query.token || localStorage.getItem('token')
token='eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2NnBoOW56ZUNkdCIsImV4cCI6MTU1Nzc3NjQ3NywidWlkIjoyNDh9.ATK0qq4hi2rsgnpD3vTQeQnPPumqagKjnArb8y9D5-w'
if (token) {
  localStorage.setItem('token', token)
  document.cookie = 'access_token=' + token + ';path=/'
}


let render = () => {
  const routes = require('./routes/index').default(store)

  ReactDOM.render(
    <AppContainer store={store} routes={routes} />,
    MOUNT_NODE
  )
}

// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        console.error(error)
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// ========================================================
// Go!
// ========================================================
render()
