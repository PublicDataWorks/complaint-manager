import React from 'react'
import {Divider, ExpansionPanel, ExpansionPanelSummary, Typography} from "material-ui";
import OfficerInfoDisplay from "./OfficerInfoDisplay";
import StyledExpansionPanelDetails from "../ComplainantWitnesses/StyledExpansionPanelDetails";
import formatDate from "../../../utilities/formatDate";

const OfficerPanel = ({ caseOfficer }) => {
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
                        marginRight: '190px'
                    }}>
                    <div style={{display: "flex", width: "100%", paddingRight: 0}}>
                        <div style={{flex: 1, textAlign: 'left', marginRight: '10px'}}>
                            <Typography
                                variant='caption'
                            >
                                {`Officer ${caseOfficer.roleOnCase === 'Accused' ? '' : caseOfficer.roleOnCase }` }
                            </Typography>
                            <Typography
                                variant='body1'
                                style={{whiteSpace: "pre-wrap"}}
                            >
                                {caseOfficer.officer.fullName ? caseOfficer.officer.fullName : "N/A"}
                            </Typography>
                            <Typography
                                variant='body1'
                                style={{whiteSpace: "pre-wrap"}}
                            >
                                {caseOfficer.officer.windowsUsername ? `#${caseOfficer.officer.windowsUsername}` : "N/A"}
                            </Typography>
                        </div>
                        <OfficerInfoDisplay
                            displayLabel='Rank/Title'
                            value={caseOfficer.officer.rank}
                            testLabel="rank"
                        />
                        <OfficerInfoDisplay
                            displayLabel='Supervisor'
                            value={caseOfficer.officer.supervisor}
                            testLabel="supervisor"
                        />

                    </div>
                </ExpansionPanelSummary>
                <StyledExpansionPanelDetails>
                    <OfficerInfoDisplay
                        displayLabel='Employee Type'
                        value={caseOfficer.officer.employeeType}
                        testLabel="employeeType"
                    />
                    <OfficerInfoDisplay
                        displayLabel='District'
                        value={caseOfficer.officer.district}
                        testLabel="district"
                    />
                    <OfficerInfoDisplay
                        displayLabel='Bureau'
                        value={caseOfficer.officer.bureau}
                        testLabel="bureau"
                    />
                </StyledExpansionPanelDetails>
                <StyledExpansionPanelDetails>
                    <OfficerInfoDisplay
                        displayLabel='Status'
                        value={caseOfficer.officer.workStatus}
                        testLabel="status"
                    />
                    <OfficerInfoDisplay
                        displayLabel='Hire Date'
                        value={formatDate(caseOfficer.officer.hireDate)}
                        testLabel="hireDate"
                    />
                    <OfficerInfoDisplay
                        displayLabel='End of Employment'
                        value={formatDate(caseOfficer.officer.endDate)}
                        testLabel="endDate"
                    />
                </StyledExpansionPanelDetails>
                <StyledExpansionPanelDetails>
                    <OfficerInfoDisplay
                        displayLabel='Race'
                        value={caseOfficer.officer.race}
                        testLabel="race"
                    />
                    <OfficerInfoDisplay
                        displayLabel='Sex'
                        value={caseOfficer.officer.sex}
                        testLabel="sex"
                    />
                    <OfficerInfoDisplay
                        displayLabel='Age'
                        value={caseOfficer.officer.age}
                        testLabel="age"
                    />
                </StyledExpansionPanelDetails>
                <StyledExpansionPanelDetails>
                    <OfficerInfoDisplay
                        displayLabel='Notes'
                        value={caseOfficer.notes}
                        testLabel="notes"
                    />
                </StyledExpansionPanelDetails>
            </ExpansionPanel>
            <Divider/>
        </div>
    );
};

export default OfficerPanel;
