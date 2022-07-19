import { connect } from "react-redux";
import axios from "axios";
import SignatureDialog from "./SignatureDialog";
import { getFilteredUserEmails } from "./signature-selectors";
import { reduxForm, SubmissionError } from "redux-form";
import getUsers from "../../common/thunks/getUsers";
import {
  snackbarError,
  snackbarSuccess
} from "../actionCreators/snackBarActionCreators";
import { transformAndHandleError } from "../../common/axiosInterceptors/responseErrorInterceptor";

class AddSignatureDialog extends SignatureDialog {
  componentDidMount() {
    if (!this.props.users || !this.props.users?.length) {
      this.props.getUsers();
    }
  }

  submit = values => {
    if (!this.state.attachmentValid) {
      throw new SubmissionError({ _error: "Signature is required" });
    }

    this.setState({ uploadInProgress: true });
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
}

export default connect(
  (state, props) => ({
    name: state.form.signerForm?.values?.name,
    users: getFilteredUserEmails(state, props)
  }),
  {
    getUsers,
    snackbarSuccess,
    snackbarError,
    transformAndHandleError
  }
)(reduxForm({ form: "signerForm" })(AddSignatureDialog));
