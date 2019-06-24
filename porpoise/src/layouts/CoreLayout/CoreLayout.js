import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setTheme } from 'actions/InitOperateBtn'
import './CoreLayout.scss'
import Header from '../../components/Header'

class CoreLayout extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      theme: this.props.theme
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ theme: nextProps.theme })
  }

  componentDidMount () {
    // 深色主题以及其切换只在集团图谱页面生效，其他页面统一用浅色主题
    if (window.location.pathname !== '/graph/cluster/detail') {
      this.props.setTheme('light')
    }
  }

  render () {
    return (
      <div className={`container text-center clearfix ${this.props.theme}`}>
        <Header />

        { this.props.children }
      </div>
    )
  }
}

CoreLayout.propTypes = {
  children : PropTypes.element.isRequired
}

const mapState = (state) => ({
  theme: state.setTheme
})

const mapDispatch = (dispatch) => {
  return {
    setTheme: (v) => {
      dispatch(setTheme(v))
    }
  }
}

export default connect(mapState, mapDispatch)(CoreLayout)
