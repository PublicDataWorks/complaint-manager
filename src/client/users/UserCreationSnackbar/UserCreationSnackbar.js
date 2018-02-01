import {connect} from "react-redux";
import SharedSnackbar from "../../sharedComponents/SharedSnackbar";
import {closeSnackbar} from "../../snackbar/actionCreators";

const mapStateToProps = state => {
    return {
        message: state.users.creation.message,
        success: state.users.creation.success,
        open: state.ui.snackbar.open,
    }
}

const mapDispatchToProps = {
    closeSnackbar: closeSnackbar
};

export default connect(mapStateToProps, mapDispatchToProps)(SharedSnackbar)