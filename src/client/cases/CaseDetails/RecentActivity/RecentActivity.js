import React, { Component } from "react";
import ActivityDisplay from "./ActivityDisplay";
import * as _ from "lodash";
import getRecentActivity from "../../thunks/getRecentActivity";
import { Typography } from "material-ui";
import RemoveUserActionDialog from "../RemoveUserActionDialog/RemoveUserActionDialog";
import LinkButton from "../../../shared/components/LinkButton";
import { Link } from "react-router-dom";

class RecentActivity extends Component {
  componentDidMount() {
    this.props.dispatch(getRecentActivity(this.props.caseId));
  }

  render() {
    const { recentActivity, caseId } = this.props;
    return (
      <div style={{ margin: "0px 24px" }}>
        <Typography
          variant={"title"}
          style={{
            marginBottom: "16px"
          }}
        >
          Recent Activity
        </Typography>
        <div
          data-test="recentActivityContainer"
          style={{ paddingBottom: "16px" }}
        >
          {recentActivity.length === 0 ? (
            <Typography variant="body1">
              No case notes have been added
            </Typography>
          ) : (
            _.orderBy(recentActivity, ["actionTakenAt"], "desc").map(
              activity => {
                return (
                  <ActivityDisplay
                    key={activity.id}
                    activity={activity}
                    caseId={caseId}
                    data-test="recentActivityItem"
                  />
                );
              }
            )
          )}
        </div>
        <RemoveUserActionDialog />
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

export default RecentActivity;
