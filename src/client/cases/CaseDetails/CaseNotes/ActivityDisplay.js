import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import moment from "moment";
import ActivityMenu from "./ActivityMenu";
import TextTruncate from "../../../shared/components/TextTruncate";

const ActivityDisplay = ({ caseId, activity, shouldTruncate = true }) => {
  return (
    <Card
      key={activity.id}
      style={{
        marginBottom: "16px",
        backgroundColor: "white"
      }}
      elevation={5}
    >
      <CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <div>
            <Typography
              data-test="userAndActionText"
              style={{ marginBottom: "2px" }}
            >
              <strong>[{activity.user}]</strong> {activity.action}
            </Typography>
            <Typography variant={"caption"} data-test="activityTimeText">
              {`${moment(
                activity.actionTakenAt,
                "YYYY-MM-DDTHH:mm:ssZ"
              ).fromNow()}`}
            </Typography>
            <div
              style={{
                marginTop: "16px"
              }}
            >
              {activity.notes ? (
                shouldTruncate ? (
                  <TextTruncate
                    testLabel="notesText"
                    message={activity.notes ? activity.notes : "N/A"}
                  />
                ) : (
                  <Typography data-test="notesText">
                    {activity.notes}
                  </Typography>
                )
              ) : (
                ""
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignSelf: "flex-center"
            }}
          >
            <ActivityMenu activity={activity} caseId={caseId} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityDisplay;
