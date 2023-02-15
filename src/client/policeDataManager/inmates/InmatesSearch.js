import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardContent, Typography } from "@material-ui/core";
import NavBar from "../shared/components/NavBar/NavBar";
import LinkButton from "../shared/components/LinkButton";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";
import getCaseDetails from "../cases/thunks/getCaseDetails";
import InmateSearchForm from "./InmateSearchForm";
import InmateSearchResults from "./InmateSearchResults";

const InmatesSearch = props => {
  const caseDetailsNotYetLoaded = () => {
    return (
      !props.caseDetails || `${props.caseDetails.id}` !== props.match.params.id
    );
  };

  useEffect(() => {
    if (caseDetailsNotYetLoaded()) {
      props.getCaseDetails(props.match.params.id);
    }
  }, []);

  return (
    <section>
      <NavBar
        menuType={policeDataManagerMenuOptions}
        dataTest={"inmate-search-title"}
      >
        {props.caseReference
          ? `Case #${props.caseReference}   : Add Person in Custody`
          : ""}
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
        <div style={{ margin: "0 0 32px 0" }}>
          <Typography
            data-testid="search-page-header"
            variant="h6"
            className="officerSearchHeader"
          >
            Search for a Person in Custody
          </Typography>
        </div>
        <Card
          style={{
            backgroundColor: "white",
            margin: "0 0 32px 0"
          }}
        >
          <CardContent style={{ paddingBottom: "8px" }}>
            <Typography variant="body2" style={{ marginBottom: "8px" }}>
              Search by entering at least one of the following fields:
            </Typography>
            <InmateSearchForm />
          </CardContent>
        </Card>
        <InmateSearchResults />
      </section>
    </section>
  );
};

const mapStateToProps = state => ({
  caseReference: state.currentCase.details.caseReference
});

export default connect(mapStateToProps, { getCaseDetails })(InmatesSearch);
