import React from 'react'
import {IconButton, Snackbar, withStyles} from 'material-ui'
import CloseIcon from 'material-ui-icons/Close'

const styleSheet = theme => ({
    error: {
        background: theme.palette.error.main
    },
    success: {
        background: theme.palette.green
    }
})

const CreationSnackbar = (props) => (
    <div>
        <Snackbar
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            open={props.open}
            SnackbarContentProps={{
                classes: {
                    root: props.creationSuccess
                        ? props.classes.success
                        : props.classes.error
                }
            }}
            message={
                <span data-test="creationSnackbarBannerText">
                    {props.message}
                    </span>
            }
            action={[
                <IconButton
                    data-test="closeSnackbar"
                    key={'closeSnackbar'}
                    onClick={() => props.closeSnackbar()}
                    color="inherit"
                >
                    <CloseIcon/>
                </IconButton>
            ]}
        />
    </div>
)

CreationSnackbar.defaultProps = {
    message: '',
    creationSuccess: false,
    open: false
}

export default withStyles(styleSheet, {withTheme: true})(CreationSnackbar)