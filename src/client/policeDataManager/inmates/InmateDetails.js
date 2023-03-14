import React, { useEffect } from "react";
import { connect } from "react-redux";
import NavBar from "../shared/components/NavBar/NavBar";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";
import getCaseDetails from "../cases/thunks/getCaseDetails";
import { Link } from "react-router-dom";
import LinkButton from "../shared/components/LinkButton";
import { Typography } from "@material-ui/core";
import ManuallyEnterInmateForm from "./ManuallyEnterInmateForm";
import getFacilities from "../cases/thunks/getFacilities";

const InmateDetails = props => {
  const caseDetailsNotYetLoaded = () => {
    return (
      !props.caseDetails || `${props.caseDetails.id}` !== props.match.params.id
    );
  };

  useEffect(() => {
    if (caseDetailsNotYetLoaded()) {
      props.getCaseDetails(props.match.params.id);
    }

    if (!props.facilities?.length) {
      props.getFacilities();
    }
  }, []);

  return (
    <section>
      <NavBar menuType={policeDataManagerMenuOptions}>
        {`Case #${props.caseDetails.id}   : Add Person in Custody`}
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
        <Typography variant="h6">
          Selected Manually Add Person in Custody
        </Typography>
        <section>
          <Typography
            data-testid="unknownOfficerMessage"
            style={{ marginBottom: "32px" }}
            variant="body2"
          >
            You have selected Manually Add Person in Custody. Go back to search
            the roster by selecting Search for Person in Custody.
          </Typography>
        </section>
        <section style={{ float: "right" }}>
          <LinkButton
            data-testid="back-to-search-link"
            component={Link}
            to={`/cases/${props.match.params.id}/inmates/${props.match.params.roleOnCase}/search`}
          >
            Search for Person in Custody
          </LinkButton>
        </section>
        <ManuallyEnterInmateForm
          caseId={props.match.params.id}
          roleOnCase={props.match.params.roleOnCase}
          facilities={props.facilities}
        />
      </section>
    </section>
  );
};

export default connect(
  state => ({
    caseDetails: state.currentCase.details,
    facilities: state.facilities
  }),
  { getCaseDetails, getFacilities }
)(InmateDetails);
