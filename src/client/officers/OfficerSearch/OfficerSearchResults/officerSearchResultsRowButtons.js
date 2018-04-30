import React from 'react'
import {clearSelectedOfficer, selectOfficer} from "../../../actionCreators/officersActionCreators";
import LinkButton from "../../../sharedComponents/LinkButton";
import {Button} from "material-ui";

export const SelectNewOfficer = ({officer, dispatch}) => (
    <LinkButton
        onClick={() => {
            dispatch(selectOfficer(officer))
        }}
    >
        select
    </LinkButton>
)

export const PreviouslyAddedOfficer = () => (
    <Button
        disabled={true}
    >
        added
    </Button>
)

export const ChangeOfficer = ({dispatch}) => (
    <LinkButton
        onClick={ () => dispatch(clearSelectedOfficer()) }>
        change
    </LinkButton>
)