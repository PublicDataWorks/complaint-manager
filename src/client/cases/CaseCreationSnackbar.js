import CreationSnackbar from '../StyledComponents/CreationSnackbar'
import {connect} from "react-redux";

const mapStateToProps = state => {
    return {
        inProgress: state.cases.creation.inProgress,
        message: state.cases.creation.message,
        caseCreationSuccess: state.cases.creation.success
    }
}

export default connect(mapStateToProps)(CreationSnackbar)