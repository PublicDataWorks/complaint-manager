import React from "react";
import DetailsCard from "../../../shared/components/DetailsCard";
import { CardContent, Typography } from "@material-ui/core";
import styles from "../../../../common/globalStyling/styles";
import DropzoneContainer from "./DropzoneContainer";
import AttachmentsList from "./AttachmentsList";
import { connect } from "react-redux";
import { property } from "lodash";
import { USER_PERMISSIONS } from "../../../../../sharedUtilities/constants";

const Attachments = props => {
  return (
    <DetailsCard title="Attachments">
      <CardContent style={{ paddingBottom: "24px" }}>
        <div style={{ display: "flex" }}>
          <div
            style={{
              flex: 5,
              textAlign: "left",
              marginBottom: "8px"
            }}
          >
            <Typography style={styles.section}>File Name</Typography>
          </div>
          <div style={{ flex: 2, textAlign: "left" }}>
            <Typography style={styles.section}>Description</Typography>
          </div>
          <div style={{ flex: 2 }} />
        </div>
        <AttachmentsList />
        {props.isArchived ||
        !props.permissions?.includes(USER_PERMISSIONS.EDIT_CASE) ? null : (
          <div
            style={{ marginTop: "48px" }}
            data-testid="file-upload-container"
          >
            <div style={{ marginBottom: "8px" }}>
              <Typography style={styles.section}>UPLOAD A FILE</Typography>
            </div>
            <div style={{ marginBottom: "4px" }}>
              <Typography variant="body2">Maximum file size: 5GB</Typography>
            </div>
            <DropzoneContainer />
          </div>
        )}
      </CardContent>
    </DetailsCard>
  );
};

export default connect(state => ({
  permissions: state?.users?.current?.userInfo?.permissions
}))(Attachments);
