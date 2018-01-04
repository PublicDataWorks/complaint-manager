import React from 'react';
import CasesTable from "./CasesTable";
import CreateCaseDialog from "./CreateCaseDialog";
import CaseCreationSnackbar from "./CaseCreationSnackbar";
import NavBar from '../NavBar'

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