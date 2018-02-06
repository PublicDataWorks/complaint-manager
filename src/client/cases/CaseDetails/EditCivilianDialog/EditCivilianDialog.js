import React from 'react';
import {connect} from "react-redux";
import { Field, reduxForm } from "redux-form";
import {Dialog, DialogTitle, DialogContent, DialogActions} from 'material-ui';
import RoleOnCaseRadioGroup from "./RoleOnCaseRadioGroup";
import FirstNameField from "../../sharedFormComponents/FirstNameField";
import LastNameField from "../../sharedFormComponents/LastNameField";
import {CancelButton} from "../../../sharedComponents/StyledButtons";
import {closeEditDialog} from "../../actionCreators";

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
                        <br />
                        <FirstNameField/>
                        <LastNameField/>
                        <br />
                    </form>
                </DialogContent>
                <DialogActions>
                    <CancelButton
                        data-test="cancelEditCivilian"
                        onClick={() => this.props.dispatch(closeEditDialog())}
                    >
                        Cancel
                    </CancelButton>
                </DialogActions>
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