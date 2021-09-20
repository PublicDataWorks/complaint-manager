import React, { Component } from "react";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { SEARCH_CASES_FORM_NAME } from "../../../../sharedUtilities/constants";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import styles from "../../../common/globalStyling/styles";
import { renderTextField } from "../sharedFormComponents/renderFunctions";
import { InputAdornment, ClickAwayListener } from "@material-ui/core";
import { HelpOutline } from "@material-ui/icons";
import SearchTooltip from "./SearchTooltip";

class SearchCasesForm extends Component {
  constructor(props) {
    super(props);
    this.state = { tooltipVisible: false };
    this.tooltipButtonRef = React.createRef();
  }

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
      <ClickAwayListener
        onClickAway={() => this.setState({ tooltipVisible: false })}
      >
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
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle-search-tooltip"
                    edge="end"
                    data-testid="search-tooltip-button"
                    onClick={() =>
                      this.setState({
                        tooltipVisible: !this.state.tooltipVisible
                      })
                    }
                    ref={this.tooltipButtonRef}
                  >
                    <HelpOutline style={{ color: "white" }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          {this.state.tooltipVisible ? (
            <SearchTooltip
              top={this.calculateTooltipTop()}
              left={this.calculateTooltipLeft()}
              maxWidth={650}
              arrowLeft={
                this.tooltipButtonRef.current.getBoundingClientRect().left
              }
              arrowWidth={this.tooltipButtonRef.current.clientWidth}
            />
          ) : (
            ""
          )}
        </form>
      </ClickAwayListener>
    );
  }

  calculateTooltipLeft() {
    return this.tooltipButtonRef.current.getBoundingClientRect().left - 600;
  }

  calculateTooltipTop() {
    return (
      this.tooltipButtonRef.current.getBoundingClientRect().top +
      this.tooltipButtonRef.current.clientHeight +
      20
    );
  }
}

const searchCasesForm = reduxForm({
  form: SEARCH_CASES_FORM_NAME,
  destroyOnUnmount: false
})(SearchCasesForm);

export const mapStateToProps = state => {
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

export default connect(mapStateToProps)(searchCasesForm);
