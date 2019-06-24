import React from 'react'
import PropTypes from 'prop-types'

/**
 * 错误提示类
 */
export default class Error extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor (props) {
    super(props)
    this.state = {
      showErrorMsg: this.props.show,
      msg: this.props.msg || '服务器异常'
    }
  }

  /**
   * 更新 ErrorMsg 状态
   * @param {Object} nextProps next props
   */
  componentWillReceiveProps (nextProps) {
    if (nextProps.show) {
      this.setState({
        showErrorMsg: nextProps.show,
        msg: nextProps.msg || '服务器异常'
      })
      setTimeout(() => {
        this.setState({
          showErrorMsg: false,
          msg: ''
        })
      }, 5000)
    }
  }

  /**
   * render
   * @return {Object} jsx
   */
  render () {
    let ErrorMsg = this.state.showErrorMsg ? (
      <div className='error-msg'>
        <p className='error-detail'><i className='error-icon' />{this.state.msg}</p>
      </div>
    ) : null

    return (
      <div>
        {ErrorMsg}
      </div>
    )
  }
}

Error.propTypes = {
  show: PropTypes.bool,
  msg: PropTypes.string
}
