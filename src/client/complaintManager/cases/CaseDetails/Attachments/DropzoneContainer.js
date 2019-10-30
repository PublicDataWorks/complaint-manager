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
import { transformAndHandleError } from "../../../../common/axiosInterceptors/responseErrorInterceptor";

const mapStateToProps = state => ({
  errorMessage: state.ui.attachments.errorMessage,
  caseId: state.currentCase.details.id
});

const mapDispatchToProps = dispatch => ({
  snackbarSuccess: message => dispatch(snackbarSuccess(message)),
  snackbarError: message => dispatch(snackbarError(message)),
  uploadAttachmentSuccess: response =>
    dispatch(uploadAttachmentSuccess(response)),
  dropDuplicateFile: () => dispatch(dropDuplicateFile()),
  removeDropzoneFile: () => dispatch(removeDropzoneFile()),
  getCaseNotes: caseId => dispatch(getCaseNotes(caseId)),
  transformAndHandleError: (
    errorMessage,
    caseId,
    statusCode,
    defaultRedirectUrl = null
  ) =>
    transformAndHandleError(
      errorMessage,
      caseId,
      statusCode,
      dispatch,
      defaultRedirectUrl
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dropzone);
