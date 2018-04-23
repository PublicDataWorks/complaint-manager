import React from 'react'
import OfficerSearchTableHeader from "../OfficerSearchTableHeader";
import {Paper, Typography} from "material-ui";

const OfficerDetails = () => (
    <div>
        <Typography
            type="title">
            Selected Officer
        </Typography>
        <Paper elevation={0}>
            <OfficerSearchTableHeader/>
        </Paper>
    </div>
);

export default OfficerDetails