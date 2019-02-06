import React from "react";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import { CardContent, Typography } from "@material-ui/core";
import styles from "../../../globalStyling/styles";
import DropzoneContainer from "./DropzoneContainer";
import AttachmentsList from "./AttachmentsList";

const Attachments = props => {
  return (
    <BaseCaseDetailsCard title="Attachments">
      <CardContent style={{ paddingBottom: "24px" }}>
        <div style={{ display: "flex", width: "100%" }}>
          <div
            style={{
              flex: 1,
              textAlign: "left",
              marginRight: "32px",
              marginBottom: "8px"
            }}
          >
            <Typography style={styles.section}>File Name</Typography>
          </div>
          <div style={{ flex: 1, textAlign: "left", marginRight: "112px" }}>
            <Typography style={styles.section}>Description</Typography>
          </div>
        </div>
        <AttachmentsList />
        {props.isArchived ? null : (
          <div style={{ marginTop: "48px" }}>
            <div style={{ marginBottom: "8px" }}>
              <Typography style={styles.section}>UPLOAD A FILE</Typography>
            </div>
            <div style={{ marginBottom: "4px" }}>
              <Typography variant="body1">Maximum file size: 5GB</Typography>
            </div>
            <DropzoneContainer />
          </div>
        )}
      </CardContent>
    </BaseCaseDetailsCard>
  );
};

export default Attachments;
