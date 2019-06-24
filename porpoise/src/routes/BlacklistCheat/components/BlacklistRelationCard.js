import React from 'react'
import { connect } from 'react-redux'
import Layout from 'components/Card/Layout'
import CardInput from 'components/Card/CardInput'
import Triangle from 'components/partials/Triangle'
import { findRelation } from '../modules/blacklistCheat'
import PropTypes from 'prop-types'

import './BlacklistRelationCard.scss'

/**
 * 黑名单找关系
 */
class BlacklistRelationCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      companyName: '',
      isSearchValid: false,
      configStatus: {
        blacklist: true,
        rule: true
      }
    }
    this.shouldClearOption = false

    this.search = this.search.bind(this)
    this.clearOptions = this.clearOptions.bind(this)
    this.inputHandler = this.inputHandler.bind(this)
    this.toggleConfigStatus = this.toggleConfigStatus.bind(this)
  }

  search () {
    this.props.findRelation(this.state.companyName)
  }

  clearOptions () {
    this.setState({
      companyName: '',
      isSearchValid: false
    })
    this.shouldClearOption = true
  }

  /**
   * 路径输入框处理函数
   * param {string} val: 输入的值
   * param {string} key: 输入框 index, 起点: srx 终点: dst 途经点: pass-0,1,2...
   */
  inputHandler (val, key) {
    this.setState({
      companyName: val,
      isSearchValid: val.length > 0
    })
  }

  toggleConfigStatus (key) {
    const configStatus = this.state.configStatus
    configStatus[key] = !configStatus[key]
    this.setState({ configStatus })
  }

  render () {
    const { companyName, isSearchValid } = this.state
    const clearOption = this.shouldClearOption
    this.shouldClearOption = false
    let CardBody = (
      <div className='clearfix'>
        <div className='card-input-container'>
          <CardInput isSrc='true'
            value={companyName}
            inputHandler={this.inputHandler}
            inputKey='src'
            clearOption={clearOption}
            hideSuggestedList
            placeholder='起 请输入公司名称' />
          {this.state.passByInput}
          <CardInput isDst='true'
            operationBtnHandler={this.addPassByHandler}
            inputHandler={this.inputHandler}
            inputKey='dst'
            clearOption={clearOption}
            disableInput
            placeholder='广东农信黑名单库' />
        </div>
        <div className='config' onClick={() => this.toggleConfigStatus('rule')}>
          <p className='config-title'>规则库配置</p>
          <span className='triangle-wrapper'>
            <Triangle isOpen={this.state.configStatus['rule']} />
          </span>
        </div>
        <div className='config' onClick={() => this.toggleConfigStatus('blacklist')}>
          <p className='config-title'>黑名单库配置</p>
          <span className='triangle-wrapper'>
            <Triangle isOpen={this.state.configStatus['blacklist']} />
          </span>
        </div>
        <div className='btn-wrapper clearfix'>
          <a className={isSearchValid ? 'search-btn' : 'search-btn invalid-btn'}
            onClick={this.search}>查询
          </a>
          <a className='clear-btn' onClick={this.clearOptions}>清空内容</a>
        </div>
      </div>
    )

    return (
      <Layout
        cardBody={CardBody}
        name={'定向分析'}
        customClass='blacklist-relation-card' />
    )
  }
}

BlacklistRelationCard.propTypes = {
  findRelation: PropTypes.func
}

const mapDispatchToProps = (dispatch) => {
  return {
    findRelation: (companyName) => dispatch(findRelation(companyName))
  }
}

export default connect(null, mapDispatchToProps)(BlacklistRelationCard)
