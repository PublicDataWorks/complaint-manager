import React, { Component } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { Card, CardContent, Typography } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import LetterProgressStepper from "../LetterProgressStepper";
import getCaseDetails from "../../thunks/getCaseDetails";
import { connect } from "react-redux";
import { LETTER_PROGRESS } from "../../../../sharedUtilities/constants";
import _ from "lodash";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import OfficerHistoryTabContent from "./OfficerHistoryTabContent";
import { FieldArray, reduxForm } from "redux-form";

class OfficerHistories extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedTab: 0 };
  }

  caseDetailsNotYetLoaded() {
    return (
      _.isEmpty(this.props.caseDetail) ||
      `${this.props.caseDetail.id}` !== this.props.match.params.id
    );
  }

  componentDidMount() {
    this.props.dispatch(getCaseDetails(this.props.match.params.id));
  }

  handleTabChange = (event, selectedTab) => {
    this.setState({ selectedTab });
  };

  renderTabHeaders = () => {
    return this.props.caseDetail.accusedOfficers.map(accusedOfficer => {
      return (
        <Tab
          key={accusedOfficer.id}
          label={accusedOfficer.fullName}
          data-test={`tab-${accusedOfficer.id}`}
        />
      );
    });
  };

  renderOfficerFields = ({ fields, selectedTab }) => {
    return fields.map((officer, index) => {
      const isSelectedOfficer = index === selectedTab;
      const caseOfficer = fields.get(index);
      return (
        <OfficerHistoryTabContent
          officer={officer}
          caseOfficerName={caseOfficer.fullName}
          caseOfficerId={caseOfficer.id}
          key={index}
          isSelectedOfficer={isSelectedOfficer}
        />
      );
    });
  };

  render() {
    const caseId = this.props.match.params.id;
    const { selectedTab } = this.state;

    if (this.caseDetailsNotYetLoaded()) {
      return null;
    }

    return (
      <div>
        <NavBar>
          <Typography data-test="pageTitle" variant="title" color="inherit">
            {`Case #${caseId}   : Letter Generation`}
          </Typography>
        </NavBar>

        <LinkButton
          data-test="save-and-return-to-case-link"
          component={Link}
          to={`/cases/${caseId}`}
          style={{ margin: "2% 0% 2% 4%" }}
        >
          Save and Return to Case
        </LinkButton>

        <div style={{ margin: "0% 5% 3%", width: "60%" }}>
          <LetterProgressStepper
            currentLetterStatus={LETTER_PROGRESS.OFFICER_COMPLAINT_HISTORIES}
          />
          <div style={{ margin: "0 0 32px 0" }}>
            <Typography variant="title">Officer Complaint History</Typography>
          </div>

          <Card>
            <CardContent style={{ backgroundColor: "white", padding: 0 }}>
              <AppBar position="static" style={{ backgroundColor: "white" }}>
                <Tabs
                  value={selectedTab}
                  onChange={this.handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  scrollable
                  scrollButtons="auto"
                >
                  {this.renderTabHeaders()}
                </Tabs>
              </AppBar>
              <form>
                <FieldArray
                  name="officers"
                  component={this.renderOfficerFields}
                  selectedTab={this.state.selectedTab}
                />
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseDetail: state.currentCase.details,
  initialValues: { officers: state.currentCase.details.accusedOfficers }
});

export default connect(mapStateToProps)(
  reduxForm({ form: "OfficerHistories", enableReinitialize: true })(
    OfficerHistories
  )
);
