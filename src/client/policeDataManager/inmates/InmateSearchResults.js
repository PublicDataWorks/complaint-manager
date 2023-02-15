import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import SearchResults from "../shared/components/SearchResults";
import getSearchResults from "../shared/thunks/getSearchResults";
import { searchCleared } from "../actionCreators/searchActionCreators";
import { withStyles } from "@material-ui/core/styles";
import tableStyleGenerator from "../../tableStyles";
import LinkButton from "../shared/components/LinkButton";
import { COMPLAINANT } from "../../../sharedUtilities/constants";
import { snackbarSuccess } from "../actionCreators/snackBarActionCreators";

const FIELDS = [
  { name: "Name", key: ["firstName", "lastName"] },
  { name: "PiC ID", key: "inmateId" },
  { name: "Facility", key: "facility" },
  { name: "Gender", key: "gender" },
  { name: "Race", key: "race" },
  { name: "Age", key: "age" }
];

const styles = theme => {
  let style = tableStyleGenerator(theme);
  return {
    bodyRow: style.body.row,
    bodyCell: style.body.cell,
    headerRow: style.header.row,
    headerCell: style.header.cell,
    buttonCell: style.body.buttonCell
  };
};

export class InmateSearchResults extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  componentWillUnmount() {
    this.props.searchCleared();
  }

  normalizeValues(values) {
    const normalizedValues = values.directive && {
      directive: values.directive.trim()
    };
    return { ...values, ...normalizedValues };
  }

  onChange(currentPage) {
    const values = this.props.formValues;
    const paginatingSearch = true;

    this.props.getSearchResults(
      this.normalizeValues(values),
      "inmates",
      paginatingSearch,
      currentPage
    );

    if (document.getElementsByClassName("officerSearchHeader").length > 0) {
      document
        .getElementsByClassName("officerSearchHeader")[0]
        .scrollIntoView(true);
    }
  }

  addInmateToCase(inmate) {
    return axios
      .post(`api/cases/${this.props.caseDetails.id}/inmates`, {
        inmateId: inmate.inmateId,
        roleOnCase: COMPLAINANT
      })
      .then(() => {
        this.props.snackbarSuccess(
          "Person in Custody Successfully Added to Case"
        );
      })
      .catch(err => {});
  }

  render() {
    return (
      <SearchResults
        pagination={{
          onChange: this.onChange,
          totalMessage: total => `${total} results found`,
          count: this.props.count,
          currentPage: this.props.newPage
        }}
        searchResultsLength={
          this.props.searchResults ? this.props.searchResults.length : 0
        }
        spinnerVisible={this.props.spinnerVisible}
      >
        <Table style={{ marginBottom: "32px" }}>
          <TableHead>
            <TableRow className={this.props.classes.headerRow}>
              {FIELDS.map(field => (
                <TableCell
                  key={field.name}
                  data-testid={`${field.name.replace(" ", "")}Header`}
                  className={this.props.classes.headerCell}
                >
                  <Typography variant="subtitle2">{field.name}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.searchResults
              ? this.props.searchResults.map(inmate => (
                  <TableRow
                    key={inmate.inmateId}
                    className={this.props.classes.bodyRow}
                  >
                    {FIELDS.map(field => (
                      <TableCell
                        key={field.name}
                        className={this.props.classes.bodyCell}
                      >
                        {typeof field.key === "string"
                          ? inmate[field.key]
                          : field.key.map(key => inmate[key]).join(" ")}
                      </TableCell>
                    ))}
                    <TableCell className={this.props.classes.buttonCell}>
                      <LinkButton
                        data-testid={`${inmate.inmateId}-select-button`}
                        onClick={() => {
                          this.addInmateToCase(inmate).then(() => {
                            this.props.push(
                              `/cases/${this.props.caseDetails.id}`
                            );
                          });
                        }}
                      >
                        SELECT
                      </LinkButton>
                    </TableCell>
                  </TableRow>
                ))
              : ""}
          </TableBody>
        </Table>
      </SearchResults>
    );
  }
}

const mapStateToProps = state => {
  return {
    caseDetails: state.currentCase.details,
    searchResults: state.ui.search.searchResults.rows,
    spinnerVisible: state.ui.search.spinnerVisible,
    count: state.ui.search.searchResults.count,
    newPage: state.ui.search.newPage,
    formValues: state.form["InmateSearchForm"].values
  };
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, {
    getSearchResults,
    push,
    searchCleared,
    snackbarSuccess
  })(InmateSearchResults)
);
