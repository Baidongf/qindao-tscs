import React from 'react'
import { connect } from 'react-redux'
import Layout from 'components/Card/Layout'
import Triangle from 'components/partials/Triangle'
import { selectLinksToHighlight } from '../modules/guaranteeRisk'
import PropTypes from 'prop-types'

import './GuaranteePathCard.scss'

/**
 * 担保风险分析卡片
 */
class GuaranteePathCard extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor (props) {
    super(props)
    this.state = {
      isPathTypeOpen: {},
      selectedPath: {}
    }

    this.pathTypeMap = this.props.pathTypeMap

    this.selectPath = this.selectPath.bind(this)
    this.togglePathType = this.togglePathType.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.paths !== nextProps.paths) {
      this.setState({
        isPathTypeOpen: {},
        selectedPath: {}
      })
    }
  }

  selectPath (e, record, idx, pathType) {
    const edges = record.path.map((pathItem) => 'guarantee_risk/' + pathItem.id)
    this.props.selectLinksToHighlight(edges)
    this.setState({
      selectedPath: {
        type: pathType,
        idx: idx
      }
    })
  }

  togglePathType (e, pathType) {
    const isPathTypeOpen = this.state.isPathTypeOpen
    isPathTypeOpen[pathType] = !isPathTypeOpen[pathType]
    this.setState({ isPathTypeOpen })
  }

  generateGuaList (paths) {
    const selectedPath = this.state.selectedPath
    return Object.keys(this.pathTypeMap).map((pathType) => {
      const records = paths.filter((path) => path && path.type === pathType)
      let RecordsList = null
      if (this.state.isPathTypeOpen[pathType]) {
        RecordsList = (
          <ul className='scroll-style guarantee-list'>
            {
              records.map((record, idx) => (
                <li key={idx} onClick={(e) => this.selectPath(e, record, idx, pathType)}
                  className={selectedPath.type === pathType && selectedPath.idx === idx ? 'highlight-text' : ''}>
                  {
                    record.path.map((pathItem, itemIdx) => (
                      <span key={pathItem.id}>
                        {itemIdx < record.path.length - 1 ? `${pathItem._from} -> ` : `${pathItem._from} -> ${pathItem._to} ;`}
                      </span>
                    ))
                  }
                </li>
              ))
            }
          </ul>
        )
      }

      return (
        <section key={pathType}>
          <p className='path-type-title' onClick={(e) => this.togglePathType(e, pathType)}>
            {this.pathTypeMap[pathType]} ({records.length})个
            <span className='triangle-wrapper'>
              <Triangle isOpen={this.state.isPathTypeOpen[pathType]} />
            </span>
          </p>
          { RecordsList }
        </section>
      )
    })
  }

  /**
   * @return {Object} jsx
   */
  render () {
    const { paths } = this.props

    const GuaranteeList = this.generateGuaList(paths)
    const CardBody = (
      <div>
        {GuaranteeList}
      </div>
    )
    return (
      <Layout
        cardBody={CardBody}
        name='担保路径'
        customClass='guarantee-path' />
    )
  }
}

GuaranteePathCard.propTypes = {
  paths: PropTypes.array,
  selectLinksToHighlight: PropTypes.func,
  pathTypeMap: PropTypes.object
}

/**
 * react-redux state
 * @param {Object} state state
 * @return {Object} state
 */
const mapStateToProps = function (state) {
  return {
    paths: state.guaranteePaths,
    pathTypeMap: state.pathTypeMap
  }
}

/**
 * react-redux dispatch
 * @param {Object} dispatch diapatch
 * @return {Object} dispatch
 */
const mapDispatchToProps = (dispatch) => {
  return {
    selectLinksToHighlight: (edges) => dispatch(selectLinksToHighlight(edges))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GuaranteePathCard)
