import SharedSnackbar from '../../sharedComponents/SharedSnackbar'
import {connect} from "react-redux";
import {closeSnackbar} from "../../snackbar/actionCreators";

const mapStateToProps = state => {
    return {
        message: state.cases.details.message,
        success: state.cases.details.success,
        open: state.ui.snackbar.open
    }
}

const mapDispatchToProps = {
    closeSnackbar: closeSnackbar
}

export default connect(mapStateToProps, mapDispatchToProps)(SharedSnackbar)