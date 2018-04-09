import formatDate, {
    applyCentralTimeZoneOffset,
    applyTimeZone, formatDateForCSV,
    timeFromDateString
} from "./formatDate";

const expectedFormattedDate = 'Jan 31, 2018'

test('should format date appropriately when in YYYY-MM-DD format', () => {
    const dateString = '2018-01-31'
    const formattedDate = formatDate(dateString)

    expect(formattedDate).toEqual(expectedFormattedDate)
})

describe('format date', () => {
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
});

describe('time from dateString', () => {
    test('should extract time from date', () => {
        const otherDateString = new Date("2018-01-31T06:00Z").toUTCString()
        const time = timeFromDateString(otherDateString)
        const expectedTime = '12:00 AM CST'
        expect(time).toEqual(expectedTime)
    })

    test('should not extract time and return null when invalid date', () => {
        const otherDateString = null
        const time = timeFromDateString(otherDateString)
        const expectedTime = null
        expect(time).toEqual(expectedTime)
    })
});

describe('apply CST to dateString', () => {
    test('should apply central timezone offset', () => {
        const otherDateString = new Date("2018-01-31T06:00Z").toUTCString()
        const offsettedDatestring = applyCentralTimeZoneOffset(otherDateString)
        const expectedDateString = '2018-01-31T00:00:00-06:00'
        expect(offsettedDatestring).toEqual(expectedDateString)
    })
});

describe('apply timezone to time based on date', () => {
    test('should display timezone as CT when no date given', () => {
        const time = "17:00:00"
        const newTime = applyTimeZone(null, time)
        expect(newTime).toEqual("17:00 CT")
    })

    test('should display timezone as CST when needed', () => {
        const time = "17:00:00"
        const newTime = applyTimeZone("2018-01-01", time)
        expect(newTime).toEqual("17:00 CST")
    })

    test('should display timezone as CDT when needed', () => {
        const time = "17:00:00"
        const newTime = applyTimeZone("2018-05-01", time)
        expect(newTime).toEqual("17:00 CDT")
    })
});
