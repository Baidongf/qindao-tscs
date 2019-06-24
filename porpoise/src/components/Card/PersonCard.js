import React from 'react'
import { connect } from 'react-redux'
import { toggleCardType } from 'actions/Card'
import Layout from './Layout'
import PropTypes from 'prop-types'

class PersonCard extends React.Component {
  constructor (props) {
    super(props)

    this.getConnectReason = this.getConnectReason.bind(this)
  }

  getConnectReason (id, targetId, companyName) {
    if (!this.props.personBrief.relation.length) return
    sessionStorage.setItem('connectionParams', JSON.stringify({
      id: id,
      target: targetId
    }))
    window.open(`http://${location.host}${location.pathname}#/graph/?company=${companyName || ''}&type=Connection`, '_blank')
  }

  generateBackBtn () {
    let BackBtn = null
    const getBackBtnDiv = getBackBtn.bind(this)
    if (this.props.curNode._id && this.props.curNode._id.includes('mergeNode')) {
      BackBtn = getBackBtnDiv('merge_relation', '群体详情')
    } else if (this.props.reduxLocation.query.lp_type === 'Company_cluster') {
      BackBtn = getBackBtnDiv('Company_cluster', '返回')
    } else if (['/graph/guarantee_risk'].includes(this.props.reduxLocation.pathname)) {
      BackBtn = getBackBtnDiv('guarantee_path', '担保路径')
    }

    function getBackBtn (cardType, text) {
      return (
        BackBtn = (
          <div className='card-back-wrapper clearfix' onClick={() => this.props.toggleCardType(cardType)}>
            <i className='back' />
            <span className='back-text'>{text}</span>
          </div>
        )
      )
    }
    return BackBtn
  }

  render () {
    const { personBrief } = this.props
    const relation = personBrief.relation || []
    const self = personBrief.self || {}
    const Back = this.generateBackBtn()

    const CardHeader = (
      <div>
        {Back}
        <div>
          <h2 className='name'>{this.props.curNode.name}</h2>
        </div>
      </div>
    )

    const CardBody = (
      <div>
        <h2 className='relation-title'>关联的人</h2>
        <table className='table person-detail'>
          <thead>
            <tr>
              <td><div className='name'>姓名</div></td>
              <td><div className='connect-company'>关联企业</div></td>
              <td><div className='connect-reason'>关联原因</div></td>
            </tr>
          </thead>
          <tbody className='scroll-style'>
            {relation.map(v => {
              return (
                <tr key={v.person._id}>
                  <td><div className='name'>{v.person.name}</div></td>
                  <td><div className='connect-company'>{v.company.name}</div></td>
                  <td>
                    <div className='connect-reason'>
                      <a onClick={() => this.getConnectReason(self._id, v.person._id, v.company.name)}>查看</a>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <a className={relation.length ? 'search-btn btn' : 'search-btn btn invalid'}
          onClick={() => this.getConnectReason(self._id)}>
          查询全部关系
        </a>
      </div>
    )

    return (
      <Layout
        cardHeader={CardHeader}
        cardBody={CardBody}
        name={this.props.curNode.name}
        customClass='person-card' />
    )
  }
}

PersonCard.propTypes = {
  personBrief: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  curNode: PropTypes.object,
  reduxLocation: PropTypes.object,
  toggleCardType: PropTypes.func,
}

const mapStateToProps = (state) => {
  return {
    personBrief: state.briefData,
    curNode: state.curNode,
    reduxLocation: state.location
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleCardType: (type) => dispatch(toggleCardType(type))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonCard)
