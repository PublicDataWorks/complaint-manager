import {connect} from "react-redux";
import CreationSnackbar from "../../sharedComponents/CreationSnackbar";

const mapStateToProps = state => {
    return {
        inProgress: state.users.creation.inProgress,
        message: state.users.creation.message,
        creationSuccess: state.users.creation.success
    }
}

export default connect(mapStateToProps)(CreationSnackbar)