import React from 'react'
import { connect } from 'react-redux'
import Triangle from '../partials/Triangle'
import { changeFilterTab } from '../../actions/Filter'

class FilterNav extends React.Component {
  constructor (props) {
    super(props)
    this.filterNames = Object.keys(this.props.FilterUIStatus)
    this.state = { FilterUIStatus: Object.assign({}, this.props.FilterUIStatus) }
    this.toggleFilterPanel = this.toggleFilterPanel.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.FilterUIStatus !== this.props.FilterUIStatus) {
      this.setState({ FilterUIStatus: nextProps.FilterUIStatus })
    }
  }

  /**
   * 切换二级筛选器展开状态
   */
  toggleFilterPanel (filter) {
    /* 这个处理可以移到reduce里做 */
    this.filterNames.forEach(f => {
      if (f != filter) {
        this.state['FilterUIStatus'][f]['show'] = false
      }
    })
    this.state['FilterUIStatus'][filter]['show'] = !this.state['FilterUIStatus'][filter]['show']
    this.setState({ FilterUIStatus: this.state['FilterUIStatus'] })

    /* 这个处理可以移到reduce里做 end */
    /* 移到reduce的话传的参数要改 */
    this.props.toggleFilterTab(Object.assign({}, this.state.FilterUIStatus))
  }

  render () {
    let filterItems = this.filterNames.map(filter => {
      return (
        <div
          key={filter}
          className={this.state['FilterUIStatus'][filter]['show'] ? 'filter-nav-item active clearfix' : 'filter-nav-item clearfix'}
          onClick={() => this.toggleFilterPanel(filter)}>
          <span>{filter}</span>
          <Triangle isOpen={this.state['FilterUIStatus'][filter]['show']}/>
        </div>
      )
    })

    return (
      <div className="filter-nav-wrap clearfix">
        {filterItems}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    FilterUIStatus: state.FilterUIStatus
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    toggleFilterTab: (filterUIStatus) => dispatch(changeFilterTab(filterUIStatus))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterNav)
