import React from 'react';
import CasesTable from "./CasesTable/CasesTable";
import CreateCaseDialog from "./CreateCaseDialog/CreateCaseDialog";
import CaseCreationSnackbar from "./CaseCreationSnackbar/CaseCreationSnackbar";
import NavBar from '../sharedComponents/NavBar'

const CaseDashboard = () => {
    return (
        <div>
            <NavBar>View All Cases</NavBar>
            <CreateCaseDialog/>
            <CasesTable/>
            <CaseCreationSnackbar/>
        </div>
    );
}

export default CaseDashboard