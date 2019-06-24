import React from 'react';
import SearchSuggested from '../SearchSuggested';

class CardInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: this.props.value || ''
        }

        this.emptyInput = this.emptyInput.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
    }

    inputHandler(name) {
        this.props.inputHandler(name, this.props.inputKey);
    }

    emptyInput() {
        this.setState({ inputValue: '' });
        this.props.inputHandler('', this.props.inputKey);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ inputValue: nextProps.value || '' });
    }

    render() {
        let operationBtn;
        const { isDst, isSrc, inputKey, placeholder } = this.props;
        if (isDst == 'true') {
            operationBtn = <i className="add-icon" onClick={this.props.operationBtnHandler}></i>;
        } else if (isSrc == 'true') {
            operationBtn = null;
        } else {
            operationBtn = <i className="del-icon" 
                onClick={() => this.props.operationBtnHandler(inputKey)}></i>;
        }

        return (
            <div className="card-input clearfix">
                <i className={inputKey.indexOf('pass-') == -1 ? "flag-icon" : 'circle-icon'}></i>
                <SearchSuggested selectSuggest={this.inputHandler}
                    handleChange={this.inputHandler}
                    value={this.props.value}
                    clearInput={this.props.clearOption}
                    placeholder={this.props.placeholder}
                    hideSuggestedList={this.props.hideSuggestedList}
                    disableInput={this.props.disableInput}
                />
                {/*暂时只支持一层，所以不需要添加／删除路径按钮*/}
                {/*{ operationBtn }*/}
            </div>
        )
    }
}

export default CardInput;