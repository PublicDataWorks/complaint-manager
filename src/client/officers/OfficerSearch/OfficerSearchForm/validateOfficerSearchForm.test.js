import validateOfficerSearchForm from "./validateOfficerSearchForm";

describe("validateOfficerSearchForm", () => {
    test("should return error on first name and last name and district if all blank", () => {
        const values = {};
        const actualErrors = validateOfficerSearchForm(values);
        const expectedErrors = {
            firstName: "Please complete at least one field",
            lastName: "Please complete at least one field",
            district: "Please complete at least one field"
        };
        expect(actualErrors).toEqual(expectedErrors);
    });

    test("should return no errors if one present with enough characters", () => {
        const values = {firstName: 'pickles'};
        const actualErrors = validateOfficerSearchForm(values);
        const expectedErrors = {};
        expect(actualErrors).toEqual(expectedErrors);
    });

    test("should return no errors if district present", () => {
        const values = {district: '8th District'};
        const actualErrors = validateOfficerSearchForm(values);
        const expectedErrors = {};
        expect(actualErrors).toEqual(expectedErrors);
    });

    test("should return error on first name field if first name less than 2 chars", () => {
        const values = {firstName: 'a'};
        const actualErrors = validateOfficerSearchForm(values);
        const expectedErrors = {firstName: "Please enter at least two characters"};
        expect(actualErrors).toEqual(expectedErrors);
    });

    test("should return error on last name field if last name less than 2 chars", () => {
        const values = { lastName: 'a'};
        const actualErrors = validateOfficerSearchForm(values);
        const expectedErrors = {lastName: "Please enter at least two characters"};
        expect(actualErrors).toEqual(expectedErrors);
    });

    test("should return error on first name and last name if both present and less than 2 chars", () => {
        const values = {firstName: 'a', lastName: 'a'};
        const actualErrors = validateOfficerSearchForm(values);
        const expectedErrors = {firstName: "Please enter at least two characters", lastName: "Please enter at least two characters"};
        expect(actualErrors).toEqual(expectedErrors);
    });

    test("should return error when less than two characters excluding whitespace present", () => {
        const values = {firstName: 'a '}
        const actualErrors = validateOfficerSearchForm(values)
        const expectedErrors = {firstName: "Please enter at least two characters"}
        expect(actualErrors).toEqual(expectedErrors)
    } )

});