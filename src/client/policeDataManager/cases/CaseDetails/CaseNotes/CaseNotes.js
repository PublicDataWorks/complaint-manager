import React, { Component, lazy, Suspense } from "react";
import ActivityDisplay from "./ActivityDisplay";
import * as _ from "lodash";
import getCaseNotes from "../../thunks/getCaseNotes";
import { Typography } from "@material-ui/core";
import LinkButton from "../../../shared/components/LinkButton";
import { Link } from "react-router-dom";
import {
  getCaseNotesSuccess,
  openCaseNoteDialog
} from "../../../actionCreators/casesActionCreators";
import timezone from "moment-timezone";
import { TIMEZONE } from "../../../../../sharedUtilities/constants";
import { initialize } from "redux-form";
import { connect } from "react-redux";
import { generateMenuOptions } from "../../../utilities/generateMenuOptions";
const RemoveCaseNoteDialog = lazy(() =>
  import("../RemoveCaseNoteDialog/RemoveCaseNoteDialog")
);

class CaseNotes extends Component {
  componentDidMount() {
    this.props.dispatch(getCaseNotes(this.props.caseId));
  }

  componentWillUnmount() {
    this.props.dispatch(getCaseNotesSuccess([]));
  }

  render() {
    const { caseNotes, caseId } = this.props;
    const mappedUsers = this.props.allUsers.map(user => {
      return [user.name, user.email];
    });

    return (
      <div>
        <div style={{ margin: "0px 24px" }}>
          <div style={{ display: "flex" }}>
            <Typography
              variant={"h6"}
              style={{
                marginBottom: "16px",
                flex: 1
              }}
            >
              Case Notes
            </Typography>
            <LinkButton
              component={Link}
              to={`/cases/${this.props.caseId}/history`}
              style={{ textAlign: "right", marginBottom: "16px" }}
            >
              View Case History
            </LinkButton>
          </div>
          <div
            data-testid="caseNotesContainer"
            style={{ paddingBottom: "16px" }}
          >
            {this.props.fetchingCaseNotes === true ? null : caseNotes.length ===
              0 ? (
              <Typography variant="body2">
                No case notes have been added
              </Typography>
            ) : (
              _.orderBy(caseNotes, ["actionTakenAt"], "desc").map(activity => {
                return (
                  <ActivityDisplay
                    key={activity.id}
                    activity={activity}
                    caseId={caseId}
                    highlightedCaseNote={this.props.highlightedCaseNote}
                    allUsers={generateMenuOptions(mappedUsers)}
                    data-testid="caseNotesItem"
                  />
                );
              })
            )}
          </div>
          <Suspense
            fallback={() => (
              <CircularProgress data-testid="spinner" size={30} />
            )}
          >
            <RemoveCaseNoteDialog />
          </Suspense>
        </div>
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
          style={{ margin: "0% 0% 5% 2%" }}
          data-testid="addCaseNoteButton"
        >
          + Add Case Note
        </LinkButton>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  caseId: state.currentCase.details.id,
  caseNotes: state.currentCase.caseNotes,
  isArchived: state.currentCase.details.isArchived,
  fetchingCaseNotes: state.currentCase.fetchingCaseNotes,
  highlightedCaseNote: state.ui.highlightedCaseNote,
  allUsers: state.users.all
});

export default connect(mapStateToProps)(CaseNotes);
