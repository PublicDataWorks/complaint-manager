import React from 'react'
import {Field, reduxForm, submit} from "redux-form";
import {TextField} from "redux-form-material-ui";
import updateNarrative from "../thunks/updateNarrative";
import {Card, CardActions, CardContent, Divider, Typography} from "material-ui";
import {SubmitButton} from "../../sharedComponents/StyledButtons";

const Narrative = (props) => {
    return (
        <Card style={{
            backgroundColor: 'white',
            marginLeft: '5%',
            marginRight: '5%'
        }}>
            <CardContent>
                <Typography
                    type='title'
                    style={{marginBottom: '1%'}}
                >
                    Narrative
                </Typography>
            </CardContent>
            <Divider/>
            <CardContent>
                <Typography
                    style={{
                        marginTop: '1%',
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
            <CardActions style={{justifyContent: 'flex-end'}}>
                <SubmitButton
                    data-test="saveNarrative"
                    disabled={props.pristine}
                    onClick={() => props.dispatch(submit('Narrative'))}
                >
                    Save
                </SubmitButton>
            </CardActions>
        </Card>
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