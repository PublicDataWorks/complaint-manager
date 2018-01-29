import React from 'react'
import RootContainer from "./client/RootContainer";
import {mount} from "enzyme";
import {changeInput, retry} from "./testHelpers";
import {mockCreateCase, mockGetCases, mockGetUsers} from "./mockEndpoints";


function expectUserToBeVisible(app, id, name) {
    app.update()
    const userRow = app.find(`tr[data-test="userRow${id}"]`)
    expect(userRow.text()).toContain(name)
}

describe('client-side user journey', () => {
    let existingCases, newCaseRequest, newCaseResponse, existingUsers, app

    beforeAll(() => {
        existingCases = [{
            id: 1,
            firstName: 'Robert',
            lastName: 'Pollard',
            phoneNumber: "8201387432",
            email: 'rpollard@gmail.com',
            complainantType: 'Civilian',
            status: 'Initial',
            createdAt: '2018-01-17T22:00:20.796Z'
        }]
        newCaseRequest = {
            firstName: 'Serafin',
            lastName: 'Hayder',
            phoneNumber: "8201334872",
            email: 'shayder@gmail.com',
            complainantType: 'Civilian'
        }
        newCaseResponse = {
            ...newCaseRequest,
            id: 2,
            status: 'Initial',
            createdAt: '2018-01-17T22:00:20.796Z'
        }
        existingUsers = [{
            id: 100,
            firstName: 'Eleanor',
            lastName: 'Schellstrop',
            email: 'eschell@gmail.com',
            createdAt: new Date(2015, 7, 25).toISOString()
        }]

        mockGetCases(existingCases);
        mockCreateCase(newCaseRequest, newCaseResponse)
        mockGetUsers(existingUsers)

        app = mount(<RootContainer/>)
    })

    afterAll(() => {
        nock.clearAll()
    })

    test('should view existing cases', async () => {
        await retry(() => {
            expectCaseToBeVisible(app, 1, 'Pollard, R.')
        });
    })

    test.skip('should create and view a new case', async () => {
        createCase(app, newCaseRequest);

        await retry(() => {
            expectCaseToBeVisible(app, 2, 'Hayder, S.')
            expectSnackbar(app, 'Case 2 was successfully created.');
        });
    })

    test('should navigate to admin page and view existing users', async () => {
        navigateToUserDashboard(app);

        await retry(() => {
            expectUserToBeVisible(app, 100, 'Eleanor Schellstrop');
        })
    })
})

const expectCaseToBeVisible = (app, id, formattedName) => {
    app.update()
    const caseRow = app.find(`tr[data-test="caseRow${id}"]`)
    expect(caseRow.text()).toContain(formattedName)
}

const expectSnackbar = (app, message) => {
    app.update()
    const snackbarMessage = app.find('[data-test="creationSnackbarBannerText"]');
    expect(snackbarMessage.text()).toEqual(message)
}

const createCase = (app, newCase) => {
    const createCaseButton = app.find('button[data-test="createCaseButton"]')
    createCaseButton.simulate('click')

    changeInput(app, 'input[data-test="firstNameInput"]', newCase.firstName);
    changeInput(app, 'input[data-test="lastNameInput"]', newCase.lastName);
    changeInput(app, 'input[data-test="phoneNumberInput"]', newCase.phoneNumber);
    changeInput(app, 'input[data-test="emailInput"]', newCase.email);

    const submitButton = app.find('LinkButton[data-test="createCaseOnly"]')
    submitButton.simulate('click')
}

const navigateToUserDashboard = (app) => {
    const gearButton = app.find('button[data-test="gearButton"]')
    gearButton.simulate('click')

    const adminLink = app.find('a[data-test="adminButton"]')
    adminLink.simulate('click', {button: 0})
}