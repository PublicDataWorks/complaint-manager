import React from 'react'
import {Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "material-ui";
import {connect} from "react-redux";
import {CancelButton, SubmitButton} from "../../sharedComponents/StyledButtons";
import {closeRemoveCivilianDialog} from "../../actionCreators/casesActionCreators";
import formatCivilianName from "../../utilities/formatCivilianName";
import removeCivilian from "../thunks/removeCivilian";

const RemoveCivilianDialog = ({open, civilianDetails, dispatch}) =>(
    <Dialog open={open}>
        <DialogTitle data-test="dialogTitle" >
            Remove Civilian
        </DialogTitle>
        <DialogContent>
            <Typography data-test="warningText">
                This action will remove <strong>{formatCivilianName(civilianDetails)}</strong> and all information associated to this person from the case. Are you sure you want to continue?
            </Typography>
        </DialogContent>
        <DialogActions>
            <CancelButton
                onClick={()=> dispatch(closeRemoveCivilianDialog())}
                data-test="cancelButton"
            >
                Cancel
            </CancelButton>
            <SubmitButton
                data-test="removeButton"
                onClick={() => dispatch(removeCivilian(civilianDetails.id, civilianDetails.caseId))}
            >
                Remove
            </SubmitButton>
        </DialogActions>
    </Dialog>

)
const mapStateToProps = (state) => ({
    open: state.ui.removeCivilianDialog.open,
    civilianDetails: state.ui.removeCivilianDialog.civilianDetails
})

export default connect(mapStateToProps)(RemoveCivilianDialog)