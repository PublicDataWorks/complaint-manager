import React from 'react';
import CasesTable from "./CasesTable/CasesTable";
import CreateCaseDialog from "./CreateCaseDialog/CreateCaseDialog";
import CaseCreationSnackbar from "./CaseCreationSnackbar/CaseCreationSnackbar";
import NavBar from '../sharedComponents/NavBar'
import {Typography} from "material-ui";

const CaseDashboard = () => {
    return (
        <div>
            <NavBar>
                <Typography
                    data-test="pageTitle"
                    type="title"
                    color="inherit"
                >
                    View All Cases
                </Typography>
            </NavBar>
            <CreateCaseDialog/>
            <CasesTable/>
            <CaseCreationSnackbar/>
        </div>
    );
}

export default CaseDashboard