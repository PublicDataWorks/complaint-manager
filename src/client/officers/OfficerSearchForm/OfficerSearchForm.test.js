import React from "react";
import {mount, shallow} from "enzyme";
import {OfficerSearchForm as OfficerSearchFormUnconnected} from "./OfficerSearchForm";
import OfficerSearchForm from "./OfficerSearchForm";
import {SubmitButton} from "../../sharedComponents/StyledButtons";
import createConfiguredStore from "../../createConfiguredStore";
import getOfficerSearchResults from "../thunks/getOfficerSearchResults";
import {Provider} from "react-redux";
import {changeInput, selectDropdownOption} from "../../../testHelpers";

jest.mock("../thunks/getOfficerSearchResults", () => (searchCriteria) => ({type:"something", searchCriteria}));

describe("OfficerSearchForm", () => {
    describe("submit button", () => {
        test("submit button should be disabled when form is not valid", () => {
            const searchForm = shallow(<OfficerSearchFormUnconnected handleSubmit={() => {}} invalid={true}/>);
            const submitButton = searchForm.find(SubmitButton);
            expect(!!submitButton.disabled).toBeTruthy;
        });

        test("submit button should be enabled when form is valid", () => {
            const searchForm = shallow(<OfficerSearchFormUnconnected handleSubmit={() => {}} invalid={false}/>);
            const submitButton = searchForm.find(SubmitButton);
            expect(!!submitButton.disabled).toBeFalsy();
        });
    });

    describe("onSubmit", () => {
        test("dispatches searchOfficer on submit", () => {
            const store = createConfiguredStore();
            const dispatchSpy = jest.spyOn(store, 'dispatch');

            const officerSearchForm = mount(<Provider store={store}><OfficerSearchForm /></Provider>);
            changeInput(officerSearchForm, "[data-test='firstNameField']", 'emma');
            changeInput(officerSearchForm, "[data-test='lastNameField']", 'watson');
            selectDropdownOption(officerSearchForm, "[data-test='districtField']", '1st District');

            officerSearchForm.find(SubmitButton).simulate('click');
            expect(dispatchSpy).toHaveBeenCalledWith(getOfficerSearchResults({firstName: 'emma', lastName: 'watson', district: 'First District'}));
        });

        test("normalizes first and last name on submit", () => {
            const store = createConfiguredStore();
            const dispatchSpy = jest.spyOn(store, 'dispatch');

            const officerSearchForm = mount(<Provider store={store}><OfficerSearchForm /></Provider>);
            changeInput(officerSearchForm, "[data-test='firstNameField']", ' bubba joe ');
            changeInput(officerSearchForm, "[data-test='lastNameField']", ' smith ');
            selectDropdownOption(officerSearchForm, "[data-test='districtField']", '1st District');

            officerSearchForm.find(SubmitButton).simulate('click');
            expect(dispatchSpy).toHaveBeenCalledWith(getOfficerSearchResults({firstName: 'bubba joe', lastName: 'smith', district: 'First District'}));
        });
    });
});