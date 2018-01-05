import React from 'react';
import CasesTable from "./CasesTable";
import CreateCaseDialog from "./CreateCaseDialog";
import CaseCreationSnackbar from "./CaseCreationSnackbar";
import NavBar from '../NavBar'
import {withTheme} from "material-ui";

const CaseDashboard = (props) => {
    return (
        <div>
            <NavBar>View All Cases</NavBar>
            {console.log(props.theme)}
            <CreateCaseDialog/>
            <CasesTable/>
            <CaseCreationSnackbar/>
        </div>
    );
}

export default withTheme()(CaseDashboard)