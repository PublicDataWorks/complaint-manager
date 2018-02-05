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

const formatPhoneNumber = (phoneNumber) => {
    const phoneString = phoneNumber.toString()

    const areaCode = phoneString.substring(0,3)
    const first = phoneString.substring(3, 6)
    const second = phoneString.substring(6,10)

    return `(${areaCode}) ${first}-${second}`
}

const ComplainantWitnesses = ({caseDetail}) =>{
    return(
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
                        <div style={{display: "flex", width: '100%'}}>
                            <div style={{flex: 1, textAlign: 'left'}}>
                                <Typography
                                    type='caption'
                                    data-test="primaryComplainantLabel"
                                >
                                    Primary Complainant
                                </Typography>
                                <Typography
                                    type='body1'
                                    data-test="primaryComplainantName"
                                >
                                    {`${caseDetail.firstName} ${caseDetail.lastName}`}
                                </Typography>
                            </div>
                            <div style={{flex: 1, textAlign: 'left'}}>
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
                                    N/A
                                </Typography>
                            </div>
                            <div style={{flex: 1, textAlign: 'left'}}>
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
                                    N/A
                                </Typography>
                            </div>
                        </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{padding: "8px 16px 24px 16px"}}>
                        <div style={{display: "flex", width: '100%', background: 'white'}}>
                            <div style={{flex: 1, textAlign: 'left'}}>
                                <Typography
                                    type='caption'
                                >
                                    Phone Number
                                </Typography>
                                <Typography
                                    type='body1'
                                    data-test="primaryComplainantPhoneNumber"
                                >
                                    {caseDetail.phoneNumber ? formatPhoneNumber(caseDetail.phoneNumber) : 'N/A'}
                                </Typography>
                            </div>
                            <div style={{flex: 1, textAlign: 'left'}}>
                                <Typography
                                    type='caption'
                                >
                                    Email
                                </Typography>
                                <Typography
                                    type='body1'
                                    data-test="primaryComplainantEmail"
                                >
                                    {caseDetail.email ? caseDetail.email : 'N/A'}
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