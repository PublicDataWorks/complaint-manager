import {connect} from "react-redux";
import CreationSnackbar from "../../sharedComponents/CreationSnackbar";
import {closeUserSnackbar} from "../actionCreators";

const mapStateToProps = state => {
    return {
        message: state.users.creation.message,
        creationSuccess: state.users.creation.success,
        open: state.users.snackbar.open,
    }
}

const mapDispatchToProps = {
    closeSnackbar: closeUserSnackbar
};

export default connect(mapStateToProps, mapDispatchToProps)(CreationSnackbar)