import React from 'react'
import {
    clearSelectedOfficer,
    selectOfficer,
    selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";
import LinkButton from "../../../sharedComponents/LinkButton";
import {Button} from "material-ui";
import {CancelButton} from "../../../sharedComponents/StyledButtons";

export const SelectNewOfficer = ({officer, dispatch}) => (
    <LinkButton
        onClick={() => {
            dispatch(selectOfficer(officer))
        }}
    >
        select
    </LinkButton>
)

export const SelectUnknownOfficer = ({ dispatch }) => (
    <CancelButton
        style={{ marginRight: 20 }}
        data-test="unknownOfficerButton"
        onClick={() => {
            dispatch(selectUnknownOfficer())
        }}
    >
        continue as unknown officer
    </CancelButton>
)

export const PreviouslyAddedOfficer = () => (
    <Button
        disabled={true}
    >
        added
    </Button>
)

export const ChangeOfficer = ({children, dispatch}) => (
    <LinkButton
        onClick={ () => dispatch(clearSelectedOfficer()) }>
        {children}
    </LinkButton>
)