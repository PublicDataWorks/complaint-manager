import React from 'react';
import {connect} from "react-redux";
import { Field, reduxForm } from "redux-form";
import {Dialog, DialogTitle, DialogContent} from 'material-ui';
import RoleOnCaseRadioGroup from "./RoleOnCaseRadioGroup";

class EditCivilianDialog extends React.Component {
    render(){
        return (
            <Dialog
                open={this.props.open}
            >
                <DialogTitle
                    data-test="editDialogTitle"
                >
                    Edit Civilian
                </DialogTitle>
                <DialogContent>
                    <form>
                        <Field
                            name="roleOnCase"
                            component={RoleOnCaseRadioGroup}/>
                    </form>
                </DialogContent>
            </Dialog>
        )
    }
}

const mapStateToProps = (state) => ({
    open: state.ui.editCivilianDialog.open
})

const ConnectedDialog = connect(mapStateToProps)(EditCivilianDialog)
export default reduxForm({
    form: 'EditCivilian',
    initialValues: {
        roleOnCase: 'primaryComplainant'
    }
})(ConnectedDialog);