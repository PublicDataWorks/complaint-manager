import React from "react";
import { Field } from "redux-form";
import { TextField } from "redux-form-material-ui";
import { isPhoneNumber } from "../../formFieldLevelValidations";
import MaskedInput from 'react-text-mask';

function strip_nondigits(value) {
  return value.replace(/[^\d]/g, "");
}

const TextMaskCustom = (props) => {
    const { inputRef, ...other } = props;
    return (
        <MaskedInput
            {...other}
            ref={inputRef}
            mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
};

const PhoneNumberField = (props) => {
    return (
        <Field
            name={props.name}
            InputProps={{inputComponent: TextMaskCustom}}
            component={TextField}
            label="Phone Number"
            inputProps={{
                "data-test": "phoneNumberInput"
            }}
            data-test="phoneNumberField"
            validate={[isPhoneNumber]}
            normalize={strip_nondigits}
            style={{ width: "35%", marginRight: "0%", marginBottom: "3%" }}
            InputLabelProps={{
            shrink: true
            }}
            placeholder="Ex. 1231231234"
        />
    )
};

export default PhoneNumberField;