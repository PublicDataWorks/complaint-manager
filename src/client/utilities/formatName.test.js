import formatCivilianName from "./formatCivilianName";

describe('Name Formatter', () => {
    test("should format first and last name", () => {
        const civilian = {firstName: "Hello", lastName: "Kitty"}
        expect(formatCivilianName(civilian)).toEqual("Hello Kitty")
    })
    
    test('should format middle initial', () => {
        const civilian = {firstName: "Hello", middleInitial:'M', lastName: "Kitty"}
        expect(formatCivilianName(civilian)).toEqual("Hello M. Kitty")
    })

    test('should format name with suffix', () => {
        const civilian = {firstName: "Hello", middleInitial:'M', lastName: "Kitty", suffix:'III'}
        expect(formatCivilianName(civilian)).toEqual("Hello M. Kitty III")
    })

    test('should handle nulls for middle and suffix', () => {
        const civilian = {firstName: "Hello", middleInitial: null, lastName: "Kitty", suffix: null}
        expect(formatCivilianName(civilian)).toEqual("Hello Kitty")
    })

    test('should handle undefined for middle and suffix', () => {
        const civilian = {firstName: "Hello", middleInitial: undefined, lastName: "Kitty", suffix: undefined}
        expect(formatCivilianName(civilian)).toEqual("Hello Kitty")
    })

    test('should handle empty string for middle and suffix', () => {
        const civilian = {firstName: "Hello", middleInitial: '', lastName: "Kitty", suffix: ''}
        expect(formatCivilianName(civilian)).toEqual("Hello Kitty")
    })

    test('should handle empty object', () => {
        const civilian = {}
        expect(formatCivilianName(civilian)).toEqual("")
    })

})