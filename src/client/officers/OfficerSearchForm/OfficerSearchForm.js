import React from 'react';
import {TextField} from "redux-form-material-ui";
import {reduxForm, Field} from "redux-form";
import NoBlurTextField from "../../cases/CaseDetails/CivilianDialog/FormSelect";
import {districtMenu} from "../../cases/CaseDetails/CivilianDialog/helpers/generateMenus";
import {SubmitButton} from "../../sharedComponents/StyledButtons";
import validate from "./validateOfficerSearchForm";
import {trimWhiteSpace} from "../../utilities/fieldNormalizers";

const onSubmit = (values, dispatch) => {
    console.log('Here are your values: ', values)
};

export const OfficerSearchForm = (props) => {
    return (
        <div>
            <form>
                <div style={{display: 'flex'}}>
                    <Field
                        label='First Name'
                        name='firstName'
                        component={TextField}
                        data-test='firstNameField'
                        normalize={trimWhiteSpace}
                        style={{flex: '1', marginRight: '3%'}}
                    />

                    <Field
                        label='Last Name'
                        name='lastName'
                        component={TextField}
                        data-test='lastNameField'
                        normalize={trimWhiteSpace}
                        style={{flex: '1', marginRight: '3%'}}
                    />

                    <Field
                        label='District'
                        name='district'
                        component={NoBlurTextField}
                        data-test='districtField'
                        style={{flex: '1', marginRight: '3%'}}
                    >
                        {districtMenu}
                    </Field>
                    <div style={{flex: '1', alignSelf: 'center', textAlign: 'right'}}>
                        <SubmitButton
                            disabled={props.invalid}
                            onClick={props.handleSubmit(onSubmit)}
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