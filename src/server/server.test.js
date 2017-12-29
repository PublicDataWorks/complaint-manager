import app from './server'
import request from 'supertest'

describe('server', () => {
    describe('GET /health-check', () => {
        test('should show healthy if db connection works', async () => {
            await request(app)
            .get('/health-check')
            .expect(200)
        })
    })

    describe('POST /cases', () => {
        test('should create a case', async () => {
            await request(app)
            .post('/cases')
            .set('Content-Header', 'application/json')
            .send({ firstName: 'Manny', lastName: 'Rodriguez' })
            .expect(201)
            .then(response => {
                expect(response.body.id).not.toBeUndefined()
                expect(response.body.firstName).toEqual('Manny')
                expect(response.body.lastName).toEqual('Rodriguez')
                expect(response.body.status).toEqual('Initial')
                expect(response.body.createdAt).not.toBeUndefined()
            })
        })
    })
})
