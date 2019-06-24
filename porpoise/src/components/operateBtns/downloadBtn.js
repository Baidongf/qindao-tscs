/**
 * @desc: { 下载按钮 }
 * @author: zhengyiqiu
 * @Create Date: 2018-12-18 17:34:46
 * @Last Modified by: zhengyiqiu
 * @Last Modified time: 2019-02-26 10:43:40
 */

import React from 'react'
import Btn from './btn'
import { connect } from 'react-redux'

import DownloadImg from './assets/download.svg'
import DownloadImgDeep from './assets/download_deep.svg'
import DownloadImgHighlight from './assets/download_highlight.svg'
import DownloadImgHighlightDeep from './assets/download_highlight_deep.svg'
import { toggleDownloadModal } from 'routes/cluster/routes/clusterGraph/modules/downloadModal'

class DownloadBtn extends React.Component {
  constructor (props){
    super(props)

    this.click = this.click.bind(this)
  }

  click () {
    this.props.toggleDownloadModal(true)
  }

  render () {
    return (
      <div className='operate-btn-box' onClick={this.click}>
        <Btn img={this.props.theme === 'light' ? DownloadImg : DownloadImgDeep} imgHighlight={this.props.theme === 'light' ? DownloadImgHighlight : DownloadImgHighlightDeep} />
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  theme: state.setTheme
})

const mapDispatchToProps = (dispatch) => ({
  toggleDownloadModal: (visible) => dispatch(toggleDownloadModal(visible))
})

export default connect(mapStateToProps, mapDispatchToProps)(DownloadBtn)
