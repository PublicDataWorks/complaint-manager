import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import DropdownSelect from "../../../cases/CaseDetails/CivilianDialog/DropdownSelect";
import { generateMenuOptions } from "../../../utilities/generateMenuOptions";
import { PrimaryButton } from "../../../shared/components/StyledButtons";
import validate from "./validateOfficerSearchForm";
import getSearchResults from "../../../shared/thunks/getSearchResults";
import { OFFICER_SEARCH_FORM_NAME } from "../../../../../sharedUtilities/constants";
import getDistrictDropdownValues from "../../../districts/thunks/getDistrictDropdownValues";
import { connect } from "react-redux";
import { nullifyFieldUnlessValid } from "../../../utilities/fieldNormalizers";
import { renderField } from "../../../cases/sharedFormComponents/renderFunctions";

const normalizeValues = values => {
  const normalizedValues = {};
  if (values.firstName) {
    normalizedValues.firstName = values.firstName.trim();
  }
  if (values.lastName) {
    normalizedValues.lastName = values.lastName.trim();
  }
  if (values.districtId) {
    normalizedValues.districtId = nullifyFieldUnlessValid(values.districtId);
  }
  return { ...values, ...normalizedValues };
};

class OfficerSearchForm extends Component {
  componentDidMount() {
    this.props.getDistrictDropdownValues();
  }

  onSubmit = (values, dispatch) => {
    const paginatingSearch = true;
    dispatch(
      getSearchResults(normalizeValues(values), "officers", paginatingSearch, 1)
    );
  };

  render() {
    const props = this.props;

    return (
      <div>
        <form>
          <div style={{ display: "flex" }}>
            <Field
              label="First Name"
              name="firstName"
              component={renderField}
              inputProps={{ "data-test": "firstNameField" }}
              style={{ flex: "1", marginRight: "24px" }}
            />

            <Field
              label="Last Name"
              name="lastName"
              component={renderField}
              inputProps={{ "data-test": "lastNameField" }}
              style={{ flex: "1", marginRight: "24px" }}
            />

            <Field
              label="District"
              name="districtId"
              component={DropdownSelect}
              data-test="districtField"
              style={{ flex: "1", marginRight: "24px", padding: "5px" }}
            >
              {generateMenuOptions(props.districts, "Any District")}
            </Field>
            <div style={{ alignSelf: "center" }}>
              <PrimaryButton
                disabled={props.invalid}
                onClick={props.handleSubmit(this.onSubmit)}
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
  }
}

const mapStateToProps = state => {
  return {
    districts: state.ui.districts
  };
};

const mapDispatchToProps = {
  getDistrictDropdownValues
};

const connectedForm = reduxForm({
  form: OFFICER_SEARCH_FORM_NAME,
  validate
})(OfficerSearchForm);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(connectedForm);
