import React from 'react'

import NavTab from './navTab'
import ClusterList from './clusterList'
import './clusterNav.scss'

class ClusterNav extends React.Component {
  render () {
    return (
      <div className='cluster-home-container'>
        <section className='home-section nav-container'>
          <NavTab activeTab={this.props.location.query.type} />
        </section>
        <section className='home-section cluster-list-container'>
          <ClusterList
            getClusterList={this.props.getClusterList}
            clusterList={this.props.clusterList}
            searchClusterListLoding={this.props.searchClusterListLoding}
            location={this.props.location}
          />
        </section>
      </div>
    )
  }
}

export default ClusterNav
