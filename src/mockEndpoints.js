import nock from "nock";

export const mockGetCases = (existingCases) => {
    return nock('http://localhost', {
        reqheaders: {
            'Content-Type': 'application/json'
        }
    })
        .persist()
        .get('/api/cases')
        .reply(200, {
            cases: existingCases
        })
}

export const mockCreateCase = (caseRequest, caseResponse) => {
    return nock('http://localhost', {
        reqheaders: {
            'Content-Type': 'application/json'
        }
    })
        .persist()
        .post('/api/cases', caseRequest)
        .reply(201, caseResponse)
}

export const mockGetUsers = (existingUsers) => {
    return nock('http://localhost', {
        reqheaders: {
            'Content-Type': 'application/json'
        }
    })
        .persist()
        .get('/api/users')
        .reply(200, {
            users: existingUsers
        })
}
