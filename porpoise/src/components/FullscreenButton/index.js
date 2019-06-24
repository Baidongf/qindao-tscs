import React from 'react'
import { connect } from 'react-redux'
import './FullScreenButton.scss'
class FullScreenButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFullsreen: false
        };
    }

    toggleScreen(status) {
        this.setState({
            isFullsreen: !status
        });
    }
    
    render() {
        const classname = 'fullscreen' + (this.state.isFullsreen ? ' full' : '')
        return (
            <div className="fullscreen-wrap">
                <span className="fullscreen-text-tips clearfix">
                    <span className='fullscreen-text'>全屏</span>
                    <span className='fullscreen-arrow'></span>
                </span>
                <span className={classname} onClick={() => this.toggleScreen(this.state.isFullsreen)}></span>
            </div>
        )
    }
}

export default connect(null, null)(FullScreenButton)