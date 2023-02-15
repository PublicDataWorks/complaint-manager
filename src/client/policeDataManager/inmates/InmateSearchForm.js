import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Card, CardContent, Typography } from "@material-ui/core";
import Dropdown from "../../common/components/Dropdown";
import { generateMenuOptions } from "../utilities/generateMenuOptions";
import { PrimaryButton } from "../shared/components/StyledButtons";
import getSearchResults from "../shared/thunks/getSearchResults";
import { nullifyFieldUnlessValid } from "../utilities/fieldNormalizers";
import { renderTextField } from "../cases/sharedFormComponents/renderFunctions";
import validate from "../officers/OfficerSearch/OfficerSearchForm/validateOfficerSearchForm";
import getFacilities from "../cases/thunks/getFacilities";

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
  if (values.facility) {
    normalizedValues.facility = nullifyFieldUnlessValid(values.facility);
  }
  return { ...values, ...normalizedValues };
};

class InmateSearchForm extends Component {
  componentDidMount() {
    if (!this.props.facilities?.length) {
      // we don't expect facilities to change often, so no need to refresh
      this.props.getFacilities();
    }
  }

  onSubmit = (values, dispatch) => {
    const paginatingSearch = true;
    dispatch(
      getSearchResults(normalizeValues(values), "inmates", paginatingSearch, 1)
    );
  };

  render() {
    const props = this.props;

    return (
      <Card
        style={{
          backgroundColor: "white",
          margin: "0 0 32px 0"
        }}
      >
        <CardContent style={{ paddingBottom: "8px" }}>
          <Typography variant="body2" style={{ marginBottom: "8px" }}>
            Search by entering at least one of the following fields:
          </Typography>
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
              <Field
                label="Facility"
                name="facility"
                component={Dropdown}
                data-testid="facility-field"
                style={{ flex: "2", marginRight: "24px", padding: "5px" }}
                inputProps={{
                  "data-testid": "facility-input",
                  "aria-label": "Facility Field"
                }}
              >
                {generateMenuOptions(
                  props.facilities.map(facility => [
                    facility.name,
                    facility.id
                  ]),
                  "Any Facility"
                )}
              </Field>
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
        </CardContent>
      </Card>
    );
  }
}

export default reduxForm({
  form: "InmateSearchForm",
  validate: validate([
    { name: "firstName", isText: true },
    { name: "lastName", isText: true },
    { name: "inmateId", isText: true },
    { name: "facility", isText: false }
  ])
})(
  connect(state => ({ facilities: state.facilities }), { getFacilities })(
    InmateSearchForm
  )
);
