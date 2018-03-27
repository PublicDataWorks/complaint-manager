import nock from "nock";
import updateNarrative from "./updateNarrative";
import {updateNarrativeFailure, updateNarrativeSuccess} from "../../actionCreators/casesActionCreators";
import getAccessToken from "../../auth/getAccessToken"
import {push} from "react-router-redux";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"))


describe('updateNarrative', () => {
    const dispatch = jest.fn()
    const updateDetails = {
        id: 1,
        narrativeDetails: 'Some case narrative details',
        narrativeSummary: 'Some case narrative summary'
    }

    beforeEach(() => {
        dispatch.mockClear()
    })

    test('should dispatch success when narrative updated successfully', async () => {
        const dispatch = jest.fn()

        const responseBody = {
            id: 1,
            narrativeDetails: 'Some case narrative details',
            narrativeSummary: 'Some case narrative summary'
        }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer TEST_TOKEN'
            }
        })
            .put(`/api/cases/${updateDetails.id}/narrative`, {
                narrativeDetails: updateDetails.narrativeDetails,
                narrativeSummary: updateDetails.narrativeSummary
            })
            .reply(200, responseBody)

        await updateNarrative(updateDetails)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(
            updateNarrativeSuccess(responseBody)
        )
    })

    test('should dispatch failure when narrative update fails', async () => {
        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer TEST_TOKEN'
            }
        })
            .put(`/api/cases/${updateDetails.id}/narrative`, {
                narrativeDetails: updateDetails.narrativeDetails,
                narrativeSummary: updateDetails.narrativeSummary
            })
            .reply(500)

        await updateNarrative(updateDetails)(dispatch)

        expect(dispatch).toHaveBeenCalledWith(updateNarrativeFailure())
    })

    test('should not dispatch success if unauthorized and redirect', async () => {
        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer TEST_TOKEN'
            }
        })
            .put(`/api/cases/${updateDetails.id}/narrative`, {
                narrativeDetails: updateDetails.narrativeDetails,
                narrativeSummary: updateDetails.narrativeSummary
            })
            .reply(401)

        await updateNarrative(updateDetails)(dispatch)

        expect(dispatch).not.toHaveBeenCalledWith(updateNarrativeSuccess(updateDetails))
        expect(dispatch).toHaveBeenCalledWith(push(`/login`))

    })

    test('should redirect immediately if token missing', async () => {
        getAccessToken.mockImplementation(() => false)

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer false'
            }
        })
            .put(`/api/cases/${updateDetails.id}/narrative`, {
                narrativeDetails: updateDetails.narrativeDetails,
                narrativeSummary: updateDetails.narrativeSummary
            })
            .reply(200)

        await updateNarrative(updateDetails)(dispatch)

        expect(dispatch).not.toHaveBeenCalledWith(updateNarrative(updateDetails))
        expect(dispatch).toHaveBeenCalledWith(push(`/login`))
    })
})