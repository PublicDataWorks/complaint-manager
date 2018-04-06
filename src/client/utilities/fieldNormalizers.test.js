import {trimWhiteSpace} from "./fieldNormalizers";

describe("fieldNormalizers", () => {
    describe("trimWhiteSpace", () => {
        test("should return empty string if all spaces", () => {
            const normalizedValue = trimWhiteSpace("    ");
            expect(normalizedValue).toEqual("");
        });
        test("should return value with side white space removed", () => {
            const normalizedValue = trimWhiteSpace(" one two ");
            expect(normalizedValue).toEqual("one two");
        });

    });
});