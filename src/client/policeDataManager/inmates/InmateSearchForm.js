import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import Dropdown from "../../common/components/Dropdown";
import { generateMenuOptions } from "../utilities/generateMenuOptions";
import { PrimaryButton } from "../shared/components/StyledButtons";
import getSearchResults from "../shared/thunks/getSearchResults";
import { nullifyFieldUnlessValid } from "../utilities/fieldNormalizers";
import { renderTextField } from "../cases/sharedFormComponents/renderFunctions";
import validate from "../officers/OfficerSearch/OfficerSearchForm/validateOfficerSearchForm";

const normalizeValues = values => {
  const normalizedValues = {};
  if (values.inmateId) {
    normalizedValues.inmateId = values.inmateId.trim();
  }
  if (values.firstName) {
    normalizedValues.firstName = values.firstName.trim();
  }
  if (values.lastName) {
    normalizedValues.lastName = values.lastName.trim();
  }
  // if (values.districtId) {
  //   normalizedValues.districtId = nullifyFieldUnlessValid(values.districtId);
  // }
  return { ...values, ...normalizedValues };
};

class InmateSearchForm extends Component {
  onSubmit = (values, dispatch) => {
    const paginatingSearch = true;
    dispatch(
      getSearchResults(normalizeValues(values), "inmates", paginatingSearch, 1)
    );
  };

  render() {
    const props = this.props;

    return (
      <div>
        <form>
          <div style={{ display: "flex" }}>
            <Field
              label="ID Number"
              name="inmateId"
              component={renderTextField}
              inputProps={{
                "data-testid": "idField",
                autoComplete: "off",
                "aria-label": "Inmate ID Field"
              }}
              style={{ flex: "1", marginRight: "24px" }}
            />
            <Field
              label="First Name"
              name="firstName"
              component={renderTextField}
              inputProps={{
                "data-testid": "firstNameField",
                autoComplete: "off",
                "aria-label": "First Name Field"
              }}
              style={{ flex: "1", marginRight: "24px" }}
            />

            <Field
              label="Last Name"
              name="lastName"
              component={renderTextField}
              inputProps={{
                "data-testid": "lastNameField",
                autoComplete: "off",
                "aria-label": "Last Name Field"
              }}
              style={{ flex: "1", marginRight: "24px" }}
            />
            {/* <Field
              label="District"
              name="districtId"
              component={Dropdown}
              data-testid="districtField"
              style={{ flex: "1", marginRight: "24px", padding: "5px" }}
              inputProps={{
                "data-testid": "districtInput",
                "aria-label": "District Field"
              }}
            >
              {generateMenuOptions(props.districts, "Any District")}
            </Field> */}
            <div style={{ alignSelf: "center" }}>
              <PrimaryButton
                disabled={props.invalid}
                onClick={props.handleSubmit(this.onSubmit)}
                style={{ margin: "18px 0" }}
                data-testid="inmateSearchSubmitButton"
              >
                search
              </PrimaryButton>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: "InmateSearchForm",
  validate: validate([
    { name: "firstName", isText: true },
    { name: "lastName", isText: true },
    { name: "inmateId", isText: true }
  ])
})(InmateSearchForm);
