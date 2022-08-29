import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import axios from "axios";
import Dropdown from "../../../common/components/Dropdown";
import { generateMenuOptions } from "../../utilities/generateMenuOptions";
import {
  usernameRequired,
  usernameNotBlank
} from "../../../formFieldLevelValidations";
import SignatureDialog from "./SignatureDialog";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import { transformAndHandleError } from "../../../common/axiosInterceptors/responseErrorInterceptor";

class UpdateSignatureDialog extends SignatureDialog {
  submit = values => {
    this.setState({ uploadInProgress: true });
    this.submittedValues = values; // will use these values on complete of upload
    if (this.state.attachmentValid) {
      this.dropzone.processQueue();
    } else {
      this.onUploadComplete();
    }
  };

  onUploadComplete = () => {
    axios
      .put(`/api/signers/${this.props.signer.id}`, {
        name: this.submittedValues.name,
        title: this.submittedValues.role,
        nickname: this.submittedValues.signerUsername,
        phone: this.submittedValues.phoneNumber,
        signatureFile: this.fileName
      })
      .then(() => {
        this.props.snackbarSuccess("Signer successfully updated");
        this.props.exit(true);
      })
      .catch(err => this.props.snackbarError(err.message));
    this.fileName = null;
    this.submittedValues = null;
  };

  renderUsernameField() {
    return (
      <Field
        component={Dropdown}
        inputProps={{
          "data-testid": "user",
          disabled: true
        }}
        name="signerUsername"
        placeholder="Select a user"
        required
        validate={[usernameRequired, usernameNotBlank]}
        style={{ width: "100%" }}
      >
        {generateMenuOptions([this.props.signer.nickname])}
      </Field>
    );
  }
}

export default connect(
  (state, props) => ({
    name: state.form.updateSignatureForm?.values?.name,
    initialValues: {
      name: props.signer.name,
      role: props.signer.title,
      phoneNumber: props.signer.phone,
      signerUsername: props.signer.nickname
    }
  }),
  {
    snackbarSuccess,
    snackbarError,
    transformAndHandleError
  }
)(reduxForm({ form: "updateSignatureForm" })(UpdateSignatureDialog));
