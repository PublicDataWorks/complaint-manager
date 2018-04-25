import React from 'react'
import {Divider, ExpansionPanel, ExpansionPanelSummary} from "material-ui";
import OfficerInfoDisplay from "./OfficerInfoDisplay";
import StyledExpansionPanelDetails from "../ComplainantWitnesses/StyledExpansionPanelDetails";

const OfficerPanel = ({officer}) => {
    return (
        <div>
            <ExpansionPanel
                data-test="officerPanel"
                elevation={0}
                style={{backgroundColor: "white"}}
            >
                <ExpansionPanelSummary style={{padding: "0px 16px"}}>
                    <div style={{display: "flex", width: "100%", paddingRight: 0}}>
                        <OfficerInfoDisplay
                            displayLabel="Officer"
                            value={officer.fullName}
                            testLabel="officer"
                        />
                        <OfficerInfoDisplay
                            displayLabel='District'
                            value={officer.district}
                            testLabel="genderIdentity"
                        />
                        <OfficerInfoDisplay
                            displayLabel='Race'
                            value={officer.race}
                            testLabel="race"
                        />
                        <div style={{flex: 1}}>

                        </div>
                    </div>
                </ExpansionPanelSummary>
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
