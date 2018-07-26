import React, { Component } from "react";
import ActivityDisplay from "./ActivityDisplay";
import * as _ from "lodash";
import getCaseNotes from "../../thunks/getCaseNotes";
import { Typography } from "@material-ui/core";
import RemoveCaseNoteDialog from "../RemoveCaseNoteDialog/RemoveCaseNoteDialog";
import LinkButton from "../../../shared/components/LinkButton";
import { Link } from "react-router-dom";

class CaseNotes extends Component {
  componentDidMount() {
    this.props.dispatch(getCaseNotes(this.props.caseId));
  }

  render() {
    const { caseNotes, caseId } = this.props;
    return (
      <div style={{ margin: "0px 24px" }}>
        <Typography
          variant={"title"}
          style={{
            marginBottom: "16px"
          }}
        >
          Case Notes
        </Typography>
        <div
          data-test="caseNotesContainer"
          style={{ paddingBottom: "16px" }}
        >
          {caseNotes.length === 0 ? (
            <Typography variant="body1">
              No case notes have been added
            </Typography>
          ) : (
            _.orderBy(caseNotes, ["actionTakenAt"], "desc").map(
              activity => {
                return (
                  <ActivityDisplay
                    key={activity.id}
                    activity={activity}
                    caseId={caseId}
                    data-test="caseNotesItem"
                  />
                );
              }
            )
          )}
        </div>
        <RemoveCaseNoteDialog />
        <div style={{ width: "100%", textAlign: "right" }}>
          <LinkButton
            component={Link}
            to={`/cases/${this.props.caseId}/history`}
          >
            View Case History
          </LinkButton>
        </div>
      </div>
    );
  }
}

export default CaseNotes;
