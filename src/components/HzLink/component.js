import React from 'react'
import {withRouter, Link, HashRouter} from 'react-router-dom'
// import {BANK_URL} from 'utils/config.js'


import PropTypes from "prop-types"
import './component.scss'

const BANK_URL = ''

class HzLink extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  linkTo(url) {
    window.location.href = BANK_URL + url

    // this.context.router.push(url)
    // this.props.history.replace(url)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.location !== this.props.location) {
      return true
    }
    if (nextProps.children !== this.props.children) {
      return true
    }
    return false
  }

  render() {
    const {to, children, className} = this.props
    return (
      // <div className='hz-link'>
      //   <a className='btn-item' onClick={this.linkTo.bind(this, to)}>
      //    { children }
      //   </a>
      // </div>
      <Link to={to} className={className}>
        {children}
      </Link>
    )
  }
}

export default withRouter(HzLink)
