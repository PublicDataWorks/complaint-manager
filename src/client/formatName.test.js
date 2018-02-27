import formatName from "./formatName";

describe('Name Formatter', () => {
    test("should format first and last name", () => {
        const primaryComplainant = {firstName: "Hello", lastName: "Kitty"}
        expect(formatName(primaryComplainant)).toEqual("Hello Kitty")
    })
    
    test('should format middle initial', () => {
        const primaryComplainant = {firstName: "Hello", middleInitial:'M', lastName: "Kitty"}
        expect(formatName(primaryComplainant)).toEqual("Hello M. Kitty")
    })

    test('should format name with suffix', () => {
        const primaryComplainant = {firstName: "Hello", middleInitial:'M', lastName: "Kitty", suffix:'III'}
        expect(formatName(primaryComplainant)).toEqual("Hello M. Kitty III")
    })

    test('should handle nulls for middle and suffix', () => {
        const primaryComplainant = {firstName: "Hello", middleInitial: null, lastName: "Kitty", suffix: null}
        expect(formatName(primaryComplainant)).toEqual("Hello Kitty")
    })

    test('should handle undefined for middle and suffix', () => {
        const primaryComplainant = {firstName: "Hello", middleInitial: undefined, lastName: "Kitty", suffix: undefined}
        expect(formatName(primaryComplainant)).toEqual("Hello Kitty")
    })

    test('should handle empty string for middle and suffix', () => {
        const primaryComplainant = {firstName: "Hello", middleInitial: '', lastName: "Kitty", suffix: ''}
        expect(formatName(primaryComplainant)).toEqual("Hello Kitty")
    })

})