import sortAlphabeticallyByProperty from "./sortAlphabeticallyByProperty";

describe('', () => {
    let unsortedUsers

    beforeEach(() => {
        unsortedUsers = [
            {
                id: 100,
                firstName: 'Fachtna',
                lastName: 'Bogdan',
                email: 'fbogdan@gmail.com',
                createdAt: new Date(2015, 7, 25).toISOString()
            },
            {
                id: 101,
                firstName: "Mauritius",
                lastName: "Stanko",
                email: "mstanko@gmail.com",
                createdAt: new Date(2015, 7, 25).toISOString()
            },
            {
                id: 500,
                firstName: 'Talin',
                lastName: 'Guus',
                email: 'tguus@gmail.com',
                createdAt: new Date(2016, 7, 25).toISOString()
            }
        ]

    })

    test('should sort objects alphabetically by existing property', () => {
        const sortedUsers = [
            {
                id: 100,
                firstName: 'Fachtna',
                lastName: 'Bogdan',
                email: 'fbogdan@gmail.com',
                createdAt: new Date(2015, 7, 25).toISOString()
            },
            {
                id: 500,
                firstName: 'Talin',
                lastName: 'Guus',
                email: 'tguus@gmail.com',
                createdAt: new Date(2016, 7, 25).toISOString()
            },
            {
                id: 101,
                firstName: "Mauritius",
                lastName: "Stanko",
                email: "mstanko@gmail.com",
                createdAt: new Date(2015, 7, 25).toISOString()
            }
        ]

        const result = sortAlphabeticallyByProperty(unsortedUsers, 'lastName')

        expect(result).toEqual(sortedUsers)
    })

    test('should return unsorted lsit when trying to sort by non-existing property', () => {
        const result = sortAlphabeticallyByProperty(unsortedUsers, 'happiness')

        expect(result).toEqual(unsortedUsers)
    });

});
