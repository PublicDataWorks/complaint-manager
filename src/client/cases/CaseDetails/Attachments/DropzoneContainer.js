import { connect } from "react-redux";
import Dropzone from "./Dropzone";
import {
  uploadAttachmentFailed,
  uploadAttachmentSuccess
} from "../../../actionCreators/casesActionCreators";
import {
  dropDuplicateFile,
  removeDropzoneFile
} from "../../../actionCreators/attachmentsActionCreators";
import getCaseNotes from "../../thunks/getCaseNotes";

const mapStateToProps = state => ({
  errorMessage: state.ui.attachments.errorMessage,
  caseId: state.currentCase.details.id
});

const mapDispatchToProps = {
  uploadAttachmentSuccess,
  dropDuplicateFile,
  uploadAttachmentFailed,
  removeDropzoneFile,
  getCaseNotes
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dropzone);
