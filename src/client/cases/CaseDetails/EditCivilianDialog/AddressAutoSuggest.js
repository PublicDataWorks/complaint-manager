import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {MenuItem, Paper, TextField} from 'material-ui';
import {change} from "redux-form";
import {connect} from "react-redux";
import {withStyles} from "material-ui/styles/index";

const styles = theme => ({
    container: {
        flexGrow: 1,
        position: 'relative',
        height: 200,
        width: '100%',
    },
    suggestionsContainerOpen: {
        position: 'relative',
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 3,
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
});


class AddressAutoSuggest extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: '',
            suggestions: []
        }
    }

    renderInput = (inputProps) => {
        const {label, classes, ref, ...other} = inputProps;

        return (
            <TextField
                label={label}
                fullWidth
                inputRef={ref}
                data-test={inputProps["data-test"]}
                InputProps={{
                    classes: {
                        input: classes.input,
                    },
                    ...other,
                }}
            />
        );
    }

    renderSuggestionsContainer = (options) => {
        const {containerProps, children} = options;

        return (
            <Paper {...containerProps} data-test='suggestion-container' square>
                {children}
            </Paper>
        );
    }

    renderSuggestion = (suggestion, {query, isHighlighted}) => {
        const suggestionValue = this.props.suggestionEngine.getSuggestionValue(suggestion)
        const matches = match(suggestionValue, query);
        const parts = parse(suggestionValue, matches);

        return (
            <MenuItem selected={isHighlighted} component="div">
                <div>
                    {parts.map((part, index) => {
                        return part.highlight
                            ? (
                                <span key={String(index)} style={{fontWeight: 300}}>
                                {part.text}
                            </span>
                            )
                            : (
                                <strong key={String(index)} style={{fontWeight: 500}}>
                                    {part.text}
                                </strong>
                            );
                    })}
                </div>
            </MenuItem>
        );
    }

    getSuggestionValue = (suggestion) => {
        return this.props.suggestionEngine.getSuggestionValue(suggestion)
    }

    onSuggestionSelected = (event, {suggestion}) => {
        this.props.suggestionEngine.onSuggestionSelected(suggestion, (address)=>{
            console.log('on suggestion selected', address)
            // TODO change('EditCivilian', 'streetNumber', selectionDetail.streetNumber)

        })

    }


    handleSuggestionsFetchRequested = ({value, reason}) => {
        if (value && reason === 'input-changed') {
            this.props.suggestionEngine.onFetchSuggestions(value, (values)=>{
                this.setState({
                    suggestions: values || []
                })
            })
        }
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        })
    };

    handleChange = (event, {newValue}) => {
        this.setState({
            value: newValue,
        })
    };

    render() {
        const {label, classes = {}, inputProps} = this.props;

        const theme =
            {
                container: classes.container,
                suggestionsContainerOpen: classes.suggestionsContainerOpen,
                suggestionsList: classes.suggestionsList,
                suggestion: classes.suggestion,
            }

        return (
            <Autosuggest
                theme={theme}
                renderInputComponent={this.renderInput}
                suggestions={this.state.suggestions}
                onSuggestionSelected={this.onSuggestionSelected}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                renderSuggestionsContainer={this.renderSuggestionsContainer}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                data-test={'base-auto-suggest'}
                inputProps={{
                    label,
                    ...inputProps,
                    classes,
                    value: this.state.value,
                    onChange: this.handleChange,
                }}
            />
        );
    }
}

const mapDispatchToProps = {
    change
}

const ConnectedComponent = connect(undefined, mapDispatchToProps)(AddressAutoSuggest)
export default withStyles(styles)(ConnectedComponent);




