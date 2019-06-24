/**
 * 三角形符号, 选中时三角形向上, 关闭时三角形向下
 */
import React from 'react';

import './Triangle.scss';

class Triangle extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <i className={this.props.isOpen ? 'triangle triangle-up' : 'triangle'}></i>
        )
    }
}

export default Triangle;