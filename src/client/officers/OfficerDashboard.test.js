import React from 'react'
import {shallow} from 'enzyme'
import {OfficerDashboard} from "./OfficerDashboard";
import getCaseDetails from "../cases/thunks/getCaseDetails";

jest.mock("../cases/thunks/getCaseDetails", () => () => "some data")

describe('Officer Dashboard', () => {

    let mockDispatch = jest.fn()

    test('should not fetch case details when already loaded', () => {
        const caseId = 1;
        shallow(
            <OfficerDashboard
            match={{
                params: {
                    id: `${caseId}`
                }
            }}
            caseId={caseId}
            dispatch={mockDispatch}
        />)

        expect(mockDispatch).not.toHaveBeenCalledWith(getCaseDetails())

    })

    test('should fetch case details when different case is loaded', () => {
        const caseId = 1;
        const differentCaseId = 5;
        shallow(
            <OfficerDashboard
            match={{
                params: {
                    id: `${caseId}`
                }
            }}
            caseId={differentCaseId}
            dispatch={mockDispatch}
        />)

        expect(mockDispatch).toHaveBeenCalledWith(getCaseDetails())

    })

    test('should fetch case details when no case is loaded', () => {
        const caseId = 1;
        const noCase = null;
        shallow(
            <OfficerDashboard
            match={{
                params: {
                    id: `${caseId}`
                }
            }}
            caseId={noCase}
            dispatch={mockDispatch}
        />)

        expect(mockDispatch).toHaveBeenCalledWith(getCaseDetails())

    })
});