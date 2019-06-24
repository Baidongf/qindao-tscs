import { connect } from 'react-redux'

import ClusterNav from '../components/clusterNav'
import { getClusterList } from '../modules/clusterNav'

const mapDispatchToProps = {
  getClusterList
}
const mapStateToProps = (state) => {
  return {
    location: state.location,
    clusterList: state.clusterList,
    searchClusterListLoding: state.searchClusterListLoding
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClusterNav)
