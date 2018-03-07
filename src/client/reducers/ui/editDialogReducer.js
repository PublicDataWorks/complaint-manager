const initialState = {
    open: false
}

const editDialogReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'EDIT_DIALOG_OPENED':
            return {open: true}
        case 'EDIT_DIALOG_CLOSED':
            return {open: false}
        default:
            return state
    }
}

export default editDialogReducer