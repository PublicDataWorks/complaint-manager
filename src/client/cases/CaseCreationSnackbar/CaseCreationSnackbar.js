import CreationSnackbar from '../../sharedComponents/CreationSnackbar'
import {connect} from "react-redux";
import {closeSnackbar} from "../../snackbar/actionCreators";

const mapStateToProps = state => {
    return {
        message: state.cases.creation.message,
        creationSuccess: state.cases.creation.success,
        open: state.snackbar.open
    }
}

const mapDispatchToProps = {
    closeSnackbar: closeSnackbar
}

export default connect(mapStateToProps, mapDispatchToProps)(CreationSnackbar)