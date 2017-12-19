import React from 'react';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import {AppBar, IconButton, RaisedButton, Dialog} from "material-ui";
import CreateCaseForm from './CreateCaseForm'
import { connect } from 'react-redux'
import { submit } from 'redux-form'

class ViewAllCases extends React.Component {
    state = {
        open: false,
    };

    handleOpen = () => (
        this.setState({open: true})
    );

    handleClose = () => {
        console.log('inside handleClose')
        this.setState({open: false})
    }

    render() {
        return (
            <div>
                <AppBar
                    title={"View All Cases"}
                    iconElementLeft={
                        <IconButton>
                            <ActionHome/>
                        </IconButton>}
                    iconElementRight={
                        <IconButton>
                            <ActionAccountCircle/>
                        </IconButton>
                    }
                />
                <RaisedButton
                    label="asdf"
                    data-test="createCaseButton"
                    onClick={this.handleOpen}
                />
                <Dialog
                    data-test="createCaseDialog"
                    open={this.state.open}
                    title="Create New Case"
                    actions={[
                        <RaisedButton
                            data-test="cancelCaseCreationButton"
                            label="Cancel"
                            onClick={this.handleClose}
                        />,
                        <RaisedButton
                            data-test="createCaseButton"
                            label="Create"
                            onClick={() => this.props.dispatch(submit('CreateCase'))}
                        />
                    ]}
                >
                    <CreateCaseForm/>
                </Dialog>
            </div>
        );
    }
}

export default connect()(ViewAllCases)