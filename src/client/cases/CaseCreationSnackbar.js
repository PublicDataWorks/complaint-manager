import React from 'react'
import {IconButton, Snackbar, withStyles, withTheme} from 'material-ui'
import CloseIcon from 'material-ui-icons/Close'
import { connect } from 'react-redux'
import colors from "../globalStyling/colors";

const styleSheet = {
  error: {
    background: colors.error[500]
  },
  success: {
    background: colors.green
  }
};

class CaseCreationSnackbar extends React.Component {
    state = {
        snackbarOpen: false
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.inProgress && !nextProps.inProgress) {
            this.openSnackbar()
        }
    }

    openSnackbar = () => {
        this.setState({ snackbarOpen: true })
    }

    closeSnackbar = () => {
        this.setState({ snackbarOpen: false })
    }

    render() {
        return (
        <div>
            <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={this.state.snackbarOpen}
            SnackbarContentProps={{
              classes: {
                root: this.props.caseCreationSuccess
                        ? this.props.classes.success
                        : this.props.classes.error
              }
            }}
            message={
                <span data-test="createCaseBannerText">
                        {this.props.message}
                    </span>
            }
            action={[
                <IconButton
                data-test="closeSnackbar"
                key={'closeSnackbar'}
                onClick={this.closeSnackbar}
                color="inherit"
                >
                    <CloseIcon/>
                </IconButton>
            ]}
            />
        </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        inProgress: state.cases.creation.inProgress,
        message: state.cases.creation.message,
        caseCreationSuccess: state.cases.creation.success
    }
}

const connectedComponent = connect(mapStateToProps)(CaseCreationSnackbar)
export default withStyles(styleSheet, {withTheme: true})(connectedComponent)