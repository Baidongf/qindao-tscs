import React from 'react';

class Tab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTabOpen: {}
        };

        this.handleTabChange = this.handleTabChange.bind(this);
    }

    componentWillMount() {
        let isTabOpen = {};
        isTabOpen[this.props.tabList[0]] = true;
        this.setState({ isTabOpen });
    }

    handleTabChange(e) {
        let isTabOpen = {};
        this.props.tabList.forEach(tab => {
            isTabOpen[tab] = false;
        });
        isTabOpen[e.target.innerHTML] = true;
        this.setState({ isTabOpen });
        this.props.handleTabChange(e.target.innerHTML);
    }

    render() {
        let tabList = this.props.tabList.map(tab => {
            return (
                <li 
                    key={tab} 
                    onClick={(e) => this.handleTabChange(e)}
                    className={this.state.isTabOpen[tab] ? 'active' : ''} >
                    {tab}
                </li>
            )
        });

        return (
            <div className="tab-list">
                {tabList}
            </div>
        )
    }
}

export default Tab;