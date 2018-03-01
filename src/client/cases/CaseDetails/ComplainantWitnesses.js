import React from "react";
import {
    Card,
    CardContent,
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Typography
} from "material-ui";
import {openEditDialog} from "../actionCreators";
import LinkButton from "../../sharedComponents/LinkButton";
import getPrimaryComplainant from "../../utilities/getPrimaryComplainant";
import formatDate from "../../utilities/formatDate";
import {initialize} from "redux-form";
import formatName from "../../utilities/formatName";
import _ from 'lodash'
import formatPhoneNumber from "../../utilities/formatPhoneNumber";

function removeFalsyProperties(object) {
    return _.pickBy(object, _.identity)
}

const ComplainantWitnesses = (props) => {
    const primaryComplainant = getPrimaryComplainant(props.caseDetail.civilians)

    return (
            <Card
                data-test="complainantWitnessesSection"
                style={{
                    backgroundColor: 'white',
                    marginLeft: '5%',
                    marginRight: '5%',
                    maxWidth: '850px',
                    marginBottom: '24px'
                }}
            >
                <CardContent
                >
                    <Typography
                        type="title"
                        data-test="complainantWitnessesPanelTitle">
                        Complainant & Witnesses
                    </Typography>
                </CardContent>
                <Divider/>
                <CardContent
                    style={{padding: '0'}}
                >
                    <ExpansionPanel
                        data-test="complainantWitnessesPanel"
                        elevation={0}
                        style={{backgroundColor: 'white'}}
                    >
                        <ExpansionPanelSummary style={{padding: "0px 16px"}}>
                            <div style={{display: 'flex', width: '100%', paddingRight: 0}}>
                                <div style={{flex: 1, textAlign: 'left', marginRight: '10px'}}>
                                    <Typography
                                        type='caption'
                                        data-test="primaryComplainantLabel"
                                    >
                                        {primaryComplainant.roleOnCase}
                                    </Typography>
                                    <Typography
                                        type='body1'
                                        data-test="primaryComplainantName"
                                    >
                                        {formatName(primaryComplainant)}
                                    </Typography>
                                </div>
                                <div style={{flex: 1, textAlign: 'left', marginRight: '10px'}}>
                                    <Typography
                                        type='caption'
                                        data-test="genderIdentityLabel"
                                    >
                                        Gender Identity
                                    </Typography>
                                    <Typography
                                        type='body1'
                                        data-test="genderIdentity"
                                    >
                                        {primaryComplainant.genderIdentity ? primaryComplainant.genderIdentity : 'N/A'}
                                    </Typography>
                                </div>
                                <div style={{flex: 1, textAlign: 'left', marginRight: '10px'}}>
                                    <Typography
                                        type='caption'
                                        data-test="raceEthnicityLabel"
                                    >
                                        Race/Ethnicity
                                    </Typography>
                                    <Typography
                                        type='body1'
                                        data-test="raceEthnicity"
                                    >
                                        {primaryComplainant.raceEthnicity ? primaryComplainant.raceEthnicity : 'N/A'}
                                    </Typography>
                                </div>
                                <div>
                                    <LinkButton
                                        data-test="editComplainantLink"
                                        onClick={() => {
                                            props.dispatch(initialize('EditCivilian', removeFalsyProperties(primaryComplainant)))
                                            props.dispatch(openEditDialog())
                                        }}
                                    >
                                        Edit
                                    </LinkButton>
                                </div>
                            </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: "8px 16px 24px 16px"}}>
                            <div style={{display: 'flex', width: '100%', background: 'white', padding: '0', marginRight: '88px'}}>
                                <div style={{flex: 1, textAlign: 'left', marginRight: '10px'}}>
                                    <Typography
                                        type='caption'
                                    >
                                        Birthday
                                    </Typography>
                                    <Typography
                                        type='body1'
                                        data-test="primaryComplainantBirthday"
                                    >
                                        {primaryComplainant.birthDate ? formatDate(primaryComplainant.birthDate) : 'N/A'}
                                    </Typography>
                                </div>
                                <div style={{flex: 1, textAlign: 'left', marginRight: '10px'}}>
                                    <Typography
                                        type='caption'
                                    >
                                        Phone Number
                                    </Typography>
                                    <Typography
                                        type='body1'
                                        data-test="primaryComplainantPhoneNumber"
                                    >
                                        {primaryComplainant.phoneNumber ? formatPhoneNumber(primaryComplainant.phoneNumber) : 'N/A'}
                                    </Typography>
                                </div>
                                <div style={{flex: 1, textAlign: 'left', marginRight: '10px'}}>
                                    <Typography
                                        type='caption'
                                    >
                                        Email
                                    </Typography>
                                    <Typography
                                        type='body1'
                                        data-test="primaryComplainantEmail"
                                    >
                                        {primaryComplainant.email ? primaryComplainant.email : 'N/A'}
                                    </Typography>
                                </div>
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </CardContent>

            </Card>
    )
}

export default ComplainantWitnesses