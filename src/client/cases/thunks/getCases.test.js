import nock from "nock";
import {getCasesSuccess} from "../actionCreators";
import getCases from "./getCases";

describe('getCases', () => {

    test('should call API to get all cases', async () => {
        const dispatch = jest.fn()
        const responseBody = { cases: ['a case'] }

        nock('http://localhost', {
            reqheaders: {
                'Content-Type': 'application/json'
            }
        })
            .get('/cases')
            .reply(200, responseBody)

        await getCases()(dispatch)

        expect(dispatch).toHaveBeenCalledWith(getCasesSuccess(responseBody.cases))
    })
})