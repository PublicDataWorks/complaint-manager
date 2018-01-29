import nock from "nock";
import updateNarrative from "./updateNarrative";
import {updateNarrativeFailure, updateNarrativeSuccess} from "../actionCreators";

test('should call API to update narrative', async () => {
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
            'Content-Type': 'application/json'
        }
    })
        .put(`/case/${updateDetails.id}/narrative`, updateDetails.narrative)
        .reply(201, responseBody)

    await updateNarrative(updateDetails)(dispatch)

    expect(dispatch).toHaveBeenCalledWith(
        updateNarrativeSuccess(responseBody)
    )
})

test('should handle case update failure', async () => {
    const dispatch = jest.fn()

    const updateDetails = {
        id: 1,
        narrative: 'Some case narrative'
    }

    nock('http://localhost', {
        reqheaders: {
            'Content-Type': 'application/json'
        }
    })
        .put(`/case/${updateDetails.id}/narrative`, updateDetails.narrative)
        .reply(500)

    await updateNarrative(updateDetails)(dispatch)

    expect(dispatch).toHaveBeenCalledWith(updateNarrativeFailure())
})