/**
 * @desc: {按钮-纯组件}
 * @author: xieyuzhong
 * @Date: 2018-12-06 17:09:46
 * @Last Modified by: zhengyiqiu
 * @Last Modified time: 2018-12-19 14:39:29
 */
import React from 'react'

class Btn extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      img: this.props.isShowPopover ? this.props.imgHighLight : this.props.img
    }

    this.over = this.over.bind(this)
    this.out = this.out.bind(this)
  }

  /**
   * img 受控
   * @param {Object} nextProps next props
   */
  componentWillReceiveProps (nextProps) {
    this.setState({ img: nextProps.isShowPopover ? nextProps.imgHighlight : nextProps.img })
  }

  over () {
    if (this.props.disabled || this.props.isShowPopover) {
      return
    }
    this.setState({
      img: this.props.imgHighlight
    })
  }

  out () {
    if (this.props.isShowPopover) {
      return
    }
    this.setState({
      img: this.props.img
    })
  }

  render () {
    return (
      <div className={'operate-btn ' + (this.props.disabled ? 'forbid' : '')}
        onMouseOver={this.over} onMouseOut={this.out} >
        <img src={this.state.img} />
      </div>
    )
  }
}

export default Btn
