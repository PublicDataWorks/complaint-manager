import CreationSnackbar from '../../sharedComponents/CreationSnackbar'
import {connect} from "react-redux";

const mapStateToProps = state => {
    return {
        inProgress: state.cases.creation.inProgress,
        message: state.cases.creation.message,
        creationSuccess: state.cases.creation.success
    }
}

export default connect(mapStateToProps)(CreationSnackbar)