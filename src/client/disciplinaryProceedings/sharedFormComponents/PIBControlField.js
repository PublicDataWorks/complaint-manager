import React from "react";
import { Field } from "redux-form";
import { TextField } from "redux-form-material-ui";
import { isPIBCaseNumber } from "../../formFieldLevelValidations";
import MaskedInput from "react-text-mask";

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
        " ",
        "-",
        " ",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        " ",
        "-",
        " ",
        /[A-Za-z]/
      ]}
      placeholderChar={"_"}
    />
  );
};

const PIBControlField = () => {
  return (
    <Field
      name="pibControlNumber"
      InputProps={{ inputComponent: TextMaskCustom }}
      component={TextField}
      label="PIB Control #"
      inputProps={{
        "data-test": "pib-control-input",
        autoComplete: "disabled"
      }}
      data-test="pib-control-field"
      validate={[isPIBCaseNumber]}
      style={{ width: "50%", marginRight: "0%", marginBottom: "3%" }}
      InputLabelProps={{
        shrink: true
      }}
      required
      placeholder="Ex. 2019-2312-R"
    />
  );
};

export default PIBControlField;
