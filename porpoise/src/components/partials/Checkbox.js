import React from 'react'
import './Checkbox.scss'
import { PropTypes } from 'prop-types'

/** checkbox 自定义组件 */
class Checkbox extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor (props) {
    super(props)
    this.state = {
      isChecked: this.props.isChecked || false
    }
    this.handleClick = this.handleClick.bind(this)
  }

  /**
   * check状态受控
   * @param {Object} nextProps next props
   */
  componentWillReceiveProps (nextProps) {
    if (nextProps.isChecked !== undefined && nextProps.isChecked !== this.state.isChecked) {
      this.setState({ isChecked: nextProps.isChecked })
    }
  }

  /**
   * 点击事件
   */
  handleClick () {
    let isChecked = !this.state.isChecked
    this.setState({ isChecked: isChecked })
    this.props.handleChecked && this.props.handleChecked(this.props.name, isChecked, this.props.edge)
  }

  /**
   * render
   * @return {element} checkbox
   */
  render () {
    let { label } = this.props
    return (
      <span className={this.state.isChecked ? 'checked custom-checkbox' : 'custom-checkbox'}
        onClick={this.handleClick}>{label}</span>
    )
  }
}

Checkbox.propTypes = {
  isChecked: PropTypes.bool,
  handleChecked: PropTypes.func,
  name: PropTypes.string.isRequired,
  edge: PropTypes.object,
  label: PropTypes.string.isRequired
}

export default Checkbox
