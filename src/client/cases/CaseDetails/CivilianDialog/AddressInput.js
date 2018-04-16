import React, {Component} from 'react'
import {TextField} from "redux-form-material-ui";
import AddressAutoSuggest from "./AddressAutoSuggest";
import {Field} from "redux-form";
import AddressSuggestionEngine from "./SuggestionEngines/addressSuggestionEngine";

class AddressInput extends Component {

    //TODO  IS there a good way to do dependency injection in react/redux?
    // It's generally poor form to have a default service instance.
    // Would it be a bad idea to have a set of services defined in some corner of Redux
    // that would be set differently based on the environment?
    constructor(props){
        super(props)
        this.suggestionEngine = props.suggestionEngine || new AddressSuggestionEngine()
    }

    render() {
        return (
            <div>
                <Field
                    name='autoSuggestValue'
                    component={AddressAutoSuggest}
                    props={{
                        label: 'Address',
                        suggestionEngine: this.suggestionEngine,
                        defaultText: this.props.formattedAddress,
                        'data-test': 'addressSuggestionField',
                        fieldName: this.props.fieldName,
                        formName: this.props.formName,
                        onInputChanged: this.props.onInputChanged
                    }}
                />
                <Field
                    label={'Additional Address Information'}
                    name={`${this.props.fieldName}.streetAddress2`}
                    component={TextField}
                    style={{
                        marginRight: '5%',
                        marginBottom: '24px',
                        width: '50%'
                    }}
                    inputProps={{
                        'data-test': 'streetAddress2Input',
                        maxLength: 25
                    }}
                />
                <Field
                    type={'hidden'}
                    name={`${this.props.fieldName}.streetAddress`}
                    component={TextField}
                    inputProps={{
                        'data-test': 'streetAddressInput'
                    }}
                />
                <Field
                    type={'hidden'}
                    name={`${this.props.fieldName}.city`}
                    component={TextField}
                    inputProps={{
                        'data-test': 'cityInput'
                    }}
                />
                <Field
                    type={'hidden'}
                    name={`${this.props.fieldName}.state`}
                    component={TextField}
                    inputProps={{
                        'data-test': 'stateInput'
                    }}
                />
                <Field
                    type={'hidden'}
                    name={`${this.props.fieldName}.zipCode`}
                    component={TextField}
                    inputProps={{
                        'data-test': 'zipCodeInput'
                    }}
                />
                <Field
                    type={'hidden'}
                    name={`${this.props.fieldName}.country`}
                    component={TextField}
                    inputProps={{
                        'data-test': 'countryInput'
                    }}
                />
            </div>
        )
    }
}

export default AddressInput