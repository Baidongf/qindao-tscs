import 'core-js'
import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './store/createStore'
import App from './routes/App/index'
// require('core-js');

// Store Initialization
// ------------------------------------
const store = createStore(window.__INITIAL_STATE__)

// Render Setup
// ------------------------------------
const MOUNT_NODE = document.querySelector('#root')

let render = () => {
  ReactDOM.render(
    <App store={store}  />,
    MOUNT_NODE
  )
}
render()
