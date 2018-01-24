import CreationSnackbar from '../../sharedComponents/CreationSnackbar'
import {connect} from "react-redux";
import {closeCaseSnackbar} from "../actionCreators";

const mapStateToProps = state => {
    return {
        message: state.cases.creation.message,
        creationSuccess: state.cases.creation.success,
        open: state.cases.snackbar.open
    }
}

const mapDispatchToProps = {
    closeSnackbar: closeCaseSnackbar
}

export default connect(mapStateToProps, mapDispatchToProps)(CreationSnackbar)