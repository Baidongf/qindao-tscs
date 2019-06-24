import React from 'react'
import { getMergeSuggestedList } from 'actions/Card'
import { connect } from 'react-redux'
import Layout from './Layout'
import PropTypes from 'prop-types'

/** 疑似可融合人卡片 */
class MergeSuggested extends React.Component {
  /**
   * constructor
   * @param {Object} props props
   */
  constructor (props) {
    super(props)

    this.getMergeReason = this.getMergeReason.bind(this)
  }

  /**
   * 获取疑似可融合关系
   * @param {Object} nextProps next props
   */
  componentWillReceiveProps (nextProps) {
    // 初次进入疑似可融合人详情页，主动获取疑似可融合人关系
    if (this.props.curNode._id !== nextProps.curNode._id) {
      if (!this.props.mergeSuggestedList.length) {
        this.props.getMergeSuggestedList(nextProps.curNode._id)
      }
    }
  }

  /**
   * 获取可融合图数据
   * @param {String} id person id
   * @param {String} targetId target person id
   */
  getMergeReason (id, targetId) {
    sessionStorage.setItem('mergeSuggestedParams', JSON.stringify({
      person1: id,
      person2: targetId
    }))
    window.open(`http://${location.host}${location.pathname}#/graph/?company=${this.props.reduxLocation.query.company || ''}&type=Merge_suggested`,
      '_blank')
  }

  /**
   * render
   * @return {Object} jsx
   */
  render () {
    let { mergeSuggestedList } = this.props
    mergeSuggestedList = mergeSuggestedList.length ? mergeSuggestedList : []
    const CardBody = (
      <div>
        <h2 className='relation-title'>疑似可融合</h2>
        <table className='table'>
          <thead>
            <tr>
              <td><div className='name'>姓名</div></td>
              <td><div className='person-merge'>疑似可融合人</div></td>
              <td><div className='merge-reason'>详情</div></td>
            </tr>
          </thead>
          <tbody className='scroll-style'>
            {mergeSuggestedList.map((v, i) => {
              return (
                <tr key={v._id}>
                  <td><div className='name'>{v.name}</div></td>
                  <td><div className='person-merge'>疑似{i + 1}</div></td>
                  <td>
                    <div className='merge-reason'>
                      <a onClick={() => this.getMergeReason(this.props.curNode._id, v._id)}>查看</a>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )

    return (
      <Layout
        cardBody={CardBody}
        name={this.props.curNode.name}
        customClass='person-card'
      />
    )
  }
}

MergeSuggested.propTypes = {
  mergeSuggestedList: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  curNode: PropTypes.object,
  reduxLocation: PropTypes.object,
  getMergeSuggestedList: PropTypes.func
}

/**
 * map state to props
 * @param {Object} state state
 * @return {Object} props
 */
const mapStateToProps = function (state) {
  return {
    mergeSuggestedList: state.briefData,
    curNode: state.curNode,
    reduxLocation: state.location
  }
}

/**
 * map dispatch to props
 * @param {Function} dispatch dispatch
 * @return {Object} props
 */
const mapDispatchToProps = (dispatch) => {
  return {
    getMergeSuggestedList: (vertex) => dispatch(getMergeSuggestedList(vertex))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MergeSuggested)
