import React from 'react'
import {Divider, ExpansionPanel, ExpansionPanelSummary, Typography} from "material-ui";
import OfficerInfoDisplay from "./OfficerInfoDisplay";
import StyledExpansionPanelDetails from "../ComplainantWitnesses/StyledExpansionPanelDetails";
import formatDate from "../../../utilities/formatDate";

const OfficerPanel = ({officer}) => {
    return (
        <div>
            <ExpansionPanel
                data-test="officerPanel"
                elevation={0}
                style={{backgroundColor: "white"}}
            >
                <ExpansionPanelSummary
                    style={{
                        padding: "0px 24px",
                        marginRight: '184px'
                    }}>
                    <div style={{display: "flex", width: "100%", paddingRight: 0}}>
                        <div style={{flex: 1, textAlign: 'left', marginRight: '10px'}}>
                            <Typography
                                variant='caption'
                            >
                                Officer
                            </Typography>
                            <Typography
                                variant='body1'
                                style={{whiteSpace: "pre-wrap"}}
                            >
                                {officer.fullName ? officer.fullName : "N/A"}
                            </Typography>
                            <Typography
                                variant='body1'
                                style={{whiteSpace: "pre-wrap"}}
                            >
                                {officer.windowsUsername ? `#${officer.windowsUsername}` : "N/A"}
                            </Typography>
                        </div>
                        <OfficerInfoDisplay
                            displayLabel='Rank/Title'
                            value={officer.rank}
                            testLabel="rank"
                        />
                        <OfficerInfoDisplay
                            displayLabel='Supervisor'
                            value={officer.supervisor}
                            testLabel="supervisor"
                        />

                    </div>
                </ExpansionPanelSummary>
                <StyledExpansionPanelDetails>
                    <OfficerInfoDisplay
                        displayLabel='Employee Type'
                        value={officer.employeeType}
                        testLabel="employeeType"
                    />
                    <OfficerInfoDisplay
                        displayLabel='District'
                        value={officer.district}
                        testLabel="district"
                    />
                    <OfficerInfoDisplay
                        displayLabel='Bureau'
                        value={officer.bureau}
                        testLabel="bureau"
                    />
                </StyledExpansionPanelDetails>
                <StyledExpansionPanelDetails>
                    <OfficerInfoDisplay
                        displayLabel='Status'
                        value={officer.workStatus}
                        testLabel="status"
                    />
                    <OfficerInfoDisplay
                        displayLabel='Hire Date'
                        value={formatDate(officer.hireDate)}
                        testLabel="hireDate"
                    />
                    <OfficerInfoDisplay
                        displayLabel='End of Employment'
                        value={formatDate(officer.endDate)}
                        testLabel="endDate"
                    />
                </StyledExpansionPanelDetails>
                <StyledExpansionPanelDetails>
                    <OfficerInfoDisplay
                        displayLabel='Race'
                        value={officer.race}
                        testLabel="race"
                    />
                    <OfficerInfoDisplay
                        displayLabel='Sex'
                        value={officer.sex}
                        testLabel="sex"
                    />
                    <OfficerInfoDisplay
                        displayLabel='Age'
                        value={officer.age}
                        testLabel="age"
                    />
                </StyledExpansionPanelDetails>
                <StyledExpansionPanelDetails>
                    <OfficerInfoDisplay
                        displayLabel='Notes'
                        value={officer.notes}
                        testLabel="notes"
                    />
                </StyledExpansionPanelDetails>
            </ExpansionPanel>
            <Divider/>
        </div>
    );
};

export default OfficerPanel;
