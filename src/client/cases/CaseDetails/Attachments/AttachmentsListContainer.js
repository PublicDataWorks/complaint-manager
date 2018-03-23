import {connect} from "react-redux";
import AttachmentsList from './AttachmentsList'
import removeAttachment from "../../thunks/removeAttachment";

const mapStateToProps = state => ({
    caseId: state.currentCase.id,
    attachments: state.currentCase.attachments
})

const mapDispatchToProps = {
    removeAttachment
}

export default connect(mapStateToProps, mapDispatchToProps)(AttachmentsList)