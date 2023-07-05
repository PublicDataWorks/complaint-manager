import React, { Fragment } from "react";
import tableStyleGenerator from "../../tableStyles";
import { TableCell, TableRow } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AllegationDetailsForm from "./AllegationDetailsForm";
import LinkButton from "../shared/components/LinkButton";
import Allegation from "./Allegation";
import createOfficerAllegation from "../cases/thunks/createOfficerAllegation";
import { ALLEGATION_DETAILS_LABEL } from "../../../sharedUtilities/constants";

const styles = theme => ({
  ...tableStyleGenerator(theme).body
});

export class AllegationSearchResultsRow extends React.Component {
  state = {
    displayForm: false,
    displaySelectButton: true
  };

  addAllegationSuccess = () => {
    this.setState({ displayForm: false, displaySelectButton: true });
    if (
      document.getElementsByTagName("header").length > 0 &&
      process.env.NODE_ENV !== "test"
    ) {
      document.getElementsByTagName("header")[0].scrollIntoView(false);
    }
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
            allegationDetailsLabel={ALLEGATION_DETAILS_LABEL}
            marginBottomOffset={16}
            onSubmit={(values, dispatch) => {
              const formValues = {
                ...values,
                allegationId: allegation.id
              };
              dispatch(
                createOfficerAllegation(
                  formValues,
                  this.props.caseId,
                  this.props.caseOfficerId,
                  this.addAllegationSuccess
                )
              );
            }}
            submitButtonText="Add Allegation"
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
        data-testid="selectAllegationButton"
        onClick={this.selectAllegation}
      >
        Select
      </LinkButton>
    );
  };

  render() {
    const { classes, allegation } = this.props;
    const primaryRowClasses = `${classes.row} ${classes.noBorderBottom}`;
    const primaryButtonCellClasses = `${classes.buttonCell} ${classes.noBorderBottom}`;

    return (
      <Fragment>
        <TableRow className={primaryRowClasses}>
          <Allegation allegation={allegation} />
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
