import React, { Fragment } from "react";
import tableStyleGenerator from "../tableStyles";
import { TableCell, TableRow } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import formatStringToTitleCase from "../utilities/formatStringToTitleCase";
import AllegationDetailsForm from "./AllegationDetailsForm";
import LinkButton from "../shared/components/LinkButton";

const styles = theme => ({
  ...tableStyleGenerator(theme).body
});

export class AllegationSearchResultsRow extends React.Component {
  state = {
    displayForm: false,
    displaySelectButton: true
  };

  selectAllegation = () => {
    this.setState({ displayForm: true, displaySelectButton: false });
  };

  renderForm = () => {
    if (!this.state.displayForm) {
      return null;
    }

    const { classes, allegation } = this.props;
    const secondaryRowClasses = `${classes.row} ${classes.noBorderTop}`;
    return (
      <TableRow className={secondaryRowClasses}>
        <TableCell colSpan={4} className={classes.cell}>
          <AllegationDetailsForm
            form={`AllegationDetailsForm_${allegation.id}`}
            allegationId={allegation.id}
            caseId={this.props.caseId}
            caseOfficerId={this.props.caseOfficerId}
          />
        </TableCell>
      </TableRow>
    );
  };

  renderSelectButton = () => {
    if (!this.state.displaySelectButton) {
      return null;
    }

    return (
      <LinkButton
        data-test="selectAllegationButton"
        onClick={this.selectAllegation}
      >
        Select
      </LinkButton>
    );
  };

  render() {
    const { classes, allegation } = this.props;
    const primaryRowClasses = `${classes.row} ${classes.noBorderBottom}`;
    const primaryCellClasses = `${classes.cell} ${classes.noBorderBottom}`;
    const primaryButtonCellClasses = `${classes.buttonCell} ${
      classes.noBorderBottom
    }`;

    return (
      <Fragment>
        <TableRow className={primaryRowClasses}>
          <TableCell className={primaryCellClasses}>
            {formatStringToTitleCase(allegation.rule)}
          </TableCell>
          <TableCell className={primaryCellClasses}>
            {formatStringToTitleCase(allegation.paragraph)}
          </TableCell>
          <TableCell className={primaryCellClasses}>
            {allegation.directive
              ? formatStringToTitleCase(allegation.directive)
              : "N/A"}
          </TableCell>
          <TableCell className={primaryButtonCellClasses}>
            {this.renderSelectButton()}
          </TableCell>
        </TableRow>
        {this.renderForm()}
      </Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  AllegationSearchResultsRow
);
