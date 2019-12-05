import React from "react";
import { Field } from "redux-form";
import {
  isPIBControlNumber,
  pibControlNumberNotBlank,
  pibControlNumberRequired
} from "../../formFieldLevelValidations";
import MaskedInput from "react-text-mask";
import { renderField } from "../../complaintManager/cases/sharedFormComponents/renderFunctions";

const TextMaskCustom = props => {
  const passedProps = (({ inputRef, ...passedProps }) => ({
    ...passedProps
  }))(props);

  return (
    <MaskedInput
      {...passedProps}
      mask={[
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        "-",
        /[A-Za-z]/
      ]}
      placeholderChar={"_"}
      style={{ textTransform: "uppercase" }}
    />
  );
};

const PIBControlField = () => {
  return (
    <Field
      name="pibControlNumber"
      InputProps={{ inputComponent: TextMaskCustom }}
      component={renderField}
      label="PIB Control #"
      inputProps={{
        "data-test": "pib-control-input",
        autoComplete: "disabled"
      }}
      data-test="pib-control-field"
      validate={[
        isPIBControlNumber,
        pibControlNumberRequired,
        pibControlNumberNotBlank
      ]}
      style={{ width: "50%", marginRight: "0%", marginBottom: "3%" }}
      InputLabelProps={{
        shrink: true
      }}
      required
      placeholder="Ex. 2019-0021-R"
    />
  );
};

export default PIBControlField;
