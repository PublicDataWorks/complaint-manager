import React from 'react'
import {Field, reduxForm, submit} from "redux-form";
import {TextField} from "redux-form-material-ui";
import updateNarrative from "../thunks/updateNarrative";
import {CardActions, CardContent, Typography} from "material-ui";
import {SubmitButton} from "../../sharedComponents/StyledButtons";
import BaseCaseDetailsCard from "./BaseCaseDetailsCard";

const Narrative = (props) => {
    return (
        <BaseCaseDetailsCard title='Narrative'>
            <CardContent>
                <Typography
                    style={{
                        marginBottom: '2%'
                    }}
                >
                    Record information gained during the intake process. This information will be used to populate a detailed account section of the referral letter.
                </Typography>
                <form data-test="createUserForm">
                    <Field
                        name="narrative"
                        component={TextField}
                        fullWidth
                        multiline
                        rowsMax={5}
                        placeholder="Any information that the complainant provided about the incident"
                        inputProps={{
                            "data-test": "narrativeInput"
                        }}
                        data-test="narrativeField"
                    />
                </form>
            </CardContent>
            <CardActions style={{justifyContent: 'flex-end', paddingRight: '0px', padding: '0px 16px 16px 0px'}}>
                <SubmitButton
                    data-test="saveNarrative"
                    disabled={props.pristine}
                    onClick={() => props.dispatch(submit('Narrative'))}
                    style={{margin: '0px'}}
                >
                    Save
                </SubmitButton>
            </CardActions>
        </BaseCaseDetailsCard>
    )
}

const dispatchUpdateNarrative = (values, dispatch, props) => {
    const updateDetails =  {
        ...values,
        id: props.caseId
    }
    dispatch(updateNarrative(updateDetails))
}

export default reduxForm({
    form: 'Narrative',
    onSubmit: dispatchUpdateNarrative
})(Narrative);