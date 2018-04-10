import React from 'react';
import {TextField} from "redux-form-material-ui";
import {reduxForm, Field} from "redux-form";
import NoBlurTextField from "../../cases/CaseDetails/CivilianDialog/FormSelect";
import {districtMenu} from "../../utilities/generateMenus";
import {SubmitButton} from "../../sharedComponents/StyledButtons";
import validate from "./validateOfficerSearchForm";
import {trimWhiteSpace} from "../../utilities/fieldNormalizers";
import getOfficerSearchResults from "../thunks/getOfficerSearchResults";

export const OfficerSearchForm = (props) => {
    const {invalid, handleSubmit, caseId} = props;
    const onSubmit = (values, dispatch) => {
        dispatch(getOfficerSearchResults(values, caseId));
    };

    return (
        <div>
            <form>
                <div style={{display: 'flex'}}>
                    <Field
                        label='First Name'
                        name='firstName'
                        component={TextField}
                        inputProps={{"data-test":'firstNameField'}}
                        normalize={trimWhiteSpace}
                        style={{flex: '1', marginRight: '24px'}}
                    />

                    <Field
                        label='Last Name'
                        name='lastName'
                        component={TextField}
                        inputProps={{"data-test":'lastNameField'}}
                        normalize={trimWhiteSpace}
                        style={{flex: '1', marginRight: '24px'}}
                    />

                    <Field
                        label='District'
                        name='district'
                        component={NoBlurTextField}
                        inputProps={{"data-test":'districtField'}}
                        style={{flex: '1', marginRight: '24px'}}
                    >
                        {districtMenu}
                    </Field>
                    <div style={{flex: '2', alignSelf: 'center', textAlign: 'right'}}>
                        <SubmitButton
                            disabled={invalid}
                            onClick={handleSubmit(onSubmit)}
                            data-test="officerSearchSubmitButton"
                        >
                            search
                        </SubmitButton>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default reduxForm({
    form: 'OfficerSearchForm',
    validate
})(OfficerSearchForm)