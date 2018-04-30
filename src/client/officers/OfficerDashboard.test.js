import React from 'react'
import {mount, shallow} from 'enzyme'
import {BrowserRouter as Router} from "react-router-dom";
import ConnectedDashboard, {OfficerDashboard} from "./OfficerDashboard";
import getCaseDetails from "../cases/thunks/getCaseDetails";
import OfficerDetails from "./OfficerDetails/OfficerDetails";
import OfficerSearch from "./OfficerSearch/OfficerSearch";
import {clearSelectedOfficer} from "../actionCreators/officersActionCreators";
import createConfiguredStore from "../createConfiguredStore";
import {Provider} from "react-redux";
import {getCaseDetailsSuccess} from "../actionCreators/casesActionCreators";

jest.mock("../cases/thunks/getCaseDetails");

describe('Officer Dashboard', () => {
    let mockDispatch = jest.fn()
    getCaseDetails.mockImplementation(() => "");
    const caseId = 1;

    test('should not fetch case details when already loaded', () => {
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

    test('should render OfficerSearch if no officer selected yet', () => {
        const officerDashboard = shallow(<OfficerDashboard dispatch={mockDispatch} caseId={1} match={{params: {id: `${caseId}`}}}/>);
        const officerSearch = officerDashboard.find(OfficerSearch);
        const officerDetails = officerDashboard.find(OfficerDetails);
        expect(officerSearch.exists()).toEqual(true);
        expect(officerDetails.exists()).toEqual(false);
    });

    test('should not render OfficerSearch if officer has been selected', () => {
        const officerDashboard = shallow(<OfficerDashboard selectedOfficer={{firstName:'Bob'}} dispatch={mockDispatch} caseId={1} match={{params: {id: `${caseId}`}}}/>);
        const officerSearch = officerDashboard.find(OfficerSearch);
        const officerDetails = officerDashboard.find(OfficerDetails);
        expect(officerSearch.exists()).toEqual(false);
        expect(officerDetails.exists()).toEqual(true);
    })

    test('should clear selected officer when Back to Case is clicked', () => {
        const store = createConfiguredStore()
        const dispatchSpy = jest.spyOn(store, 'dispatch')
        store.dispatch(getCaseDetailsSuccess({
            id: 1,
            accusedOfficers: [{
                id: 23,
                roleOnCase: "Accused",
                officer: {
                   id: 34
                }
            }]
        }))

        const officerDashboard = mount(
            <Provider store={store}>
                <Router>
                    <ConnectedDashboard
                        match={{
                            params: {
                                id: `${caseId}`
                            }
                        }}/>
                </Router>
            </Provider>)

        const backToCaseButton = officerDashboard.find('[data-test="back-to-case-link"]').last()
        backToCaseButton.simulate('click')

        expect(dispatchSpy).toHaveBeenCalledWith(clearSelectedOfficer())
    })
});