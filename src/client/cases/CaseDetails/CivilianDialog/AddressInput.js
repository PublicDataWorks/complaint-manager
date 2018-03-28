import React from 'react'
import {TextField} from "redux-form-material-ui";
import AddressAutoSuggest from "./AddressAutoSuggest";
import {Field} from "redux-form";

const AddressInput = (props) => (
    <div>
        <AddressAutoSuggest
            label='Address'
            suggestionEngine={props.suggestionEngine}
            defaultText={props.formattedAddress}
            data-test='addressSuggestionField'
        />
        <Field
            label={'Additional Address Information'}
            name={'address.streetAddress2'}
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
            name={'address.streetAddress'}
            component={TextField}
            inputProps={{
                'data-test': 'streetAddressInput'
            }}
        />
        <Field
            type={'hidden'}
            name={'address.city'}
            component={TextField}
            inputProps={{
                'data-test': 'cityInput'
            }}
        />
        <Field
            type={'hidden'}
            name={'address.state'}
            component={TextField}
            inputProps={{
                'data-test': 'stateInput'
            }}
        />
        <Field
            type={'hidden'}
            name={'address.zipCode'}
            component={TextField}
            inputProps={{
                'data-test': 'zipCodeInput'
            }}
        />
        <Field
            type={'hidden'}
            name={'address.country'}
            component={TextField}
            inputProps={{
                'data-test': 'countryInput'
            }}
        />
    </div>
)

export default AddressInput