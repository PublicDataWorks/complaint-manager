import formatDate from "./formatDate";

const expectedFormattedDate = 'Jan 31, 2018'

test('should format date appropriately when in YYYY-MM-DD format', () => {
    const dateString = '2018-01-31'
    const formattedDate = formatDate(dateString)

    expect(formattedDate).toEqual(expectedFormattedDate)
})

test('should format date appropriately when in ISO format', () => {
    const dateString = new Date("2018-01-31").toISOString()
    const formattedDate = formatDate(dateString)

    expect(formattedDate).toEqual(expectedFormattedDate)
})

test('should format date appropriately when in UTC format', () => {
    const dateString = new Date("2018-01-31").toUTCString()
    const formattedDate = formatDate(dateString)

    expect(formattedDate).toEqual(expectedFormattedDate)
})

test('should format date appropriately as a Locale Date String', () => {
    const dateString = new Date("2018-01-31").toLocaleDateString()
    const formattedDate = formatDate(dateString)

    expect(formattedDate).toEqual(expectedFormattedDate)
})
test('should format date appropriately when in a different format', () => {
    const dateString = new Date("2018-01-31").toDateString()
    const formattedDate = formatDate(dateString)

    expect(formattedDate).toEqual(expectedFormattedDate)
})