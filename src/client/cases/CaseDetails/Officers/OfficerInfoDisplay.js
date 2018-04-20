import React from 'react'
import {Typography} from "material-ui";

const OfficerInfoDisplay = (props) => (
    <div style={{flex: 1, textAlign: 'left', marginRight: '10px'}}>
        <Typography
            type='caption'
            data-test={`${props.testLabel}Label`}
        >
            {props.displayLabel}
        </Typography>
        <Typography
            type='body1'
            data-test={props.testLabel}
            style={{whiteSpace: "pre-wrap"}}
        >
            {props.value ? props.value : "N/A"}
        </Typography>
    </div>
)

export default OfficerInfoDisplay