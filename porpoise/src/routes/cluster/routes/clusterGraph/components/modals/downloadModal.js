/**
 * @desc: {族谱-下载企业列表·弹窗}
 * @author: xieyuzhong
 * @Date: 2019-01-15 15:12:42
 * @Last Modified by: xieyuzhong
 * @Last Modified time: 2019-01-21 11:22:14
 */

import React from 'react'
import { connect } from 'react-redux'
import { Rodal } from 'components/rodal'
import './downloadModal.scss'
import { toggleDownloadModal } from '../../modules/downloadModal'
import { downloadFile } from 'actions/Global'
import moment from 'moment'

class DownloadModal extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      checkStatus: {
        company: true,
        person: true
      }
    }
  }

  close = () => {
    this.props.toggleDownloadModal(false)
    setTimeout(() => {
      this.setState({ // 恢复选中状态
        checkStatus: {
          company: true,
          person: true
        }
      })
    }, 1000)
  }

  ensure = () => {
    const { checkStatus } = this.state

    if (checkStatus.company) {
      this.downloadCompany()
    }
    if (checkStatus.person) {
      this.downloadPerson()
    }
    this.close()
  }

  downloadCompany = () => {
    const { companyList, reduxLocation } = this.props
    const data = companyList.map((comp) => ([
      comp.name,
      comp.city,
      comp.industry,
      comp.legal_man,
      comp.business_scope
    ]))
    data.unshift(['企业名', '地域', '行业', '法定代表人', '经营范围'])
    const groupName = reduxLocation.query.group_name
    downloadFile({
      data: {
        filename: `${groupName}_企业列表_${moment().format('YYYY_MM_DD_HH_mm_SS')}`,
        data: data
      }
    })
  }

  downloadPerson = () => {
    const { clusterChartData, reduxLocation } = this.props
    const vertexes = []
    const edges = []
    for (let key in clusterChartData) {
      vertexes.push(...clusterChartData[key].vertexes)
      edges.push(...clusterChartData[key].edges)
    }
    const vertexMap = {}
    vertexes.forEach((v) => vertexMap[v._id] = v)
    const title = ['自然人名', '关联关系']
    const data = []
    edges.forEach((e) => {
      if (e._from.includes('Person')) { // 自然人只会在 _from 上
        if (vertexMap[e._from] && vertexMap[e._to]) {
          data.push([vertexMap[e._from].name, `${vertexMap[e._to].name}-${e.label}`])
        }
      }
    })
    data.sort((a, b) => a[0].localeCompare && a[0].localeCompare(b[0], 'zh-Hans-CN',
      { sensitivity: 'accent' }))
    const groupName = reduxLocation.query.group_name
    downloadFile({
      data: {
        filename: `${groupName}_自然人列表_${moment().format('YYYY_MM_DD_HH_mm_SS')}`,
        data: [title, ...data]
      }
    })
  }

  selectCheckbox = (type) => {
    const newStatus = Object.assign({}, this.state.checkStatus, {
      [type]: !this.state.checkStatus[type]
    })
    this.setState({
      checkStatus: newStatus
    })
  }

  render () {
    const { checkStatus } = this.state
    return (
      <Rodal visible={this.props.downloadModalStatus.visible}
        closeMaskOnClick
        showCloseButton
        width={300} height={150}
        onClose={this.close} >
        <h3 className='modal-header'>列表下载</h3>
        <div className='modal-body'>
          <p className='select-area'>
            <label htmlFor='companyCheckbox'>
              <input type='checkbox' id='companyCheckbox' checked={checkStatus.company}
                onChange={() => this.selectCheckbox('company')}
              />企业列表
            </label>
            <label htmlFor='personCheckbox'>
              <input type='checkbox' id='personCheckbox' checked={checkStatus.person}
                onChange={() => this.selectCheckbox('person')}
              />自然人列表
            </label>
          </p>
          <p className='operate-btns'>
            <button className='cancel-btn btn' onClick={this.close}>取消</button>
            <button className='ok-btn btn' onClick={this.ensure}>确定</button>
          </p>
        </div>
      </Rodal>
    )
  }
}

const mapStateToProps = (state) => ({
  downloadModalStatus: state.downloadModalStatus,
  companyList: state.companyListObj.companyList,
  clusterChartData: state.clusterChartData,
  reduxLocation: state.location
})

const mapDispatchToProps = {
  toggleDownloadModal
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadModal)
