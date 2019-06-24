import React from 'react'
import Triangle from 'components/partials/Triangle'
import Checkbox from 'components/partials/Checkbox'
import PropTypes from 'prop-types'

import './GuaranteeList.scss'

/**
 * 担保风险 list (可展开、收起)
 */
class GuaranteeList extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor (props) {
    super(props)

    this.state = {
      circleToggleStatus: {},
      selectedEntity: ''
    }

    this.toggleList = this.toggleList.bind(this)
    this.handleChecked = this.handleChecked.bind(this)
  }

  /**
   * 展开、收起 list
   */
  toggleList () {
    this.setState({
      openList: !this.state.openList
    })
  }

  /**
   * 展开，收起担保图
   * @param {String} id 担保id
   * @param {Boolean} isChecked 展开，收起标记位
   */
  handleChecked (id, isChecked) {
    let selectedPath = this.props.paths.find((path) => path.type + '/' + path.id === id)
    selectedPath = JSON.parse(selectedPath.paths)
    const pathIds = selectedPath.map((path) => path._id.includes('guarantee/') ? path._id : 'guarantee/' + path._id)
    this.props.handleChecked(id, isChecked, pathIds)
  }

  /**
   * 选中展开的担保实体
   * @param {String} id vertex id
   * @param {String} centerId id of center company of the company
   * @return {void} return nothing
   */
  selectEntity (id, centerId) {
    if (this.state.selectedId !== centerId) return
    this.props.selectEntity(id)
    this.setState({
      selectedEntity: id
    })
  }

  /**
   * render
   * @return {Object} jsx
   */
  render () {
    const paths = this.props.paths || []
    const data = paths.map((path) => {
     let name= (path.type=='circle'?'担保类型':path.type)+path.id
      return {
        name,
        id: path.type + '/' + path.id
      }
    })
    // 担保中心企业名称
    let clusterNames = data

    // 担保列表
    let ClusterList = null
    if (this.props.noSpecifiedCluster && this.props.showSpecifiedCluster) {
      ClusterList = (
        <div>不存在该企业,
          <a href={`/?company=${this.state.searchName}&type=Graph`} target='_blank'> 跳转至企业详情</a>
        </div>
      )
    } else {
      ClusterList = clusterNames.map((v) => {
        return (
          <li key={v.id}
            className={this.props.selectedPathId === v.id ? 'checked-cluster-item cluster-item' : 'cluster-item'}>
            <Checkbox
              isChecked={this.props.selectedPathId === v.id || false}
              label={v.name}
              name={v.id} // 这里需要知道 id
              handleChecked={this.handleChecked} />
          </li>
        )
      })
    }

    return (
      <section className='guarantee-list'>
        <ul className='description-list scroll-style cluster-list'>
          {ClusterList}
        </ul>
      </section>
    )
  }
}

GuaranteeList.propTypes = {
  paths: PropTypes.array,
  getCluster: PropTypes.func,
  handleChecked: PropTypes.func,
  clusterItems: PropTypes.object,
  noSpecifiedCluster: PropTypes.bool,
  showSpecifiedCluster: PropTypes.bool,
  selectEntity: PropTypes.func,
  clusterNameRes: PropTypes.array,
  selectedPathId: PropTypes.string,
}

export default GuaranteeList
