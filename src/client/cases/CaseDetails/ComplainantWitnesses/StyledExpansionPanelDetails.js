import React from 'react'
import {ExpansionPanelDetails} from "material-ui";

const StyledExpansionPanelDetails = (props) => (
    <ExpansionPanelDetails style={{padding: "8px 16px 24px 16px"}}>
        <div style={{
            display: 'flex',
            width: '100%',
            background: 'white',
            padding: '0',
            marginRight: '88px'
        }}>
            {props.children}
        </div>
    </ExpansionPanelDetails>
)

export default StyledExpansionPanelDetails