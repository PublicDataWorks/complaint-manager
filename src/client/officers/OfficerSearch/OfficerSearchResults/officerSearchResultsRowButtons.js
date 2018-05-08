import React from 'react'
import {
    clearSelectedOfficer,
    selectOfficer,
    selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";
import LinkButton from "../../../sharedComponents/LinkButton";
import {Button} from "material-ui";
import {CancelButton} from "../../../sharedComponents/StyledButtons";
import {Link} from "react-router-dom";

export const SelectNewOfficer = ({caseId, officer, dispatch}) => (
    <LinkButton
        component={Link}
        to={`/cases/${caseId}/officers/details`}
        onClick={() => {
            dispatch(selectOfficer(officer))
        }}
    >
        select
    </LinkButton>
)

export const SelectUnknownOfficerButton = ({ dispatch, caseId}) => (
    <CancelButton
        style={{ marginRight: 20 }}
        data-test="unknownOfficerButton"
        component={Link}
        to={`/cases/${caseId}/officers/details`}
        onClick={() => {
            dispatch(selectUnknownOfficer())
        }}
    >
        add an unknown officer
    </CancelButton>
)

export const PreviouslyAddedOfficer = () => (
    <Button
        disabled={true}
    >
        added
    </Button>
)

export const ChangeOfficer = ({children, dispatch, caseId}) => (
    <LinkButton
        component={Link}
        to={`/cases/${caseId}/officers/search`}
        onClick={() => {
            dispatch(clearSelectedOfficer())
        }}
        >
        {children}
    </LinkButton>
)