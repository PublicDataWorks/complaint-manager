import React from "react";
import { TextField } from "redux-form-material-ui";
import Select from 'react-select';

class AutoCompleteFormSelect extends React.Component {

    state = {
        selected: ''
    };

    constructor(props) {
        super(props);
    }

    onChange(event) {
        if (this.props.input.onChange && event != null) {
            this.props.input.onChange(event.value);
            this.setState({
                selected: this.props.input.value
            });
        } else {
            this.props.input.onChange(null);
        }
    }

    createOptions(children) {
        let options = [];
        for(let child of children) {
            options.push({
                label: child.props.children,
                value: child.props.children
            });
        }
        console.log(options);
        return options;
    };

    render() {
        const { input, children, ...custom} = this.props;
        console.log(input);
        return(
            <Select
                {...input}
                {...custom}
                options={this.createOptions(children)}
                value={input.value}
                onChange={this.onChange()}
                onBlur={() => input.onBlur(input.value)}
                onBlurResetsInput={false}
                onCloseResetsInput={false}
            />
        );
    }
}

export default AutoCompleteFormSelect;