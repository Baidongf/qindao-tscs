import React from 'react'
import './component.scss'
import { Button } from 'antd'
import { withRouter } from 'react-router-dom'

class DetailHeader extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}

    this.followOpportunity = this.followOpportunity.bind(this)
  }

  followOpportunity() {
    const userId = parseInt(localStorage.getItem('USER_ID'))
    const opportunityId = parseInt(this.props.id)

    this.props.followOpportunity(
      opportunityId, () => {
      const url = `/root/main/opportunityMgt/home/createOrEdit?operation=follow&id=${opportunityId}`
      this.props.history.push(url)
    })
  }

  render() {
    const {
      name,
      updateTime
    } = this.props

    return (
      <div className='common-opportunity-detail-header-component'>

        <div className='detail-title'>{name || '-'}</div>

        <div className='tags-container'>
          <div className='tag '>最近维护日期：{updateTime || '-'}</div>
        </div>

        <Button
          className='follow-btn'
          type='primary'
          onClick={this.followOpportunity}
        >跟进</Button>

      </div>
    )
  }
}


export default withRouter(DetailHeader)
