import editCivilian from "../../../thunks/editCivilian";

const handleEditCivilian = (values, dispatch) => {
    //The database can't handle the empty string we use for display purposes.  So, strip it out before sending off to the API
    const nullifyDateUnlessValid = date => (date && date.trim() === '' ? null : date)

    dispatch(editCivilian({
        ...values,
        birthDate: nullifyDateUnlessValid(values.birthDate)
    }))
}

export default handleEditCivilian