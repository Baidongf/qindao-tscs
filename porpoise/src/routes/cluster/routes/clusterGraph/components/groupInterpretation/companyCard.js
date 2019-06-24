import React from 'react'

class CompanyCard extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showCompanyIndex: false,
      showIcon: false
    }

    this.selectCenterClusterNode = this.selectCenterClusterNode.bind(this)
  }

  selectCenterClusterNode (id) {
    if (!this.props.singleCompany) {
      this.props.selectCenterClusterNode(id)
    }
  }

  componentDidMount() {
    let ref = 'company_detail_content'
    if (this.refs[ref] && this.refs[ref].offsetHeight > 72) {
      this.setState({
        showIcon: true
      })
      // return (
      //   <i
      //     className={`arrow-icon  ${this.state.showCompanyIndex ? 'arrow-up-icon' : 'arrow-down-icon'}`}
      //     onClick={(ele) => this.showMoreCompanyDetail(ref, ele)} >
      //     <div className='arrow-icon-tip'>查看更多</div>
      //   </i>
      // )
    } else {
      return ''
    }
  }
  // getRenderMoreIcon (ref) {
  //   console.log(ref)
  //   console.log(this.refs[ref])
  //   if (this.refs[ref] && this.refs[ref].offsetHeight > 72) {
  //     console.log(this.refs[ref].offsetHeight)
  //     return (
  //       <i
  //         className={`arrow-icon  ${this.state.showCompanyIndex ? 'arrow-up-icon' : 'arrow-down-icon'}`}
  //         onClick={(ele) => this.showMoreCompanyDetail(ref, ele)} >
  //         <div className='arrow-icon-tip'>查看更多</div>
  //       </i>
  //     )
  //   } else {
  //     return ''
  //   }
  // }

  showMoreCompanyDetail (e) {
    e.stopPropagation()
    this.setState({
      showCompanyIndex: !this.state.showCompanyIndex
    })
  }

  render () {
    const vertex = this.props.vertex

    return (
      <div className='relation-card company-card'
        onClick={() => this.selectCenterClusterNode(vertex._id)}>
        <div className='relation-name company-name clearfix'>
          <div className='full'>
            <span className={`name ${(vertex.company && vertex.company.length > 28) || (vertex.name && vertex.name.length > 14) ? 'eclipse-name' : ''}`}>{vertex.company || vertex.name}</span>
            <br />
            {this.props.companyType}
          </div>
        </div>
        <div className='relation-info company-info'>
          <p className='position'>
            <i />
            地区：{vertex.province || '--'}
          </p>
          <p className='belong'>
            <i />
            行业：<a title={vertex.industry}>{vertex.industry || '--'}</a>
          </p>
          <p className='boss'>
            <i />
            法定代表人：{vertex.legal_man || '--'}
          </p>
        </div>
        <div className={`company-detail ${this.state.showCompanyIndex ? 'more-detail' : ''}`}>
          <i className='company-detail-icon' />
          <div className={'company-detail-content'} ref={`company_detail_content`}>
            经营范围：{vertex.business_scope}
          </div>
        </div>
        <i
          className={`arrow-icon ${this.state.showCompanyIndex ? 'arrow-up-icon' : 'arrow-down-icon'}`}
          style={{
            'display' : this.state.showIcon ? 'block' : 'none'
          }}
          onClick={(ele) => this.showMoreCompanyDetail(ele)} >
          <div className='arrow-icon-tip'>查看更多</div>
        </i>
      </div>
    )
  }
}

export default CompanyCard
