const initialState = {
    open: false
}

const editDialogReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'EDIT_DIALOG_OPENED':
            return {open: true}
        default:
            return state
    }
}

export default editDialogReducer