import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";
import NavBar from "../shared/components/NavBar/NavBar";
import LinkButton from "../shared/components/LinkButton";
import getCaseDetails from "../cases/thunks/getCaseDetails";
import SelectedInmateDisplay from "./SelectedInmateDisplay";
import SelectedInmateForm from "./SelectedInmateForm";
import { removeSelectedInmate } from "../actionCreators/inmateActionCreators";

const SelectedInmateDetails = props => {
  useEffect(() => {
    props.getCaseDetails(props.match.params.id);
    return props.removeSelectedInmate;
  }, []);

  return (
    <section>
      <NavBar menuType={policeDataManagerMenuOptions}>
        {`Case #${props.caseDetails.caseReference}   : Add Person in Custody`}
      </NavBar>
      <LinkButton
        data-testid="back-to-case-link"
        component={Link}
        to={`/cases/${props.match.params.id}`}
        style={{ margin: "2% 0% 2% 4%" }}
      >
        Back to Case
      </LinkButton>
      <section style={{ margin: "0% 5% 3%", maxWidth: "60rem" }}>
        <Typography variant="h6">Selected Person in Custody</Typography>
        {props.selectedInmate.inmate && (
          <>
            <SelectedInmateDisplay
              caseId={props.match.params.id}
              selectedInmate={props.selectedInmate.inmate}
              removeCaseInmate={props.removeCaseInmate}
              roleOnCase={props.match.params.roleOnCase}
            />
            <SelectedInmateForm
              caseId={props.match.params.id}
              selectedInmate={props.selectedInmate.inmate}
              roleOnCase={props.match.params.roleOnCase}
            />
          </>
        )}
      </section>
    </section>
  );
};

export default connect(
  state => ({
    caseDetails: state.currentCase.details,
    selectedInmate: state.ui.inmateDetails
  }),
  { getCaseDetails, removeSelectedInmate }
)(SelectedInmateDetails);
