import React, { Component } from "react";
import DropzoneComponent from "react-dropzone-component";
import "../../../../../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../../../../../node_modules/dropzone/dist/min/dropzone.min.css";
import getAccessToken from "../../../../common/auth/getAccessToken";
import {
  DUPLICATE_FILE_NAME,
  UPLOAD_CANCELED
} from "../../../../../sharedUtilities/constants";
import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel
} from "@material-ui/core";
import { PrimaryButton } from "../../../shared/components/StyledButtons";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`);

class Dropzone extends Component {
  componentDidMount() {
    this.props.removeDropzoneFile();
  }

  state = {
    attachmentValid: false,
    attachmentDescription: "",
    touched: false,
    uploadInProgress: false
  };

  dropZoneComponentConfig = {
    postUrl: `${config[process.env.REACT_APP_ENV].backendUrl}/api/cases/${
      this.props.caseId
    }/attachments`
  };

  eventHandlers = {
    init: dropzone => {
      this.dropzone = dropzone;
    },
    addedfile: () => {
      this.setState({ attachmentValid: true });
    },
    success: async (file, response) => {
      this.props.snackbarSuccess("File was successfully attached");
      this.props.uploadAttachmentSuccess(response);
      this.dropzone.removeFile(file);
      this.setState({ attachmentDescription: "", touched: false });
      await this.props.getCaseNotes(this.props.caseId);
    },
    error: (file, error, xhr) => {
      this.setState({ attachmentValid: false });
      this.hideDropzoneErrorPopup();

      const { status } = xhr || {};

      const errorMessage = this.parseDropzoneError(error, status);

      switch (errorMessage) {
        case DUPLICATE_FILE_NAME:
          this.props.dropDuplicateFile();
          break;
        case UPLOAD_CANCELED:
          break;
        default:
          this.props.transformAndHandleError(
            errorMessage,
            this.props.caseId,
            xhr.status,
            `/cases/${this.props.caseId}`
          );
      }
    },
    complete: file => {
      this.setState({ uploadInProgress: false });
    },
    removedfile: file => {
      this.props.removeDropzoneFile();
      this.setState({ attachmentValid: false });
    },
    sending: (file, xhr, formData) => {
      formData.append("description", this.state.attachmentDescription);
    }
  };

  parseDropzoneError = (errorMessage, responseStatus) => {
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

  djsconfig = {
    addRemoveLinks: true,
    autoProcessQueue: false,
    maxFiles: 1,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`
    },
    dictUploadCanceled: UPLOAD_CANCELED,
    dictDefaultMessage: "Drag and drop or click",
    maxFilesize: 5000,
    timeout: Infinity,
    useFsAccessApi: false
  };

  uploadAttachment = () => {
    this.setState({ attachmentValid: true, uploadInProgress: true });
    this.dropzone.processQueue();
  };

  updateDescription = event => {
    this.setState({ attachmentDescription: event.target.value, touched: true });
  };

  invalidDescription = () => {
    return !Boolean(this.state.attachmentDescription);
  };

  hideDropzoneErrorPopup = () => {
    document.getElementsByClassName("dz-error-message")[0].style.display =
      "none";
  };

  render() {
    return (
      <div style={{ display: "flex", width: "100%" }}>
        <div style={{ flex: 1, marginRight: "10px", marginBottom: "0px" }}>
          <DropzoneComponent
            config={this.dropZoneComponentConfig}
            djsConfig={this.djsconfig}
            eventHandlers={this.eventHandlers}
          />
          {this.invalidFileMarkup(this.props.errorMessage)}
        </div>
        <div style={{ flex: 1, alignSelf: "flex-end", marginRight: "10px" }}>
          <FormControl
            required
            fullWidth={true}
            error={this.state.touched && this.invalidDescription()}
          >
            <InputLabel htmlFor="attachmentDescription" shrink={true}>
              Description of File
            </InputLabel>
            <Input
              id="fileAttachmentDescription"
              value={this.state.attachmentDescription}
              multiline
              maxRows={3}
              inputProps={{
                maxLength: 200,
                "data-testid": "attachmentDescriptionInput"
              }}
              placeholder={"Please enter a description for your attachment"}
              onChange={this.updateDescription}
              onBlur={() => {
                this.setState({ touched: true });
              }}
            />

            <FormHelperText id="attachmentDescription">
              {this.state.touched && this.invalidDescription()
                ? "Please enter a valid description"
                : ""}
            </FormHelperText>
          </FormControl>
        </div>
        <div style={{ alignSelf: "flex-end", marginBottom: "20px" }}>
          <PrimaryButton
            onClick={this.uploadAttachment}
            data-testid="attachmentUploadButton"
            disabled={
              !this.state.attachmentValid ||
              this.invalidDescription() ||
              this.state.uploadInProgress
            }
          >
            Upload
          </PrimaryButton>
        </div>
      </div>
    );
  }

  invalidFileMarkup(errorMessage) {
    return (
      <FormHelperText data-testid="invalidFileTypeErrorMessage" error={true}>
        {errorMessage}
      </FormHelperText>
    );
  }
}

export default Dropzone;
