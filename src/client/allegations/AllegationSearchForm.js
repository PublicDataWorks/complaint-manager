import React from "react";
import { TextField } from "redux-form-material-ui";
import { change, Field, formValueSelector, reduxForm } from "redux-form";
import validate from "./validateAllegationSearchForm";
import {
  ALLEGATION_SEARCH_FORM_NAME,
  DEFAULT_PAGINATION_LIMIT
} from "../../sharedUtilities/constants";
import NoBlurTextField from "../cases/CaseDetails/CivilianDialog/FormSelect";
import {
  searchParagraphMenu,
  searchRuleMenu
} from "../utilities/generateMenus";
import getSearchResults from "../shared/thunks/getSearchResults";
import { PrimaryButton } from "../shared/components/StyledButtons";
import { connect } from "react-redux";
import { MenuItem, Typography } from "@material-ui/core";
import getAllegationDropdownValues from "../cases/thunks/getAllegationDropdownValues";
import { allegationFormNormalizer } from "../utilities/reduxFormNormalizers";

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
      const initialOffset = 0;
      const normalizedValues = {
        ...allegationFormNormalizer(values),
        offset: initialOffset,
        limit: DEFAULT_PAGINATION_LIMIT
      };
      dispatch(getSearchResults(normalizedValues, "allegations"));
    };

    const clearParagraphValue = () => {
      this.props.dispatch(change(ALLEGATION_SEARCH_FORM_NAME, "paragraph", ""));
    };

    return (
      <div data-test="allegationSearchBox">
        <form>
          <div style={{ display: "flex" }}>
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

            <Typography
              variant="button"
              style={{
                alignSelf: "flex-end",
                marginBottom: "22px",
                marginRight: "24px"
              }}
            >
              OR
            </Typography>

            <Field
              onChange={clearParagraphValue}
              label="Rule"
              name="rule"
              component={NoBlurTextField}
              data-test="ruleDropdown"
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

            <div style={{ alignSelf: "center", textAlign: "center" }}>
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
