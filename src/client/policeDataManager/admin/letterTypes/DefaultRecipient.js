import React from "react";
import { FormControlLabel, Typography, Radio } from "@material-ui/core";
import { Field, formValueSelector } from "redux-form";
import {
  renderRadioGroup,
  renderTextField
} from "../../cases/sharedFormComponents/renderFunctions";
import { connect } from "react-redux";

const DefaultRecipient = props => {
  return (
    <section
      style={{
        width: "100%",
        margin: "20px, 0px"
        // display: "flex"
      }}
    >
      <Typography style={{ marginTop: "15px" }} variant="subtitle2">
        Default Recipient
      </Typography>

      <div style={{ display: "flex" }}>
        <Field
          name="defaultRecipient"
          component={renderRadioGroup}
          data-testid="default-recipient-radio-group"
          style={{ paddingRight: "20px" }}
        >
          <FormControlLabel
            style={{ marginRight: "48px", whiteSpace: "nowrap" }}
            value={"{primaryComplainant}"}
            control={<Radio color="primary" />}
            label={"Primary Complainant"}
          />
          <FormControlLabel
            style={{ marginRight: "48px", whiteSpace: "nowrap" }}
            value={"{eachComplainant}"}
            control={<Radio color="primary" />}
            label={"Each Complainant"}
          />
          <FormControlLabel
            style={{ marginRight: "48px" }}
            value={"Other"}
            control={<Radio color="primary" />}
            label={"Other"}
          />
        </Field>
        {props.defaultRecipient !== "{primaryComplainant}" &&
        props.defaultRecipient !== "{eachComplainant}" &&
        props.defaultRecipient ? (
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginLeft: "-125px",
              marginBottom: "5px"
            }}
          >
            <FormControlLabel
              label="Recipient Name"
              labelPlacement="start"
              className={props.classes.labelStart}
              style={{ alignItems: "flex-end" }}
              control={
                <Field
                  multiline
                  maxRows={2}
                  component={renderTextField}
                  inputProps={{
                    "data-testid": "recipient-name-input"
                  }}
                  name="recipientNameInput"
                  placeholder="Recipient Name"
                  style={{
                    marginLeft: "10px",
                    marginRight: "4px",
                    width: "10rem"
                  }}
                />
              }
            />
            <FormControlLabel
              label="Recipient Address"
              labelPlacement="start"
              className={props.classes.labelStart}
              style={{ paddingLeft: "14px", alignItems: "flex-end" }}
              control={
                <Field
                  multiline
                  maxRows={5}
                  component={renderTextField}
                  inputProps={{
                    "data-testid": "recipient-address-input"
                  }}
                  name="recipientAddressInput"
                  placeholder="Recipient Address"
                  style={{ marginLeft: "10px", width: "23rem" }}
                />
              }
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};
const mapStateToProps = state => {
  const selector = formValueSelector("letterTypeForm");
  const recipientRadio = selector(state, "defaultRecipient");
  return {
    defaultRecipient: recipientRadio
  };
};
export default connect(mapStateToProps)(DefaultRecipient);
