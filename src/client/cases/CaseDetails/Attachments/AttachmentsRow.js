import React from "react";
import { Divider, Typography } from "@material-ui/core";
import styles from "../../../globalStyling/styles";
import LinkButton from "../../../shared/components/LinkButton";
import inBrowserDownload from "../../thunks/inBrowserDownload";
import { connect } from "react-redux";

const AttachmentsRow = ({
  attachment,
  onRemoveAttachment,
  dispatch,
  isArchived
}) => {
  const onDownloadClick = () =>
    dispatch(
      inBrowserDownload(
        `/api/cases/${attachment.caseId}/attachmentUrls/${attachment.fileName}`,
        `attachment-${attachment.id}-DownloadLink`
      )
    );

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
          <a
            href="#dynamicLink"
            id={`attachment-${attachment.id}-DownloadLink`}
          >
            {" "}
          </a>
          <Typography
            data-test="attachmentName"
            style={{
              ...styles.link,
              cursor: "pointer"
            }}
            onClick={onDownloadClick}
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
          {isArchived ? null : (
            <LinkButton
              data-test={"removeAttachmentButton"}
              onClick={() => {
                onRemoveAttachment(attachment.id, attachment.fileName);
              }}
            >
              Remove
            </LinkButton>
          )}
        </div>
      </div>
      <Divider style={{ marginBottom: "8px" }} />
    </div>
  );
};

const mapStateToProps = state => ({
  isArchived: state.currentCase.details.isArchived
});

export default connect(mapStateToProps)(AttachmentsRow);
