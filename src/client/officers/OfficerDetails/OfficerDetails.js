import React from 'react'
import OfficerSearchTableHeader from "../OfficerSearchTableHeader";
import {
    Card, CardContent, Table, TableBody, Typography
} from "material-ui";
import OfficerSearchResultsRow from "../OfficerSearch/OfficerSearchResults/OfficerSearchResultsRow";
import {TextField} from 'redux-form-material-ui'
import OfficerTypeRadioGroup from "./OfficerTypeRadioGroup";
import {Field, reduxForm} from "redux-form";
import styles from "../../globalStyling/styles";
import {clearSelectedOfficer} from "../../actionCreators/officersActionCreators";
import LinkButton from "../../sharedComponents/LinkButton";
import addOfficer from "../thunks/addOfficer";
import {SubmitButton} from "../../sharedComponents/StyledButtons";


const OfficerDetails = (props) => {

    const onSubmit = (values, dispatch) => {
        dispatch(addOfficer(props.caseId, props.officer.id, values))
    };

    return (
        <div>
            <Typography
                style={{marginBottom: '16px'}}
                type="title">
                Selected Officer
            </Typography>
            <Table style={{marginBottom: '32px'}}>
                <OfficerSearchTableHeader/>
                <TableBody>
                    <OfficerSearchResultsRow officer={props.officer}/>
                </TableBody>
            </Table>
            <Typography
                type="title"
                style={{marginBottom: '16px'}}
            >
                Additional Info
            </Typography>
            <Card style={{backgroundColor: 'white', marginBottom: '16px'}}>
                <CardContent style={{paddingLeft: "16px"}}>
                    <form>
                        <div style={{marginBottom: '24px'}}>
                            <Typography style={styles.section}>
                                Role on case
                            </Typography>
                            <Field
                                component={OfficerTypeRadioGroup}
                                name="roleOnCase"
                            />
                        </div>
                        <Typography style={styles.section}>Notes</Typography>
                        <Typography type='body1'>Use this section to indicate any information about the officer's
                            history or risk assessment.</Typography>
                        <Field
                            component={TextField}
                            name='notes'
                            multiline
                            style={{width: '60%'}}
                        />
                    </form>
                </CardContent>
            </Card>
            <LinkButton onClick={() => props.dispatch(clearSelectedOfficer())}>Back to Search</LinkButton>
            <SubmitButton onClick={props.handleSubmit(onSubmit)}>Add Officer to Case</SubmitButton>
        </div>
    );
};

export default reduxForm({form: "OfficerDetails"})(OfficerDetails)