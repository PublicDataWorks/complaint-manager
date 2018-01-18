import React from 'react'
import RootContainer from "./client/RootContainer";
import {mount} from "enzyme";
import {changeInput, retry} from "./testHelpers";
import {mockCreateCase, mockGetCases} from "./mockEndpoints";


describe('client-side user journey', () => {
    let existingCases, newCaseRequest, newCaseResponse, app

    beforeEach(() => {
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

        mockGetCases(existingCases);
        mockCreateCase(newCaseRequest, newCaseResponse)

        app = mount(<RootContainer/>)
    })

    test('should view existing cases', async () => {
        await retry(() => {
            expectCaseToBeVisible(app, 1, 'Pollard, R.')
        });
    })

    test('should create and view a new case', async () => {
        createCase(app, newCaseRequest);

        await retry(() => {
            expectCaseToBeVisible(app, 2, 'Hayder, S.')
            expectSnackbar(app, 'Case 2 was successfully created.');
        });
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

    const submitButton = app.find('button[data-test="submitCase"]')
    submitButton.simulate('click')
}
