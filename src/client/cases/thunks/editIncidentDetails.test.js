import {push} from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import editIncidentDetails from "./editIncidentDetails";
import nock from "nock";
import {updateIncidentDetailsFailure, updateIncidentDetailsSuccess} from "../../actionCreators/casesActionCreators";

jest.mock("../../auth/getAccessToken")

describe('editIncidentDetails', () => {
    const dispatch = jest.fn()
    const closeDialogCallback = jest.fn()

    beforeEach(() => {
        dispatch.mockClear()
    })

    test('should redirect immediately if token missing', async () => {

        getAccessToken.mockImplementationOnce(() => false)
        await editIncidentDetails()(dispatch)

        expect(dispatch).toHaveBeenCalledWith(push(`/login`))
    })

    test('should dispatch success and close dialog when incident is successfully edited', async () => {
        const updateDetails = {
            id: 17,
            firstContactDate: new Date(),
            incidentDate: new Date(),
            incidentTime: '16:00:00',
        }

        const response = {}
        getAccessToken.mockImplementationOnce(() => 'TEST_TOKEN')

        nock('http://localhost', {
            'Content-Type': 'application/json',
            'Authorization': `Bearer TEST_TOKEN`
        })
            .put(`/api/cases/${updateDetails.id}`, JSON.stringify(updateDetails))
            .reply(200, response)

        await editIncidentDetails(updateDetails, closeDialogCallback)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(updateIncidentDetailsSuccess(response))
        expect(closeDialogCallback).toHaveBeenCalled()
    })

    test('should dispatch failure when edit case fails', async () => {
        getAccessToken.mockImplementationOnce(() => 'TEST_TOKEN')

        const updateDetails = {
            id: 17,
            firstContactDate: '2018-04-01',
            incidentDate: '2018-04-01',
            incidentTime: '16:00:00',
        }

        nock('http://localhost', {
            'Content-Type': 'application/json',
            'Authorization': `Bearer TEST_TOKEN`
        })
            .put(`/api/cases/${updateDetails.id}`, JSON.stringify(updateDetails))
            .reply(500)

        await editIncidentDetails(updateDetails, closeDialogCallback)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(updateIncidentDetailsFailure())

    })

    test('should redirect to login on unauthorized response', async () => {
        getAccessToken.mockImplementationOnce(() => 'TEST_TOKEN')

        const updateDetails = {
            id: 17,
            firstContactDate: '2018-04-01',
            incidentDate: '2018-04-01',
            incidentTime: '16:00:00',
        }

        nock('http://localhost', {
            'Content-Type': 'application/json',
            'Authorization': `Bearer TEST_TOKEN`
        })
            .put(`/api/cases/${updateDetails.id}`, JSON.stringify(updateDetails))
            .reply(401)

        await editIncidentDetails(updateDetails, closeDialogCallback)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(push('/login'))
    })

    test('should dispatch failure on error', async () => {
        getAccessToken.mockImplementationOnce(() => { throw new Error() })

        await editIncidentDetails()(dispatch)

        expect(dispatch).toHaveBeenCalledWith(updateIncidentDetailsFailure())
    })
});
