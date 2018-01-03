import React from 'react'
import { IconButton, Snackbar } from 'material-ui'
import CloseIcon from 'material-ui-icons/Close'
import { connect } from 'react-redux'

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
        message: state.cases.creation.message
    }
}

export default connect(mapStateToProps)(CaseCreationSnackbar)