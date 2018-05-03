import {REMOVE_CIVILIAN_DIALOG_CLOSED, REMOVE_CIVILIAN_DIALOG_OPENED} from "../../../sharedUtilities/constants";

const initialState = {
    open: false,
    civilianDetails: {}
}

const removeCivilianDialogReducer = (state = initialState, action) => {
    switch (action.type) {
        case REMOVE_CIVILIAN_DIALOG_OPENED:
            return {
                open: true,
                civilianDetails:action.civilianDetails
            }
        case REMOVE_CIVILIAN_DIALOG_CLOSED:
            return {
                open: false,
                civilianDetails: {}
            }
        default:
            return state
    }
}

export default removeCivilianDialogReducer