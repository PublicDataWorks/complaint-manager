import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import moment from "moment";
import ActivityMenu from "./ActivityMenu";
import TextTruncate from "../../../shared/components/TextTruncate";
import _ from "lodash";
import { getMentionedUsers } from "../CaseNoteDialog/userMentionHelperFunctions";

const ActivityDisplay = ({
  caseId,
  activity,
  highlightedCaseNote,
  allUsers
}) => {
  const author = activity.author.name
    ? activity.author.name
    : "[" + activity.author.email + "]";

  const TIMESTAMP_FORMAT = "MMM D, YYYY h:mm A";

  const splitTextToDict = (mentionedUsers, activityNotes) => {
    let notesDict = {};

    if (_.isEmpty(mentionedUsers)) {
      notesDict["t0"] = `${activityNotes}`;
      return notesDict;
    } else {
      for (let i = 0; i < mentionedUsers.length; i++) {
        let lowerCaseActivityNotes = activityNotes.toLowerCase();
        let lowerCaseMentionedUser = mentionedUsers[i].label.toLowerCase();

        if (lowerCaseActivityNotes.includes(`@${lowerCaseMentionedUser}`)) {
          let startIndex = lowerCaseActivityNotes.indexOf(
            `@${lowerCaseMentionedUser}`
          );

          const beforeMention = activityNotes.substring(0, startIndex);
          notesDict[`t${i}`] = `${beforeMention}`;

          const actualMention = activityNotes.substring(
            startIndex,
            startIndex + `@${lowerCaseMentionedUser}`.length
          );
          notesDict[`m${i}`] = `${actualMention}`;

          activityNotes = activityNotes.substring(
            startIndex + `@${mentionedUsers[i].label}`.length
          );
        }
      }
      notesDict["tEnd"] = activityNotes;
      return notesDict;
    }
  };

  const notesWithBoldMentions = notesDict => {
    return (
      <Typography
        variant="body2"
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        data-testid={"notesText"}
      >
        {Object.keys(notesDict).map(key => {
          return key.includes("m") ? (
            <b key={key}>{notesDict[key]}</b>
          ) : (
            <span key={key}>{notesDict[key]}</span>
          );
        })}
      </Typography>
    );
  };

  const getActivityNotes = notes => {
    const mentionedUsers = getMentionedUsers(allUsers, notes);
    const notesDict = splitTextToDict(mentionedUsers, notes);

    return notesWithBoldMentions(notesDict);
  };

  return (
    <Card
      key={activity.id}
      style={{
        marginBottom: "16px",
        backgroundColor: "white",
        display: "flex"
      }}
      elevation={5}
    >
      {highlightedCaseNote && highlightedCaseNote.caseNoteId === activity.id ? (
        <CardContent
          style={{
            minWidth: 10,
            backgroundColor: "#D32F2F",
            width: "100%",
            padding: 0
          }}
        />
      ) : null}
      <CardContent
        style={{
          width: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <div>
            <Typography
              data-testid="userAndActionText"
              style={{ marginBottom: "2px", wordBreak: "break-word" }}
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
                <TextTruncate
                  testLabel="notesText"
                  message={activity.notes ? activity.notes : "N/A"}
                  getActivityNotes={getActivityNotes}
                />
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
