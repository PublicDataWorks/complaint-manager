import React from "react";
import { TextField } from "redux-form-material-ui";
import { change, Field, formValueSelector, reduxForm } from "redux-form";
import validate from "./validateAllegationSearchForm";
import { ALLEGATION_SEARCH_FORM_NAME } from "../../sharedUtilities/constants";
import NoBlurTextField from "../cases/CaseDetails/CivilianDialog/FormSelect";
import {
  searchParagraphMenu,
  searchRuleMenu
} from "../utilities/generateMenus";
import getSearchResults from "../shared/thunks/getSearchResults";
import { PrimaryButton } from "../shared/components/StyledButtons";
import { connect } from "react-redux";
import { MenuItem } from "@material-ui/core";
import getAllegationDropdownValues from "../cases/thunks/getAllegationDropdownValues";

class AllegationSearchForm extends React.Component {
  async componentDidMount() {
    await this.props.dispatch(getAllegationDropdownValues());
  }

  render() {
    const {
      invalid,
      handleSubmit,
      currentRuleSelected,
      allegations
    } = this.props;

    const onSubmit = (values, dispatch) => {
      dispatch(getSearchResults(normalizeValues(values), "allegations"));
    };

    const normalizeValues = values => {
      const normalizedValues = {};
      if (values.directive) {
        normalizedValues.directive = values.directive.trim();
      }
      return { ...values, ...normalizedValues };
    };

    const clearParagraphValue = () => {
      this.props.dispatch(change(ALLEGATION_SEARCH_FORM_NAME, "paragraph", ""));
    };

    return (
      <div>
        <form>
          <div style={{ display: "flex" }}>
            <Field
              onChange={clearParagraphValue}
              label="Rule"
              name="rule"
              component={NoBlurTextField}
              inputProps={{
                "data-test": "ruleField"
              }}
              style={{ flex: "1", marginRight: "24px" }}
            >
              {searchRuleMenu(allegations)}
            </Field>
            <Field
              disabled={!currentRuleSelected}
              label="Paragraph"
              name="paragraph"
              component={NoBlurTextField}
              inputProps={{ "data-test": "paragraphField" }}
              style={{ flex: "1", marginRight: "24px" }}
            >
              {currentRuleSelected || currentRuleSelected ? (
                searchParagraphMenu(allegations, currentRuleSelected)
              ) : (
                <MenuItem />
              )}
            </Field>

            <Field
              label="Directive Keyword"
              name="directive"
              component={TextField}
              placeholder="Enter one or more keywords"
              inputProps={{ "data-test": "directiveField" }}
              style={{ flex: "1", marginRight: "24px" }}
              InputLabelProps={{
                shrink: true
              }}
            />
            <div style={{ flex: "2", alignSelf: "center", textAlign: "right" }}>
              <PrimaryButton
                disabled={invalid}
                onClick={handleSubmit(onSubmit)}
                style={{ margin: "18px 0" }}
                data-test="allegationSearchSubmitButton"
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

AllegationSearchForm = reduxForm({
  form: ALLEGATION_SEARCH_FORM_NAME,
  validate
})(AllegationSearchForm);

const selector = formValueSelector(ALLEGATION_SEARCH_FORM_NAME);

AllegationSearchForm = connect(state => {
  const currentRuleSelected = selector(state, "rule");
  return {
    allegations: state.ui.allegations,
    currentRuleSelected
  };
})(AllegationSearchForm);

export default AllegationSearchForm;
