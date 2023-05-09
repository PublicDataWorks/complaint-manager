import React, { Component } from "react";
import { Field } from "redux-form";
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
} from "../../shared/components/StyledButtons";
import { renderTextField } from "../../cases/sharedFormComponents/renderFunctions";
import Dropdown from "../../../common/components/Dropdown";
import { generateMenuOptions } from "../../utilities/generateMenuOptions";
import {
  nameRequired,
  nameNotBlank,
  phoneRequired,
  phoneNotBlank,
  roleRequired,
  roleNotBlank,
  usernameRequired,
  usernameNotBlank,
  isPhoneNumber,
  characterLimit100
} from "../../../formFieldLevelValidations";
import FileUpload from "../../shared/components/FileUpload";
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`);

class SignatureDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attachmentValid: false,
      uploadInProgress: false
    };
  }

  onUploadInit = dropzone => {
    this.dropzone = dropzone;
  };

  onUploadSending = (file, xhr, formData) => {
    let type = file.name.split(".").pop();
    this.fileName = `${this.props.name.replace(/\s/gi, ".")}-${moment()
      .utc()
      .valueOf()}.${type}`;
    formData.append("name", this.fileName);
    formData.append("type", `image/${type}`);
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
              {this.renderUsernameField()}
              <Field
                component={renderTextField}
                inputProps={{
                  "data-testid": "signerName"
                }}
                name="name"
                placeholder="Name"
                validate={[nameRequired, nameNotBlank, characterLimit100]}
              />
              <Field
                component={renderTextField}
                inputProps={{
                  "data-testid": "role"
                }}
                name="role"
                placeholder="Role/title"
                validate={[roleRequired, roleNotBlank, characterLimit100]}
              />
              <Field
                component={renderTextField}
                inputProps={{
                  "data-testid": "phoneNumber"
                }}
                name="phoneNumber"
                placeholder="Phone number"
                validate={[isPhoneNumber]}
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

  renderUsernameField() {
    return (
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
    );
  }
}

export default SignatureDialog;
