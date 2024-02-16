import React, { Component } from "react";
import ActivityDisplay from "./ActivityDisplay";
import * as _ from "lodash";
import getCaseNotes from "../../thunks/getCaseNotes";
import { Typography } from "@material-ui/core";
import RemoveCaseNoteDialog from "../RemoveCaseNoteDialog/RemoveCaseNoteDialog";
import LinkButton from "../../../shared/components/LinkButton";
import { Link } from "react-router-dom";
import { getCaseNotesSuccess } from "../../../actionCreators/casesActionCreators";
import timezone from "moment-timezone";
import { initialize } from "redux-form";
import { connect } from "react-redux";
import { generateMenuOptions } from "../../../utilities/generateMenuOptions";
import { userTimezone } from "../../../../common/helpers/userTimezone";
import { USER_PERMISSIONS } from "../../../../../sharedUtilities/constants";
import CaseNoteDialog from "../CaseNoteDialog/CaseNoteDialog";

class CaseNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      caseNoteDialogOpen: false
    };
  }

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
            {this.props.permissions?.includes(
              USER_PERMISSIONS.VIEW_CASE_HISTORY
            ) && (
              <LinkButton
                className="view-case-history-button"
                component={Link}
                to={`/cases/${this.props.caseId}/history`}
                style={{ textAlign: "right", marginBottom: "16px" }}
              >
                View Case History
              </LinkButton>
            )}
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
                    activity={{
                      ...activity,
                      caseNoteActionId: {
                        value: activity.caseNoteActionId,
                        label: activity.caseNoteAction?.name
                      }
                    }}
                    caseId={caseId}
                    highlightedCaseNote={this.props.highlightedCaseNote}
                    allUsers={generateMenuOptions(mappedUsers)}
                    data-testid="caseNotesItem"
                  />
                );
              })
            )}
          </div>
          <CaseNoteDialog
            open={this.state.caseNoteDialogOpen}
            closeDialog={() => this.setState({ caseNoteDialogOpen: false })}
            dialogType="Add"
          />
          <RemoveCaseNoteDialog />
        </div>
        {this.props.permissions?.includes(
          USER_PERMISSIONS.CREATE_CASE_NOTE
        ) && (
          <LinkButton
            onClick={() => {
              this.props.dispatch(
                initialize("CaseNotes", {
                  actionTakenAt: timezone
                    .tz(new Date(Date.now()), userTimezone)
                    .format("YYYY-MM-DDTHH:mm")
                })
              );
              this.setState({ caseNoteDialogOpen: true });
            }}
            style={{ margin: "0% 0% 5% 2%" }}
            data-testid="addCaseNoteButton"
          >
            + Add Case Note
          </LinkButton>
        )}
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
  allUsers: state.users.all,
  permissions: state?.users?.current?.userInfo?.permissions
});

export default connect(mapStateToProps)(CaseNotes);
