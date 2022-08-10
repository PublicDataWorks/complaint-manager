import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FormHelperText, Typography } from "@material-ui/core";
import { DropzoneComponent } from "react-dropzone-component";
import {
  DUPLICATE_FILE_NAME,
  UPLOAD_CANCELED
} from "../../../../sharedUtilities/constants";
import getAccessToken from "../../../common/auth/getAccessToken";
import styles from "../../../common/globalStyling/styles";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";

const parseDropzoneError = (errorMessage, responseStatus) => {
  if (responseStatus === 503) {
    return "Something went wrong and the file was not attached";
  }
  if (errorMessage.isBoom) {
    return errorMessage.output.payload.message;
  }
  if (errorMessage.message) {
    return errorMessage.message;
  }
  return errorMessage;
};

const FileUpload = props => {
  const [errorMessage, setErrorMessage] = useState("");

  const maxSizeString = useMemo(() => {
    let formattedNumber, units;
    if (props.maxSize >= 1000) {
      units = "GB";
      if (props.maxSize % 1000) {
        formattedNumber = (props.maxSize / 1000).toFixed(1);
      } else {
        formattedNumber = props.maxSize / 1000 + "";
      }
    } else {
      units = "MB";
      if (props.maxSize % 1) {
        formattedNumber = props.maxSize.toFixed(1);
      } else {
        formattedNumber = props.maxSize + "";
      }
    }

    return `${formattedNumber}${units}`;
  }, [props.maxSize]);

  let finalErrorMessage = props.externalErrorMessage;
  if (errorMessage !== "") {
    finalErrorMessage = errorMessage;
  }

  return (
    <>
      <div style={{ marginTop: "30px" }} data-testid="file-upload-container">
        <div style={{ marginBottom: "8px" }}>
          <Typography style={styles.section}>{props.uploadText}</Typography>
        </div>
        <div style={{ marginBottom: "4px" }}>
          <Typography variant="body2">
            Max file size: {maxSizeString}
            {props.allowedFileTypes
              ? `, Accepted file types:
            ${props.allowedFileTypes.reduce((acc, type) => {
      const formattedType = type.split("/").pop();
      return acc === "" ? formattedType : `${acc}, ${formattedType}`;
    }, "")}`
              : ""}
          </Typography>
        </div>
      </div>
      <div style={{ display: "flex", width: "100%" }}>
        <div style={{ flex: 1, marginRight: "10px", marginBottom: "0px" }}>
          <DropzoneComponent
            config={{
              postUrl: props.postUrl
            }}
            djsConfig={{
              addRemoveLinks: true,
              autoProcessQueue: false,
              maxFiles: 1,
              headers: {
                Authorization: `Bearer ${getAccessToken()}`
              },
              dictUploadCanceled: UPLOAD_CANCELED,
              dictDefaultMessage: "Drag and drop or click",
              maxFilesize: props.maxSize,
              timeout: Infinity,
              acceptedFiles: props.allowedFileTypes
                ? props.allowedFileTypes.reduce(
                  (acc, type) => (acc ? `${acc}, ${type}` : type),
                  ""
                )
                : null
            }}
            eventHandlers={{
              init: props.onInit,
              addedfile: () => props.setAttachmentValid(true),
              success: (file, response) => {
                if (props.onSuccess) {
                  props.onSuccess(file, response);
                } else {
                  props.snackbarSuccess("File was successfully uploaded");
                }
              },
              error: (file, error, xhr) => {
                props.setAttachmentValid(false);
                document.getElementsByClassName(
                  "dz-error-message"
                )[0].style.display = "none";

                const { status } = xhr || {};

                const errorMsg = parseDropzoneError(error, status);

                switch (errorMsg) {
                  case DUPLICATE_FILE_NAME:
                    setErrorMessage("File name already exists");
                    break;
                  case UPLOAD_CANCELED:
                    break;
                  default:
                    props.snackbarError(errorMsg);
                }
              },
              complete: file => {
                props.setUploadInProgress(false);
                if (props.onComplete) {
                  props.onComplete(file);
                }
              },
              removedFile: file => {
                setErrorMessage("");
                props.setAttachmentValid(false);
              },
              sending: props.onSending
            }}
          />
          <FormHelperText error={true}>{finalErrorMessage}</FormHelperText>
        </div>
      </div>
    </>
  );
};

FileUpload.propTypes = {
  allowedFileTypes: PropTypes.arrayOf(PropTypes.string),
  externalErrorMessage: PropTypes.string,
  maxSize: PropTypes.number.isRequired,
  onComplete: PropTypes.func,
  onInit: PropTypes.func.isRequired,
  onSending: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  postUrl: PropTypes.string.isRequired,
  setAttachmentValid: PropTypes.func.isRequired,
  setUploadInProgress: PropTypes.func.isRequired,
  snackbarError: PropTypes.func.isRequired,
  snackbarSuccess: PropTypes.func.isRequired,
  uploadText: PropTypes.string.isRequired
};

export default connect(undefined, { snackbarSuccess, snackbarError })(
  FileUpload
);
