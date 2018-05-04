import React from 'react'
import OfficerSearchTableHeader from "../OfficerSearchTableHeader";
import {Card, CardContent, Table, TableBody, Typography} from "material-ui";
import OfficerSearchResultsRow from "../OfficerSearch/OfficerSearchResults/OfficerSearchResultsRow";
import {TextField} from 'redux-form-material-ui'
import OfficerTypeRadioGroup from "./OfficerTypeRadioGroup";
import {Field, reduxForm} from "redux-form";
import styles from "../../globalStyling/styles";
import addOfficer from "../thunks/addOfficer";
import {SubmitButton} from "../../sharedComponents/StyledButtons";
import {ChangeOfficer} from "../OfficerSearch/OfficerSearchResults/officerSearchResultsRowButtons";

const OfficerDetails = (props) => {

    const onSubmit = (values, dispatch) => {
        const officerId = props.selectedOfficerData && props.selectedOfficerData.id

        dispatch(addOfficer(props.caseId, officerId, values))
    };

    return (
        <div>
            <Typography
                variant="title">
                Selected Officer
            </Typography>
            {
                props.selectedOfficerData ? (
                    <Table style={{marginBottom: '32px'}}>
                        <OfficerSearchTableHeader/>
                        <TableBody>
                            <OfficerSearchResultsRow officer={props.selectedOfficerData}>
                                <ChangeOfficer dispatch={props.dispatch}>change</ChangeOfficer>
                            </OfficerSearchResultsRow>
                        </TableBody>
                    </Table>
                ) : (
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Typography
                            style={{marginBottom: '16px'}}
                            variant="body1"
                        >
                            You have selected Unknown Officer. Change this officer to a known officer by selecting Search for Officer.
                        </Typography>
                        <ChangeOfficer dispatch={props.dispatch}>Search For Officer</ChangeOfficer>
                    </div>
                )
            }
            <Typography
                variant="title"
                style={{marginBottom: '16px'}}
            >
                Additional Info
            </Typography>
            <Card style={{backgroundColor: 'white', marginBottom: '16px'}}>
                <CardContent>
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
                        <Typography variant='body1'>Use this section to indicate any information about the officer's
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
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <SubmitButton data-test="addOfficerSubmitButton" onClick={props.handleSubmit(onSubmit)}>Add Officer to Case</SubmitButton>
            </div>
        </div>
    );
};

export default reduxForm({
    form: "OfficerDetails",
    initialValues: {
        roleOnCase: "Accused"
    }
})(OfficerDetails)