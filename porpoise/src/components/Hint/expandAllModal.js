/**
 * @file 展开全部叶子节点时，如果超出阈值，出现弹窗
 * @author xieyuzhong@haizhi.com
 */
import React from 'react'
import { Rodal } from '../rodal'
import { connect } from 'react-redux'

class ExpandAllModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = { visible: false }

    this.close = this.close.bind(this)
    this.continue = this.continue.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.expandAllModalStatus !== this.props.expandAllModalStatus) {
      const { expandAllModalStatus } = this.props
      if (expandAllModalStatus.show) {
        this.show()
      } else {
        this.hide()
      }
    }
  }

  show () {
    this.setState({ visible: true })
  }

  hide () {
    this.setState({ visible: false })
  }

  close () {
    this.hide()
    this.props.expandAllModalStatus.reject && this.props.expandAllModalStatus.reject()
  }

  continue () {
    this.hide()
    this.props.expandAllModalStatus.resolve && this.props.expandAllModalStatus.resolve()
  }

  render () {
    return (
      <div className='modal'>
        <Rodal visible={this.state.visible}
          closeMaskOnClick
          showCloseButton
          width={186} height={140}
          onClose={this.close} >
          <p className='modal-msg'>图谱已经很复杂，展开一层将需要很长的加载时间，并降低图谱可读性，是否继续？</p>
          <p className='modal-btns'>
            <button className='cancel-btn btn' onClick={this.close}>取消</button>
            <button className='ok-btn btn' onClick={this.continue}>确定</button>
          </p>
        </Rodal>
      </div>
    )
  }
}

const mapState2Prop = (state) => ({
  expandAllModalStatus: state.expandAllModalStatus
})

export default connect(mapState2Prop)(ExpandAllModal)
