import React, { Component } from "react";
import ActivityDisplay from "./ActivityDisplay";
import * as _ from "lodash";
import getCaseNotes from "../../thunks/getCaseNotes";
import { Typography } from "@material-ui/core";
import RemoveCaseNoteDialog from "../RemoveCaseNoteDialog/RemoveCaseNoteDialog";
import LinkButton from "../../../shared/components/LinkButton";
import { Link } from "react-router-dom";
import { TIMEZONE } from "../../../../sharedUtilities/constants";
import { initialize } from "redux-form";
import { openCaseNoteDialog } from "../../../actionCreators/casesActionCreators";
import timezone from "moment-timezone";
import { connect } from "react-redux";

class CaseNotes extends Component {
  componentDidMount() {
    this.props.dispatch(getCaseNotes(this.props.caseId));
  }

  render() {
    const { caseNotes, caseId } = this.props;
    return (
      <div style={{ margin: "0px 24px" }}>
        <div style={{ display: "flex" }}>
          <Typography
            variant={"title"}
            style={{
              marginBottom: "16px",
              flex: 1
            }}
          >
            Case Notes
          </Typography>
          {this.props.featureToggles.removePlusButton ? (
            <LinkButton
              component={Link}
              to={`/cases/${this.props.caseId}/history`}
              style={{ flex: 1, textAlign: "right", marginBottom: "16px" }}
            >
              View Case History
            </LinkButton>
          ) : null}
        </div>
        <div data-test="caseNotesContainer" style={{ paddingBottom: "16px" }}>
          {caseNotes.length === 0 ? (
            <Typography variant="body1">
              No case notes have been added
            </Typography>
          ) : (
            _.orderBy(caseNotes, ["actionTakenAt"], "desc").map(activity => {
              return (
                <ActivityDisplay
                  key={activity.id}
                  activity={activity}
                  caseId={caseId}
                  data-test="caseNotesItem"
                />
              );
            })
          )}
        </div>
        {this.props.featureToggles.removePlusButton ? (
          <LinkButton
            onClick={() => {
              this.props.dispatch(
                initialize("CaseNotes", {
                  actionTakenAt: timezone
                    .tz(new Date(Date.now()), TIMEZONE)
                    .format("YYYY-MM-DDTHH:mm")
                })
              );
              this.props.dispatch(openCaseNoteDialog("Add", {}));
            }}
          >
            + Add Case Note
          </LinkButton>
        ) : (
          <div style={{ width: "100%", textAlign: "right" }}>
            <LinkButton
              component={Link}
              to={`/cases/${this.props.caseId}/history`}
            >
              View Case History
            </LinkButton>
          </div>
        )}

        <RemoveCaseNoteDialog />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  featureToggles: state.featureToggles
});

export default connect(mapStateToProps)(CaseNotes);
