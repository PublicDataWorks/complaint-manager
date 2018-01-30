import SharedSnackbar from '../../sharedComponents/SharedSnackbar'
import {connect} from "react-redux";
import {closeSnackbar} from "../../snackbar/actionCreators";

const mapStateToProps = state => {
    return {
        message: state.cases.update.message,
        success: state.cases.update.success,
        open: state.snackbar.open
    }
}

const mapDispatchToProps = {
    closeSnackbar: closeSnackbar
}

export default connect(mapStateToProps, mapDispatchToProps)(SharedSnackbar)