/**
 * 下拉框 select 组件
 *
 * 使用方式:
 * <Select
 *   liRange={TRACE_DEPTH_RANGE}
 *   selectHandler={this.selectHandler}
 *   initSelect={TRACE_DEPTH_RANGE.indexOf(this.state.traceDepth)}
 *   clearOption={clearOption}
 *   disabled={this.state.disabled}
 * />
 */

import React from 'react';

import './Select.scss';

class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectIdx: this.props.initSelect !== undefined ? this.props.initSelect : this.props.liRange.length - 1,
            disabled: this.props.disabled
        }

        this.clickLiHandler = this.clickLiHandler.bind(this);
        this.bodyClickHandler = this.bodyClickHandler.bind(this);
        this.toggleSelectOpenStatus = this.toggleSelectOpenStatus.bind(this);
    }

    clickLiHandler(idx, e) {
        this.setState({ 
            selectIdx: idx,
            selectIsActive: false
        })
        this.props.selectHandler(this.props.liRange[idx]);
        e.stopPropagation();
    }

    bodyClickHandler(e) {
        if (this.refs['select-span'] === e.target) return;  // 点击 span 区域特殊处理，实现 toggle 效果
        this.setState({ selectIsActive: false });
    }

    componentDidMount() {
        document.body.addEventListener('click', this.bodyClickHandler);
    }

    componentWillUnmount() {
        document.body.removeEventListener('click', this.bodyClickHandler);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.clearOption) this.setState({ selectIdx: this.props.liRange.length - 1 });
    }

    toggleSelectOpenStatus() {
        this.setState({
            selectIsActive: !this.state.selectIsActive
        })
    }

    render() {
        const { liRange } = this.props;
        let li = liRange.map((liItem, idx) => {
            return <li key={idx} onClick={(e) => this.clickLiHandler(idx, e)}
                className={idx == this.state.selectIdx ? 'active' : null}>{liItem}</li>
        });

        return (
            <div className="select-custom">
                <span className={this.state.selectIsActive ? 'active' : null}
                    ref = 'select-span'
                    onClick={this.toggleSelectOpenStatus}>
                    {liRange[this.state.selectIdx]}
                </span>
                <ul style={{display: (!this.state.disabled && this.state.selectIsActive) ? 'block' : 'none'}}>
                    {li}
                </ul>
            </div>
        )
    }
}

export default Select;