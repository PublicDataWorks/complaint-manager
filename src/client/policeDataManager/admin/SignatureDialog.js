import React, { Component } from "react";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { connect } from "react-redux";
import axios from "axios";
import getUsers from "../../common/thunks/getUsers";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import moment from "moment";
import {
  SecondaryButton,
  PrimaryButton
} from "../shared/components/StyledButtons";
import { renderTextField } from "../cases/sharedFormComponents/renderFunctions";
import Dropdown from "../../common/components/Dropdown";
import { generateMenuOptions } from "../utilities/generateMenuOptions";
import {
  nameRequired,
  nameNotBlank,
  phoneRequired,
  phoneNotBlank,
  roleRequired,
  roleNotBlank,
  usernameRequired,
  usernameNotBlank,
  isPhoneNumber
} from "../../formFieldLevelValidations";
import {
  snackbarError,
  snackbarSuccess
} from "../actionCreators/snackBarActionCreators";
import { transformAndHandleError } from "../../common/axiosInterceptors/responseErrorInterceptor";
import FileUpload from "../shared/components/FileUpload";
import { getFilteredUserEmails } from "./signature-selectors";
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`);

class SignatureDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attachmentValid: false,
      uploadInProgress: false
    };
  }

  componentDidMount() {
    if (!this.props.users || !this.props.users.length) {
      this.props.getUsers();
    }
  }

  submit = values => {
    if (!this.state.attachmentValid) {
      throw new SubmissionError({ _error: "Signature is required" });
    }

    this.setState({ attachmentValid: true, uploadInProgress: true });
    this.submittedValues = values; // will use these values on complete of upload
    this.dropzone.processQueue();
  };

  onUploadComplete = () => {
    axios
      .post("/api/signers", {
        name: this.submittedValues.name,
        title: this.submittedValues.role,
        nickname: this.submittedValues.signerUsername,
        phone: this.submittedValues.phoneNumber,
        signatureFile: this.fileName
      })
      .then(() => {
        this.props.snackbarSuccess("Signer successfully added");
        this.props.exit(true);
      })
      .catch(err => this.props.snackbarError(err.message));

    this.fileName = null;
    this.submittedValues = null;
  };

  onUploadInit = dropzone => {
    this.dropzone = dropzone;
  };

  onUploadSending = (file, xhr, formData) => {
    this.fileName = `${this.props.name.replace(/\s/gi, ".")}-${moment()
      .utc()
      .format()}.${file.name.split(".").pop()}`;
    formData.append("name", this.fileName);
  };

  onUploadSuccess = (file, response) => {
    this.props.snackbarSuccess("File was successfully uploaded");
    this.dropzone.removeFile(file);
  };

  render() {
    return (
      <Dialog
        open={true}
        classes={{
          paperWidthSm: this.props.classes.paperWidthSm
        }}
      >
        <form onSubmit={this.props.handleSubmit(this.submit)} role="form">
          <DialogTitle>Add Signature</DialogTitle>
          <DialogContent>
            <section
              className="input-section"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "14em"
              }}
            >
              <Field
                component={Dropdown}
                inputProps={{
                  "data-testid": "user"
                }}
                name="signerUsername"
                placeholder="Select a user"
                required
                validate={[usernameRequired, usernameNotBlank]}
                style={{ width: "100%" }}
              >
                {generateMenuOptions(this.props.users)}
              </Field>
              <Field
                component={renderTextField}
                inputProps={{
                  "data-testid": "signerName"
                }}
                name="name"
                placeholder="Name"
                validate={[nameRequired, nameNotBlank]}
              />
              <Field
                component={renderTextField}
                inputProps={{
                  "data-testid": "role"
                }}
                name="role"
                placeholder="Role/title"
                validate={[roleRequired, roleNotBlank]}
              />
              <Field
                component={renderTextField}
                inputProps={{
                  "data-testid": "phoneNumber"
                }}
                name="phoneNumber"
                placeholder="Phone number"
                validate={[phoneRequired, phoneNotBlank, isPhoneNumber]}
              />
            </section>
            <FileUpload
              allowedFileTypes={["image/png", "image/jpeg", "image/gif"]}
              externalErrorMessage={this.props.error}
              maxSize={1000}
              onComplete={this.onUploadComplete.bind(this)}
              onInit={this.onUploadInit.bind(this)}
              onSending={this.onUploadSending.bind(this)}
              onSuccess={this.onUploadSuccess.bind(this)}
              postUrl={`${
                config[process.env.REACT_APP_ENV].backendUrl
              }/api/signatures`}
              setAttachmentValid={attachmentValid =>
                this.setState({ attachmentValid })
              }
              setUploadInProgress={uploadInProgress =>
                this.setState({ uploadInProgress })
              }
              uploadText="Upload Signature"
            />
          </DialogContent>
          <DialogActions>
            <SecondaryButton onClick={this.props.exit}>Cancel</SecondaryButton>
            <PrimaryButton data-testid="saveButton">Save</PrimaryButton>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, props) => ({
  users: getFilteredUserEmails(state, props),
  name: state.form.signerForm?.values?.name
});

export default connect(mapStateToProps, {
  getUsers,
  snackbarSuccess,
  snackbarError,
  transformAndHandleError
})(reduxForm({ form: "signerForm" })(SignatureDialog));
