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

const SharedSnackbar = (props) => (
    <div>
        <Snackbar
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            open={props.open}
            autoHideDuration={15000}
            onClose={() => { props.closeSnackbar() }}
            SnackbarContentProps={{
                classes: {
                    root: props.success
                        ? props.classes.success
                        : props.classes.error
                },
                style: {maxWidth: '800px'}
            }}
            message={
                <span data-test="sharedSnackbarBannerText">
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

SharedSnackbar.defaultProps = {
    message: '',
    success: false,
    open: false
}

export default withStyles(styleSheet, {withTheme: true})(SharedSnackbar)