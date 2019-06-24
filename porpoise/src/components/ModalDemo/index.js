/**
 * @file 弹窗demo
 * @author zhutianpeng@haizhi.com
 */
import React from 'react';
import {Rodal} from '../rodal';

class ModalDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: true };
    }

    show() {
        this.setState({ visible: true });
    }

    hide() {
        this.setState({ visible: false });
    }

    render() {
        return (
            <div>
                <button onClick={this.show.bind(this)}>show</button>

                <Rodal visible={this.state.visible} onClose={this.hide.bind(this)}>
                    <div>Content</div>
                </Rodal>
            </div>
        )
    }
}

export default ModalDemo;
