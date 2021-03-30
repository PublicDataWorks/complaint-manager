import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { SEARCH_CASES_FORM_NAME } from "../../../../sharedUtilities/constants";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import styles from "../../../common/globalStyling/styles";
import { renderTextField } from "../sharedFormComponents/renderFunctions";
import axios from "axios";
import { searchSuccess } from "../../actionCreators/searchActionCreators";

const getSearchResults = async queryString => {
  return await axios.get(`api/cases/search`, {
    params: { queryString: queryString }
  });
};

class SearchCasesForm extends Component {
  submit = async ({ queryString }, dispatch) => {
    const response = await getSearchResults(queryString);
    dispatch(searchSuccess(response.data));
  };

  render() {
    return (
      <form
        onSubmit={event => event.preventDefault()}
        style={{ ...styles.searchBar }}
      >
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
          fullWidth
          placeholder="Search by complainant names, accused officers, tags"
          InputProps={{
            disableUnderline: true,
            style: {
              color: "#fff",
              fontFamily: [
                "IBM Plex Sans Medium",
                "IBM Plex Sans",
                "Arial",
                "sans-serif"
              ].join(","),
              fontWeight: "300",
              fontSize: "16px"
            }
          }}
        />
      </form>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = {};

const connectedForm = reduxForm({
  form: SEARCH_CASES_FORM_NAME
})(SearchCasesForm);

export default connect(mapStateToProps, mapDispatchToProps)(connectedForm);
