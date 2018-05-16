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
import getRecentActivity from "../../thunks/getRecentActivity";

const mapStateToProps = state => ({
  errorMessage: state.ui.attachments.errorMessage,
  caseId: state.currentCase.details.id
});

const mapDispatchToProps = {
  uploadAttachmentSuccess,
  dropDuplicateFile,
  uploadAttachmentFailed,
  removeDropzoneFile,
  getRecentActivity
};

export default connect(mapStateToProps, mapDispatchToProps)(Dropzone);
