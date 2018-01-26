import {connect} from "react-redux";
import CreationSnackbar from "../../sharedComponents/CreationSnackbar";
import {closeSnackbar} from "../../snackbar/actionCreators";

const mapStateToProps = state => {
    return {
        message: state.users.creation.message,
        creationSuccess: state.users.creation.success,
        open: state.snackbar.open,
    }
}

const mapDispatchToProps = {
    closeSnackbar: closeSnackbar
};

export default connect(mapStateToProps, mapDispatchToProps)(CreationSnackbar)