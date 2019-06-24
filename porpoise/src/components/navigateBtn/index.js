import React from 'react'
import { connect } from 'react-redux'
import { showHistory } from 'actions/Chart'
import './navigateBtn.scss'

function HoverTips (props) {
  return (
    <div className={'hover-tips ' + props.className}>
      { props.msg }
    </div>
  )
}

class NavigateBtn extends React.Component {
  state = {}

  goBack = (step) => {
    if (!this.props.canGoBack) {
      return
    }
    this.props.showHistory(step)
  }

  reset = () => {
    this.goBack(-this.props.steps + 1)
    const options = graphPostBody.options
    this.props.dispatch({
      type: 'CHANGE_FILTER_OPTIONS',
      options
    })
  }

  toggleTips = (type) => {
    const visible = !this.state[`show_${type}`]
    this.setState({
      [`show_${type}`]: visible
    })
  }

  render () {
    return (
      <div className='navigate-container'>
        <ul>
          <li className={this.props.canGoBack ? 'back-btn-item' : 'back-btn-item disabled'}
            onClick={() => this.goBack(-1)}
            onMouseOver={() => this.toggleTips('back')}
            onMouseLeave={() => this.toggleTips('back')}
          >
            <i className='back-btn' />
          </li>
          {/* 新需求不要重置按钮 */}
          {/* <li className='reset-btn-item'
            onClick={this.reset}
            onMouseOver={() => this.toggleTips('reset')}
            onMouseLeave={() => this.toggleTips('reset')}
          >
            <i className='reset-btn' />
          </li> */}
        </ul>
        {
          this.state.show_back ? <HoverTips msg='回退' className='tip-back' /> : null
        }
        {/* {
          this.state.show_reset ? <HoverTips msg='重置' className='tip-reset' /> : null
        } */}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  canGoBack: state.undoableOriginChartData.past.length > 1,
  steps: state.undoableOriginChartData.past.length
})

const mapDispatchToProps = {
  showHistory
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigateBtn)
