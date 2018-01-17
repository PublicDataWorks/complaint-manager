import formatName from "./formatName";

describe('Name Formatter', () => {
    test("Name Formatter should take a full name and return lastname, first initial*period*", () => {
        expect(formatName("Hello", "Kitty")).toEqual("Kitty, H.")
    })
})
