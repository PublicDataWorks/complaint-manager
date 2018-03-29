import React from "react";
import { initialize } from "redux-form";
import { openCivilianDialog } from "../../../actionCreators/casesActionCreators";
import formatName from "../../../utilities/formatName";
import { CIVILIAN_FORM_NAME } from "../../../../sharedUtilities/constants";
import editCivilian from "../../thunks/editCivilian";
import LinkButton from "../../../sharedComponents/LinkButton";
import formatAddress from "../../../utilities/formatAddress";
import StyledExpansionPanelDetails from "./StyledExpansionPanelDetails";
import CivilianInfoDisplay from "./CivilianInfoDisplay";
import { ExpansionPanel, ExpansionPanelSummary, Typography } from "material-ui";
import formatDate from "../../../utilities/formatDate";
import formatPhoneNumber from "../../../utilities/formatPhoneNumber";

const ComplainantPanel = ({ civilian, dispatch }) => {
    const phoneNumber = formatPhoneNumber(civilian.phoneNumber)
    const birthDate = formatDate(civilian.birthDate)

    return (
        <ExpansionPanel
            data-test="complainantWitnessesPanel"
            elevation={0}
            style={{ backgroundColor: 'white' }}
        >
            <ExpansionPanelSummary style={{ padding: "0px 16px" }}>
                <div style={{ display: 'flex', width: '100%', paddingRight: 0 }}>
                    <CivilianInfoDisplay
                        displayLabel={civilian.roleOnCase}
                        value={formatName(civilian)}
                        testLabel="primaryComplainant"
                    />
                    <CivilianInfoDisplay
                        displayLabel='Gender Identity'
                        value={civilian.genderIdentity}
                        testLabel="genderIdentity"
                    />
                    <CivilianInfoDisplay
                        displayLabel='Race/Ethnicity'
                        value={civilian.raceEthnicity}
                        testLabel="raceEthnicity"
                    />
                    <div>
                        <LinkButton
                            data-test="editComplainantLink"
                            onClick={() => {
                                dispatch(initialize(CIVILIAN_FORM_NAME, civilian))
                                dispatch(openCivilianDialog('Edit Civilian', 'Save', editCivilian))
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
                    value={civilian.email}
                    testLabel="primaryComplainantEmail"
                />
            </StyledExpansionPanelDetails>
            <StyledExpansionPanelDetails>
                <div style={{ flex: 2, textAlign: 'left', marginRight: '10px' }}>
                    <Typography
                        type='caption'
                    >
                        Address
                    </Typography>
                    <Typography
                        type='body1'
                        data-test="primaryComplainantAddress"
                    >
                        {Boolean(formatAddress(civilian.address)) ? formatAddress(civilian.address) : 'No address specified'}
                    </Typography>
                    <Typography
                        type='body1'
                        data-test="primaryComplainantAdditionalAddressInfo"
                    >
                        {civilian.address && civilian.address.streetAddress2 ? civilian.address.streetAddress2 : ''}
                    </Typography>
                </div>
            </StyledExpansionPanelDetails>
            <StyledExpansionPanelDetails>
                <CivilianInfoDisplay
                    displayLabel='Additional Information'
                    value={civilian.additionalInfo}
                    testLabel="primaryComplainantAdditionalInfo"
                />
            </StyledExpansionPanelDetails>
        </ExpansionPanel>
    )
}

export default ComplainantPanel
