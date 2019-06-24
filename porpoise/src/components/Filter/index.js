import React from 'react';
import FilterNav from './FilterNav';
import FilterPanel from './FilterPanel';

class Filter extends React.Component {
    render() {
        return (
            <div className="filter-wrap">
                <FilterNav />
                <FilterPanel />
            </div>
        )
    }
}

export default Filter;