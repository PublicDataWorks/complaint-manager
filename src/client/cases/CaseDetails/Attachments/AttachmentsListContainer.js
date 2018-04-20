import {connect} from "react-redux";
import AttachmentsList from './AttachmentsList'
import removeAttachment from "../../thunks/removeAttachment";

const mapStateToProps = state => ({
    caseId: state.currentCase.details.id,
    attachments: state.currentCase.details.attachments
})

const mapDispatchToProps = {
    removeAttachment
}

export default connect(mapStateToProps, mapDispatchToProps)(AttachmentsList)