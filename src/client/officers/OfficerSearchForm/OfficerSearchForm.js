import React from 'react';
import {TextField} from "redux-form-material-ui";
import {reduxForm, Field} from "redux-form";
import NoBlurTextField from "../../cases/CaseDetails/CivilianDialog/FormSelect";
import {districtMenu} from "../../cases/CaseDetails/CivilianDialog/helpers/generateMenus";
import {SubmitButton} from "../../sharedComponents/StyledButtons";

const onSubmit = (values, dispatch) => {
    console.log('Here are your values: ', values)
}

const OfficerSearchForm = ({handleSubmit}) => {
    return (
        <div>
            <form>
                <div style={{display: 'flex'}}>
                    <Field
                        label={'First Name'}
                        name={'firstName'}
                        component={TextField}
                        style={{flex: '1', marginRight: '3%'}}
                    />

                    <Field
                        label={'Last Name'}
                        name={'lastName'}
                        component={TextField}
                        style={{flex: '1', marginRight: '3%'}}
                    />

                    <Field
                        label={'District'}
                        name={'district'}
                        hinttext={'District'}
                        component={NoBlurTextField}
                        style={{flex: '1', marginRight: '3%'}}
                    >
                        {districtMenu}
                    </Field>
                    <div style={{flex: '1', alignSelf: 'center', textAlign: 'right'}}>
                        <SubmitButton
                            onClick={handleSubmit(onSubmit)}
                        >
                            search
                        </SubmitButton>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default reduxForm({
    form: 'OfficerSearchForm'

})(OfficerSearchForm)