import React from 'react';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import {AppBar, IconButton, RaisedButton, Dialog} from "material-ui";

export default class ViewAllCases extends React.Component {
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
                        />
                    ]}
                >
                    <div data-test="caseModalInstructions">
                        Enter as much information as available to start a case. You will be able to edit this
                        information later.
                    </div>
                </Dialog>
            </div>
        );
    }
}


