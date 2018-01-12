import React from 'react'
import {IconButton, Snackbar, withStyles } from 'material-ui'
import CloseIcon from 'material-ui-icons/Close'

const styleSheet = theme => ({
    error: {
        background: theme.palette.error[500]
    },
    success: {
        background: theme.palette.green
    }
})

class CreationSnackbar extends React.Component {
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
                            root: this.props.creationSuccess
                                ? this.props.classes.success
                                : this.props.classes.error
                        }
                    }}
                    message={
                        <span data-test="creationSnackbarBannerText">
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

export default withStyles(styleSheet, {withTheme: true})(CreationSnackbar)