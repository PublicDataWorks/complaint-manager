import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";
import NavBar from "../shared/components/NavBar/NavBar";
import LinkButton from "../shared/components/LinkButton";
import getCaseDetails from "../cases/thunks/getCaseDetails";
import removeCaseInmate from "../cases/thunks/removeCaseInmate";
import SelectedInmateDisplay from "./SelectedInmateDisplay";
import SelectedInmateForm from "./SelectedInmateForm";

const SelectedInmateDetails = props => {
  useEffect(() => {
    props.getCaseDetails(props.match.params.id);
  }, []);

  const getSelectedInmate = () => {
    const allInmates = [
      ...(props.caseDetails.complainantInmates || []),
      ...(props.caseDetails.witnessInmates || [])
    ];

    return allInmates.find(
      inmate => inmate.id + "" === props.match.params.caseInmateId
    );
  };

  const selectedInmate = getSelectedInmate();

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
        {selectedInmate && (
          <>
            <SelectedInmateDisplay
              caseId={props.match.params.id}
              selectedInmate={selectedInmate}
              removeCaseInmate={props.removeCaseInmate}
            />
            <SelectedInmateForm
              caseId={props.match.params.id}
              selectedInmate={selectedInmate}
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
    caseDetails: state.currentCase.details
  }),
  { getCaseDetails, removeCaseInmate }
)(SelectedInmateDetails);
