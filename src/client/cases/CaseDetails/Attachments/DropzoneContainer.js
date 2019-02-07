import { connect } from "react-redux";
import Dropzone from "./Dropzone";
import { uploadAttachmentSuccess } from "../../../actionCreators/casesActionCreators";
import {
  dropDuplicateFile,
  removeDropzoneFile
} from "../../../actionCreators/attachmentsActionCreators";
import getCaseNotes from "../../thunks/getCaseNotes";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";

const mapStateToProps = state => ({
  errorMessage: state.ui.attachments.errorMessage,
  caseId: state.currentCase.details.id
});

const mapDispatchToProps = {
  snackbarSuccess,
  snackbarError,
  uploadAttachmentSuccess,
  dropDuplicateFile,
  removeDropzoneFile,
  getCaseNotes
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dropzone);
