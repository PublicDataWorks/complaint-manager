import React from "react";
import {CardContent, ExpansionPanel, ExpansionPanelSummary, Typography} from "material-ui";
import LinkButton from "../../../sharedComponents/LinkButton";
import {openEditDialog} from "../../../actionCreators/casesActionCreators";
import getPrimaryComplainant from "../../../utilities/getPrimaryComplainant";
import formatDate from "../../../utilities/formatDate"
import formatName from "../../../utilities/formatName";
import {initialize} from "redux-form";
import BaseCaseDetailsCard from "../BaseCaseDetailsCard";
import formatPhoneNumber from "../../../utilities/formatPhoneNumber"
import formatAddress from "../../../utilities/formatAddress";
import StyledExpansionPanelDetails from "./StyledExpansionPanelDetails";
import CivilianInfoDisplay from "./CivilianInfoDisplay";


const ComplainantWitnesses = (props) => {
    const primaryComplainant = getPrimaryComplainant(props.caseDetail.civilians)
    const phoneNumber = formatPhoneNumber(primaryComplainant.phoneNumber)
    const birthDate = formatDate(primaryComplainant.birthDate)

    return (
        <BaseCaseDetailsCard
            data-test="complainantWitnessesSection"
            title='Complainant & Witnesses'
        >
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
                            <CivilianInfoDisplay
                                displayLabel={primaryComplainant.roleOnCase}
                                value={formatName(primaryComplainant)}
                                testLabel="primaryComplainant"
                            />
                            <CivilianInfoDisplay
                                displayLabel='Gender Identity'
                                value={primaryComplainant.genderIdentity}
                                testLabel="genderIdentity"
                            />
                            <CivilianInfoDisplay
                                displayLabel='Race/Ethnicity'
                                value={primaryComplainant.raceEthnicity}
                                testLabel="raceEthnicity"
                            />
                            <div>
                                <LinkButton
                                    data-test="editComplainantLink"
                                    onClick={() => {
                                        props.dispatch(initialize('EditCivilian', primaryComplainant))
                                        props.dispatch(openEditDialog())
                                    }}
                                >
                                    Edit
                                </LinkButton>
                            </div>
                        </div>
                    </ExpansionPanelSummary>
                    <StyledExpansionPanelDetails>
                        <CivilianInfoDisplay
                            displayLabel='Birthday'
                            value={birthDate}
                            testLabel="primaryComplainantBirthday"
                        />
                        <CivilianInfoDisplay
                            displayLabel='Phone Number'
                            value={phoneNumber}
                            testLabel="primaryComplainantPhoneNumber"
                        />
                        <CivilianInfoDisplay
                            displayLabel='Email'
                            value={primaryComplainant.email}
                            testLabel="primaryComplainantEmail"
                        />
                    </StyledExpansionPanelDetails>
                    <StyledExpansionPanelDetails>
                        <div style={{flex: 2, textAlign: 'left', marginRight: '10px'}}>
                            <Typography
                                type='caption'
                            >
                                Address
                            </Typography>
                            <Typography
                                type='body1'
                                data-test="primaryComplainantAddress"
                            >
                                {Boolean(formatAddress(primaryComplainant.address)) ? formatAddress(primaryComplainant.address) : 'No address specified'}
                            </Typography>
                            <Typography
                                type='body1'
                                data-test="primaryComplainantAdditionalAddressInfo"
                            >
                                {primaryComplainant.address && primaryComplainant.address.streetAddress2 ? primaryComplainant.address.streetAddress2 : ''}
                            </Typography>
                        </div>
                    </StyledExpansionPanelDetails>
                    <StyledExpansionPanelDetails>
                        <CivilianInfoDisplay
                            displayLabel='Additional Information'
                            value={primaryComplainant.additionalInfo}
                            testLabel="primaryComplainantAdditionalInfo"
                        />
                    </StyledExpansionPanelDetails>
                </ExpansionPanel>
            </CardContent>
        </BaseCaseDetailsCard>
    )
}

export default ComplainantWitnesses