import React from 'react';
import OfficerSearchForm from "./OfficerSearchForm/OfficerSearchForm";
import {Card, CardContent, Typography} from "material-ui";
import OfficerSearchResults from "./OfficerSearchResults/OfficerSearchResults";

const OfficerSearch = (props) => {
    return (
        <div>
            <div style={{margin: '0 0 20px 0'}}>
                <Typography variant="title">Search for an Officer</Typography>
                <Typography variant="body1">Search by entering at least one of the following fields</Typography>
            </div>

            <Card
                style=
                    {{
                        backgroundColor: 'white',
                        width: '100%',
                        margin: '0 0 32px 0'
                    }}
            >
                <CardContent style={{paddingBottom: '8px'}}>
                    <OfficerSearchForm caseId={props.caseId}/>
                </CardContent>
            </Card>
            <OfficerSearchResults/>
        </div>
    )
};

export default OfficerSearch;