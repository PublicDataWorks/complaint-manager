import {connect} from "react-redux";
import Dropzone from "./Dropzone";
import {uploadAttachmentFailed, uploadAttachmentSuccess} from "../../../actionCreators/casesActionCreators";
import {dropDuplicateFile, removeDropzoneFile} from "../../../actionCreators/attachmentsActionCreators";

const mapStateToProps = (state) => ({
    errorMessage: state.ui.attachments.errorMessage,
    caseId: state.currentCase.id
})

const mapDispatchToProps = {
    uploadAttachmentSuccess,
    dropDuplicateFile,
    uploadAttachmentFailed,
    removeDropzoneFile
}

export default connect(mapStateToProps, mapDispatchToProps)(Dropzone)