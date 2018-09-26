import React, { Component } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../../shared/components/NavBar/NavBar";
import { Typography, Card, CardContent } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import LetterProgressStepper from "../LetterProgressStepper";
import getCaseDetails from "../../thunks/getCaseDetails";
import { connect } from "react-redux";
import { LETTER_PROGRESS } from "../../../../sharedUtilities/constants";
import _ from "lodash";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

export class OfficerHistories extends Component {
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

  renderTabContents = () => {
    const officer = this.props.caseDetail.accusedOfficers[
      this.state.selectedTab
    ];

    return (
      <Typography
        component="div"
        style={{ padding: 8 * 3 }}
        data-test={`tab-content-${officer.id}`}
      >
        {officer.fullName}
      </Typography>
    );
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
              {this.renderTabContents()}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseDetail: state.currentCase.details
});

export default connect(mapStateToProps)(OfficerHistories);
