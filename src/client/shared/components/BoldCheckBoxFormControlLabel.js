import { withStyles } from "@material-ui/core/styles";
import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import { Field } from "redux-form";
import PrimaryCheckBox from "./PrimaryCheckBox";
import { DECLINES_OPTION } from "../../../sharedUtilities/constants";

const styles = {
  label: { fontWeight: "bold" }
};

class BoldCheckBoxFormControlLabel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      classes,
      name,
      label,
      dataTest,
      key,
      disabled,
      onChange
    } = this.props;

    return (
      <FormControlLabel
        key={key}
        classes={classes}
        label={label}
        control={
          <Field
            name={name}
            component={PrimaryCheckBox}
            data-test={dataTest}
            disabled={disabled && label !== DECLINES_OPTION}
          />
        }
        onChange={event => onChange && onChange(event, label)}
      />
    );
  }
}

export default withStyles(styles)(BoldCheckBoxFormControlLabel);
