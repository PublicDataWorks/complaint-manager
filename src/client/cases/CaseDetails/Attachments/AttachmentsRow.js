import React from "react";
import { Divider, Typography } from "@material-ui/core";
import styles from "../../../globalStyling/styles";
import LinkButton from "../../../shared/components/LinkButton";
import inBrowserDownload from "../../thunks/inBrowserDownload";
import { connect } from "react-redux";

const AttachmentsRow = ({ attachment, onRemoveAttachment, dispatch }) => {
  return (
    <div>
      <div
        key={attachment.id}
        style={{
          display: "flex",
          width: "100%",
          marginBottom: "8px",
          wordBreak: "break-word"
        }}
        data-test="attachmentRow"
      >
        <div style={{ flex: 1, textAlign: "left", marginRight: "32px" }}>
          <a id={"attachment_" + attachment.id} />
          <Typography
            data-test="attachmentName"
            style={{
              ...styles.link,
              cursor: "pointer"
            }}
            onClick={() =>
              dispatch(
                inBrowserDownload(
                  `/api/cases/${attachment.caseId}/attachmentUrls/${
                    attachment.fileName
                  }`,
                  document.getElementById(`attachment_${attachment.id}`)
                )
              )
            }
          >
            {attachment.fileName}
          </Typography>
        </div>
        <div style={{ flex: 1, textAlign: "left", marginRight: "16px" }}>
          <Typography variant="body1" data-test="attachmentDescription">
            {attachment.description}
          </Typography>
        </div>
        <div>
          <LinkButton
            data-test={"removeAttachmentButton"}
            onClick={() => {
              onRemoveAttachment(attachment.id, attachment.fileName);
            }}
          >
            Remove
          </LinkButton>
        </div>
      </div>
      <Divider style={{ marginBottom: "8px" }} />
    </div>
  );
};

export default connect()(AttachmentsRow);
