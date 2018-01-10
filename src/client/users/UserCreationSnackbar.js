import {connect} from "react-redux";
import CreationSnackbar from "../StyledComponents/CreationSnackbar";

const mapStateToProps = state => {
    return {
        inProgress: state.users.creation.inProgress,
        message: state.users.creation.message,
        caseCreationSuccess: state.users.creation.success
    }
}

export default connect(mapStateToProps)(CreationSnackbar)