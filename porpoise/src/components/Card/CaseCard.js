import React from 'react'
import { connect } from 'react-redux'
import { Hint } from '../Hint'
import Layout from './Layout'
import { toggleCardType } from '../../actions/Card'
import { caseMap, caseTypeMap } from '../../card.config'

class CaseCard extends React.Component {
  generateBackBtn () {
    let BackBtn = null
    const { reduxLocation } = this.props
    const getBackBtnDiv = getBackBtn.bind(this)

    if (reduxLocation.query.toggle === 'case_detail') {
      BackBtn = getBackBtnDiv(reduxLocation.query.toggle_src, '返回')
    }

    function getBackBtn (cardType, text) {
      return (
        BackBtn = (
          <div className='card-back-wrapper clearfix' onClick={() => {
            reduxLocation.query.toggle = null
            reduxLocation.query.toggle_src = null
            this.props.toggleCardType(cardType)
          }}>
            <i className='back' />
            <span className='back-text'>{text}</span>
          </div>
        )
      )
    }
    return BackBtn
  }

  render () {
    const { caseBrief, cardType } = this.props
    let tableMap = caseMap[caseTypeMap[cardType].map]
    let title = caseTypeMap[cardType].title

    const CardHeader = (
      <div>
        { this.generateBackBtn() }
        <div>
          <h2 className='name'>{title}</h2>
        </div>
      </div>
    )

    const CardBody = (
      <dl className='description-list scroll-style'>
        {
          Object.keys(tableMap).map((v) => {
            let content = ''
            if (tableMap[v] instanceof Array) {
              for (let i = 0; i < tableMap[v].length; i++) {
                let key = tableMap[v][i]
                if (caseBrief[key]) {
                  content = caseBrief[key]
                  break
                }
              }
            } else {
              content = caseBrief[tableMap[v]]
            }
            return (
              <div key={v}>
                <dt>{v}</dt>
                <dd>{content || '--'}</dd>
              </div>
            )
          })
        }
      </dl>
    )

    return (
      <Layout
        cardHeader={CardHeader}
        cardBody={CardBody}
        name={title} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    caseBrief: state.briefData,
    cardType: state.cardType,
    reduxLocation: state.location
  }
}

const mapDispatchToProps = {
  toggleCardType
}

export default connect(mapStateToProps, mapDispatchToProps)(CaseCard)
