import { connect } from 'react-redux'
import Component from './component'
import { getRecentBrowse, } from 'store/modules/home/index'

const mapStateToProps = (state) => ({
  recentBrowseRecords: state.home.recentBrowseRecords,
})

const mapDispatchToProps = {
  getRecentBrowse,
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
