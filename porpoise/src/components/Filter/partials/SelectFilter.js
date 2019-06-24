import React from 'react';
import Select from '../../partials/Select';

import './SelectFilter.scss';

class SelectFilter extends React.Component {
    constructor(props) {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(idx) {
        this.props.handleSelect(this.props.name, idx);
    }

    render() {
        return (
            <div className="select-filter">
                <p className="filter-detail-sub-title">{this.props.filterTitle}</p>
                <Select 
                    disabled={this.props.disabled}
                    liRange={this.props.liRange} 
                    selectHandler={this.handleSelect}
                    initSelect={this.props.initSelect} />
            </div>
        )
    }
}

export default SelectFilter;