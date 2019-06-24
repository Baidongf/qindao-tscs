import React from 'react'
import {connect} from 'react-redux'
import logoImg from './assets/home_logo.svg'
import logoImgDeep from './assets/home_logo_deep.svg'
import fd_logo from './assets/fd_logo3x.png'
import SearchSuggested from '../SearchSuggested'
import './Header.scss'
import {BIG_DATA_ADDRESS} from '../../config'

class Header extends React.Component {
  render() {
    const Search = (
      <div className='header-right'>
        <SearchSuggested goToNewPage/>
      </div>
    )
    return (
      <div className='header clearfix'>
        <h1 className='h1'>企业知识图谱</h1>
        <div className='header-left'>
          <a href={BIG_DATA_ADDRESS}>
            <img
              alt='海致星图-企业知识图谱'
              className='logo'
              height='31'
              src={fd_logo}/>
          </a>
        </div>
        {Search}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    reduxLocation: state.location,
    theme: state.setTheme
  }
}

export default connect(mapStateToProps, null)(Header)
