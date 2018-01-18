import nock from "nock";

export const mockGetCases = (existingCases) => (
    nock('http://localhost', {
        reqheaders: {
            'Content-Type': 'application/json'
        }
    })
        .get('/cases')
        .reply(200, {
            cases: existingCases
        })
)

export const mockCreateCase = (caseRequest, caseResponse) => (
    nock('http://localhost', {
        reqheaders: {
            'Content-Type': 'application/json'
        }
    })
        .post('/cases', caseRequest)
        .reply(201, caseResponse)
)