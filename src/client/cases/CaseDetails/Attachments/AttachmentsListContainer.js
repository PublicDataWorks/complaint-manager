import {connect} from "react-redux";
import AttachmentsList from './AttachmentsList'

const mapStateToProps = state => ({
    attachments: state.currentCase.attachments
})

export default connect(mapStateToProps)(AttachmentsList)