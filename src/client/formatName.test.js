import formatName from "./formatName";

describe('Name Formatter', () => {
    test("Name Formatter should take a full name and return lastname, first initial*period*", () => {
        const primaryComplainant = {firstName: "Hello", lastName: "Kitty"}

        expect(formatName(primaryComplainant)).toEqual("Kitty, H.")
    })
})
