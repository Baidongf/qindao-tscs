import React from 'react'
import './SnapshotButton.scss'
import { connect } from 'react-redux';
import { togglePhotoType } from '../../actions/Chart';

class SnapshotButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPhoto: this.props.isPhoto || false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ isPhoto: nextProps.isPhoto });
    }

    toggleGraphType(status) {
        this.setState({
            isPhoto: status
        });
        this.props.togglePhotoType(status)
    }
    
    render() {
        const classnamePhonto = 'square-button transform-to-photo' + (!this.state.isPhoto ? ' active' : '')
        return (
            <div></div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isPhoto: state.isPhoto
    }
}

const mapDispatchToProps = dispatch => {
    return {
        togglePhotoType: (isPhoto) => dispatch(togglePhotoType(isPhoto))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SnapshotButton)
