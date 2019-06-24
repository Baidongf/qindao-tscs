import React from 'react'
import { connect } from 'react-redux'
import Triangle from 'components/partials/Triangle'
import Layout from 'components/Card/Layout'
import { showPathChart, showAll } from '../modules/blacklistCheat'
import PropTypes from 'prop-types'

import './BlacklistRelationPath.scss'

/**
 * 黑名单关系风险路径
 */
class BlacklistRelationPath extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pathPanelStatus: true,
      selectedPathIdx: ''
    }

    this.togglePathPanel = this.togglePathPanel.bind(this)
    this.showAll = this.showAll.bind(this)
    this.selectPath = this.selectPath.bind(this)
  }

  togglePathPanel () {
    this.setState({ pathPanelStatus: !this.state.pathPanelStatus })
  }

  selectPath (e, idx) {
    this.props.showPathChart(idx)
    this.setState({
      selectedPathIdx: idx
    })
  }

  generatePathList (pathList) {
    let PathList = []
    const { startName, startId, endId } = this.props.startEndId
    const reasonMap = {
      invest: {
        name: '投资: ',
        valueKey: 'invest_amount'
      },
      officer: {
        name: '高管: ',
        valueKey: 'position'
      },
      linked: {
        name: '地址和电话相同'
      }
    }
    pathList.forEach((v, pathListIdx) => {
      const Path = {}
      const paths = v.risk_path
      Path.label = (
        <p className={this.state.selectedPathIdx === pathListIdx ? 'selected-path path-title' : 'path-title'}
          onClick={(e) => this.selectPath(e, pathListIdx)}>
          {`${startName} - ${v.black_member_name}`}
        </p>
      )
      Path.routes = (
        <ol className='path-list-item'>
          {
            paths.map((path) => {
              return (
                <li key={path._id}>
                  <p>
                    {`${path.src_name} -> ${path.dst_name}`}
                  </p>
                  <p className='reason'>{reasonMap[path.attr].name}{path[reasonMap[path.attr].valueKey]}</p>
                </li>
              )
            })
          }
        </ol>
      )
      PathList.push(<li className='path-list' key={pathListIdx}>
        {Path.label}
        {Path.routes}
      </li>)
    })
    return PathList
  }

  showAll () {
    this.props.showAll()
    this.setState({
      selectedPathIdx: ''
    })
  }

  /**
   * @return {Object} jsx
   */
  render () {
    const CardHeader = (
      <div className='card-header' onClick={this.togglePathPanel}>
        <h2 className='name'>路径解读</h2>
        <span className='triangle-wrapper'>
          <Triangle isOpen={this.state.pathPanelStatus} />
        </span>
      </div>
    )

    const CardBody = (
      <div>
        <div>
          <p className='path-title'>
            识别以下
            <span className='red-text'>{this.props.relationPathList.length}条</span>
            黑名单风险关系：
          </p>
          <a className='show-all-btn' onClick={this.showAll}>显示全部</a>
          <ul className='paths scroll-style'>
            { this.generatePathList(this.props.relationPathList) }
          </ul>
        </div>
      </div>
    )

    return (
      <Layout
        cardHeader={CardHeader}
        foldCardHeader={CardHeader}
        cardBody={CardBody}
        isCardUnfold={this.state.pathPanelStatus}
        name='路径解读'
        customClass='blacklist-relation-path' />
    )
  }
}

BlacklistRelationPath.propTypes = {
  blacklistPath: PropTypes.object,
  relationPathList: PropTypes.array,
  showPathChart: PropTypes.func,
  showAll: PropTypes.func,
  startEndId: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    relationPathList: state.relationPathList,
    startEndId: state.startEndId
  }
}

const mapDispatchToProp = (dispatch) => {
  return {
    showPathChart: (idx) => dispatch(showPathChart(idx)),
    showAll: () => dispatch(showAll())
  }
}

export default connect(mapStateToProps, mapDispatchToProp)(BlacklistRelationPath)
