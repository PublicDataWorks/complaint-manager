import React, { Component } from "react";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { SEARCH_CASES_FORM_NAME } from "../../../../sharedUtilities/constants";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import styles from "../../../common/globalStyling/styles";
import { renderTextField } from "../sharedFormComponents/renderFunctions";

class SearchCasesForm extends Component {
  submit = async ({ queryString }, dispatch) => {
    const formattedQueryString = (queryString || "").trim();
    if (formattedQueryString.length < 1) return;
    dispatch(push(`/search?queryString=${formattedQueryString}`));
  };

  submitWithKey = event => {
    event.preventDefault();
    this.props.handleSubmit(this.submit)();
  };

  render() {
    return (
      <form onSubmit={this.submitWithKey} style={{ ...styles.searchBar }}>
        <IconButton
          color="inherit"
          data-testid="searchButton"
          onClick={this.props.handleSubmit(this.submit)}
        >
          <SearchIcon color="inherit" />
        </IconButton>
        <Field
          name="queryString"
          component={renderTextField}
          inputProps={{
            "data-testid": "searchField"
          }}
          fullWidth
          placeholder="Search by complainant names, accused officers, tags"
          InputProps={{
            disableUnderline: true,
            style: {
              color: "#fff",
              fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"].join(
                ","
              ),
              fontWeight: "300",
              fontSize: "16px"
            }
          }}
        />
      </form>
    );
  }
}

const searchCasesForm = reduxForm({
  form: SEARCH_CASES_FORM_NAME,
  destroyOnUnmount: false
})(SearchCasesForm);

export const mapsStateToProps = state => {
  let queryString = state.router.location.search;
  if (queryString) {
    queryString = queryString
      .substring(1)
      .split("&")
      .find(s => s.startsWith("queryString"));
    queryString = queryString
      ? decodeURIComponent(queryString.split("=")[1])
      : undefined;
  }
  return { initialValues: { queryString } };
};

export default connect(mapsStateToProps)(searchCasesForm);
