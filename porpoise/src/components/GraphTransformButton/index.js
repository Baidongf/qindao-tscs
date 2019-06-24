import React from 'react'
import './GraphTransformButton.scss'
import { connect } from 'react-redux';
import { toggleGraphType } from '../../actions/Chart';

class GraphTransformButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTree: this.props.isTree || false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ isTree: nextProps.isTree });
    }

    toggleGraphType(status) {
        this.setState({
            isTree: status
        });
        this.props.toggleGraphType(status);
    }
    
    render() {
        const classnameGraph = 'square-button transform-to-graph' + (!this.state.isTree ? ' active' : '')
        const classnameTree = 'square-button transform-to-tree' + (this.state.isTree ? ' active' : '')
        return (
            <div className="graphtransform-wrap">
                <div className={classnameGraph}
                    onClick={() => this.toggleGraphType(false)}></div>
                <div className={classnameTree}
                    onClick={() => this.toggleGraphType(true)} ></div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isTree: state.isTreeGraph
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleGraphType: (isTree) => dispatch(toggleGraphType(isTree))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphTransformButton)