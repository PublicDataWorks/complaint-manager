import nock from "nock";
import updateNarrative from "./updateNarrative";
import {updateNarrativeFailure, updateNarrativeSuccess} from "../actionCreators";
import getAccessToken from "../../auth/getAccessToken"
import {push} from "react-router-redux";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"))


describe('updateNarrative', () => {
    const dispatch = jest.fn()
    beforeEach(() => {
        dispatch.mockClear()
    })

    test('should dispatch success when narrative updated successfully', async () => {
        const dispatch = jest.fn()

        const updateDetails = {
            id: 1,
            narrative: 'Some case narrative'
        }

        const responseBody = {
            id: 1,
            narrative: 'Some case narrative'
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer TEST_TOKEN'
            }
        })
            .put(`/cases/${updateDetails.id}/narrative`,
                {narrative: updateDetails.narrative})
            .reply(200, responseBody)

        await updateNarrative(updateDetails)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(
            updateNarrativeSuccess(responseBody)
        )
    })

    test('should dispatch failure when narrative update fails', async () => {
        const updateDetails = {
            id: 1,
            narrative: 'Some case narrative'
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer TEST_TOKEN'
            }
        })
            .put(`/cases/${updateDetails.id}/narrative`,
                {narrative: updateDetails.narrative})
            .reply(500)

        await updateNarrative(updateDetails)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(updateNarrativeFailure())
    })

    test('should not dispatch success if unauthorized and redirect', async () => {
        const updateDetails = {
            id: 1,
            narrative: 'Some case narrative'
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer TEST_TOKEN'
            }
        })
            .put(`/cases/${updateDetails.id}/narrative`,
                {narrative: updateDetails.narrative})
            .reply(401)

        await updateNarrative(updateDetails)(dispatch)

        expect(dispatch).not.toHaveBeenCalledWith(updateNarrativeSuccess(updateDetails))
        expect(dispatch).toHaveBeenCalledWith(push(`/login`))

    })

    test('should redirect immediately if token missing', async () => {
        getAccessToken.mockImplementation(() => false)

        const updateDetails = {
            id: 1,
            narrative: 'Some case narrative'
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer false'
            }
        })
            .put(`/cases/${updateDetails.id}/narrative`,
                {narrative: updateDetails.narrative})
            .reply(200)

        await updateNarrative(updateDetails)(dispatch)

        expect(dispatch).not.toHaveBeenCalledWith(updateNarrative(updateDetails))
        expect(dispatch).toHaveBeenCalledWith(push(`/login`))
    })
})