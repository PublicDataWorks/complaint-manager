import React from "react";
import { TextField } from "redux-form-material-ui";
import { Field, reduxForm } from "redux-form";
import NoBlurTextField from "../../../cases/CaseDetails/CivilianDialog/FormSelect";
import { searchDistrictMenu } from "../../../utilities/generateMenus";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import validate from "./validateOfficerSearchForm";
import getSearchResults from "../../../shared/thunks/getSearchResults";
import { OFFICER_SEARCH_FORM_NAME } from "../../../../sharedUtilities/constants";

const OfficerSearchForm = props => {
  const { invalid, handleSubmit } = props;

  const onSubmit = (values, dispatch) => {
    const paginatingSearch = true;
    dispatch(
      getSearchResults(normalizeValues(values), "officers", paginatingSearch, 1)
    );
  };

  const normalizeValues = values => {
    const normalizedValues = {};
    if (values.firstName) {
      normalizedValues.firstName = values.firstName.trim();
    }
    if (values.lastName) {
      normalizedValues.lastName = values.lastName.trim();
    }
    return { ...values, ...normalizedValues };
  };

  return (
    <div>
      <form>
        <div style={{ display: "flex" }}>
          <Field
            label="First Name"
            name="firstName"
            component={TextField}
            inputProps={{ "data-test": "firstNameField" }}
            style={{ flex: "1", marginRight: "24px" }}
          />

          <Field
            label="Last Name"
            name="lastName"
            component={TextField}
            inputProps={{ "data-test": "lastNameField" }}
            style={{ flex: "1", marginRight: "24px" }}
          />

          <Field
            label="District"
            name="district"
            component={NoBlurTextField}
            inputProps={{ "data-test": "districtField" }}
            style={{ flex: "1", marginRight: "24px" }}
          >
            {searchDistrictMenu}
          </Field>
          <div style={{ alignSelf: "center" }}>
            <PrimaryButton
              disabled={invalid}
              onClick={handleSubmit(onSubmit)}
              style={{ margin: "18px 0" }}
              data-test="officerSearchSubmitButton"
            >
              search
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default reduxForm({
  form: OFFICER_SEARCH_FORM_NAME,
  validate
})(OfficerSearchForm);
