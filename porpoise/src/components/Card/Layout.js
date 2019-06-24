import React from 'react'
import { connect } from 'react-redux'
import { toggleCardType } from '../../actions/Card'

class Layout extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isCardUnfold: true || this.props.isCardUnfold,
    }

    this.foldCard = this.foldCard.bind(this)
    this.unfoldCard = this.unfoldCard.bind(this)
    this.unfoldAndGorelation = this.unfoldAndGorelation.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isCardUnfold !== undefined && nextProps.isCardUnfold !== this.props.isCardUnfold) {
      this.setState({ isCardUnfold: nextProps.isCardUnfold })
    }
  }

  foldCard () {
    this.setState({ isCardUnfold: false })
  }

  unfoldCard () {
    if (this.state.isCardUnfold) return
    this.setState({ isCardUnfold: true })
  }
  unfoldAndGorelation () {
    if (this.state.isCardUnfold) return
    this.setState({ isCardUnfold: true })
    this.props.toggleCardType('Relation')
  }

  render () {
    const { isCardUnfold } = this.state
    let header = this.props.foldCardHeader || (
      <h2 className='name fold-name'>
        <span onClick={this.unfoldCard} className='fold-name-content'>
          {this.props.name}
        </span>
        {
          (this.props.type && this.props.type === 'Company')
            ? <span className='fold-name-icon'>
              <i className='fold-relation-btn' onClick={this.unfoldAndGorelation} />
            </span> : ''
        }
      </h2>
    )
    if (this.props.cardHeader && isCardUnfold) {
      header = this.props.cardHeader
    }

    return (
      <div className={`card ${this.props.customClass || ''}`}>
        <div className={isCardUnfold ? 'card-header clearfix' : 'card-header fold-card clearfix'}>
          {header}
          <i className='fold-card-icon' onClick={this.foldCard} />
        </div>
        <div className={isCardUnfold ? 'card-body clearfix scroll-style'
          : 'card-body clearfix scroll-style fold-card'}>
          {this.props.cardBody}
        </div>
      </div>
    )
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    toggleCardType: (cardType) => dispatch(toggleCardType(cardType))
  }
}
export default connect(null, mapDispatchToProps)(Layout)
