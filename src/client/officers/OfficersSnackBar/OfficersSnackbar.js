import SharedSnackbar from "../../sharedComponents/SharedSnackbar";
import { connect } from "react-redux";
import { closeSnackbar } from "../../actionCreators/snackBarActionCreators";

const mapStateToProps = state => {
  return {
    message: state.ui.snackbar.message,
    success: state.ui.snackbar.success,
    open: state.ui.snackbar.open
  };
};

const mapDispatchToProps = {
  closeSnackbar: closeSnackbar
};

export default connect(mapStateToProps, mapDispatchToProps)(SharedSnackbar);
