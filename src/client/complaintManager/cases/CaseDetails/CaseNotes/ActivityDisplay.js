import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import moment from "moment";
import ActivityMenu from "./ActivityMenu";
import TextTruncate from "../../../shared/components/TextTruncate";

const ActivityDisplay = ({ caseId, activity, shouldTruncate = true }) => {
  const author = activity.author.name
    ? activity.author.name
    : "[" + activity.author.email + "]";

  const TIMESTAMP_FORMAT = "MMM D, YYYY h:mm A";
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
              data-testid="userAndActionText"
              style={{ marginBottom: "2px" }}
            >
              <strong>{author}</strong>{" "}
              {activity.caseNoteAction && activity.caseNoteAction.name}
            </Typography>
            <Typography variant={"caption"} data-testid="activityTimeText">
              {`${moment(activity.actionTakenAt, "YYYY-MM-DDTHH:mm:ssZ").format(
                TIMESTAMP_FORMAT
              )}`}
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
                  <Typography data-testid="notesText">
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
