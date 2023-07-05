import React from "react";
import { change, Field, formValueSelector, reduxForm } from "redux-form";
import validate from "./validateAllegationSearchForm";
import { ALLEGATION_SEARCH_FORM_NAME } from "../../../sharedUtilities/constants";
import Dropdown from "../../common/components/Dropdown";
import {
  searchParagraphMenu,
  searchRuleMenu
} from "../utilities/generateMenuOptions";
import getSearchResults from "../shared/thunks/getSearchResults";
import { PrimaryButton } from "../shared/components/StyledButtons";
import { connect } from "react-redux";
import { MenuItem, Typography } from "@material-ui/core";
import getAllegationDropdownValues from "../cases/thunks/getAllegationDropdownValues";
import { renderTextField } from "../cases/sharedFormComponents/renderFunctions";

class AllegationSearchForm extends React.Component {
  async componentDidMount() {
    await this.props.dispatch(getAllegationDropdownValues());
  }

  render() {
    const { invalid, handleSubmit, currentRuleSelected, allegations } =
      this.props;

    const onSubmit = (values, dispatch) => {
      const paginatingSearch = false;
      const firstPage = 1;
      dispatch(
        getSearchResults(values, "allegations", paginatingSearch, firstPage)
      );
    };

    const clearParagraphValue = () => {
      this.props.dispatch(change(ALLEGATION_SEARCH_FORM_NAME, "paragraph", ""));
    };

    return (
      <div data-testid="allegationSearchBox">
        <form>
          <div style={{ display: "flex" }}>
            <Field
              onChange={clearParagraphValue}
              label="Rule"
              name="rule"
              component={Dropdown}
              data-testid="ruleDropdown"
              inputProps={{
                "data-testid": "ruleInput",
                autoComplete: "off"
              }}
              style={{ flex: "1", marginRight: "24px" }}
            >
              {searchRuleMenu(allegations)}
            </Field>
            <Field
              label="Paragraph"
              name="paragraph"
              component={Dropdown}
              inputProps={{
                "data-testid": "paragraphInput",
                autoComplete: "off",
                disabled: !currentRuleSelected
              }}
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
                data-testid="allegationSearchSubmitButton"
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
