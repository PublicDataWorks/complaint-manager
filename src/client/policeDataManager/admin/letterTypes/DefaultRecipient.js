import React, { useEffect, useState } from "react";
import { FormControlLabel, Typography, Radio } from "@material-ui/core";
import { Field } from "redux-form";
import {
  renderRadioGroup,
  renderTextField
} from "../../cases/sharedFormComponents/renderFunctions";

const DefaultRecipient = props => {
  const [selectedRecipientType, setSelectedRecipientType] = useState("");

  useEffect(() => {
    if (props.initialValues.defaultRecipient === "{primaryComplainant}") {
      setSelectedRecipientType("{primaryComplainant}");
    } else if (props.initialValues.defaultRecipient === "{eachComplainant}") {
      setSelectedRecipientType("{eachComplainant}");
    } else if (!props.initialValues.defaultRecipient) {
      return;
    } else {
      setSelectedRecipientType("Other");
    }
  }, []);

  return (
    <section
      style={{
        width: "100%",
        margin: "20px, 0px"
      }}
    >
      <Typography style={{ marginTop: "15px" }} variant="subtitle2">
        Default Recipient
      </Typography>

      <Field
        name="defaultRecipient"
        component={renderRadioGroup}
        style={{ flexDirection: "row" }}
        data-testid="default-recipient-radio-group"
      >
        <FormControlLabel
          style={{ marginRight: "48px" }}
          value={"{primaryComplainant}"}
          control={<Radio color="primary" />}
          label={"Primary Complainant"}
          onClick={() => {
            setSelectedRecipientType("{primaryComplainant}");
          }}
          checked={
            selectedRecipientType === "{primaryComplainant}" ? true : false
          }
        />
        <FormControlLabel
          style={{ marginRight: "48px" }}
          value={"{eachComplainant}"}
          control={<Radio color="primary" />}
          label={"Each Complainant"}
          onClick={() => {
            setSelectedRecipientType("{eachComplainant}");
          }}
          checked={selectedRecipientType === "{eachComplainant}" ? true : false}
        />
        <FormControlLabel
          style={{ marginRight: "48px" }}
          value={"Other"}
          control={<Radio color="primary" />}
          label={"Other"}
          onClick={() => {
            setSelectedRecipientType("Other");
          }}
          checked={selectedRecipientType === "Other" ? true : false}
        />
      </Field>
      {selectedRecipientType === "Other" ? (
        <div>
          <FormControlLabel
            label="Recipient Name"
            labelPlacement="start"
            className={props.classes.labelStart}
            control={
              <Field
                value={props.initialValues.recipientName}
                component={renderTextField}
                inputProps={{
                  "data-testid": "recipient-name-input"
                }}
                name="recipientNameInput"
                placeholder="Recipient Name"
                style={{ marginLeft: "10px" }}
              />
            }
          />
          <FormControlLabel
            label="Recipient Address"
            labelPlacement="start"
            control={
              <Field
                value={props.initialValues.recipientAddress}
                component={renderTextField}
                inputProps={{
                  "data-testid": "recipient-address-input"
                }}
                name="recipientAddressInput"
                placeholder="Recipient Address"
                style={{ marginLeft: "10px" }}
              />
            }
          />
        </div>
      ) : (
        ""
      )}
    </section>
  );
};

export default DefaultRecipient;
