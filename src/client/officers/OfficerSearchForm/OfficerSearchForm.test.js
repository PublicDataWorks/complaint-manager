import React from "react";
import {shallow} from "enzyme";
import {OfficerSearchForm} from "./OfficerSearchForm";
import {SubmitButton} from "../../sharedComponents/StyledButtons";

describe("OfficerSearchForm", () => {
    describe("submit button", () => {
        test("submit button should be disabled when form is not valid", () => {
            const searchForm = shallow(<OfficerSearchForm handleSubmit={() => {}} invalid={true} />);
            const submitButton = searchForm.find(SubmitButton);
            expect(!!submitButton.disabled).toBeTruthy;
        });

        test("submit button should be enabled when form is valid", () => {
            const searchForm = shallow(<OfficerSearchForm handleSubmit={() => {}} invalid={false} />);
            const firstNameField = searchForm.find("[data-test='firstNameField']").first();
            firstNameField.simulate('change', {target: 'emma'});
            const submitButton = searchForm.find(SubmitButton);
            expect(!!submitButton.disabled).toBeFalsy();
        });
    });
});