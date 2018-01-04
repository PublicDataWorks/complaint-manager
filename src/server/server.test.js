import app from './server'
import request from 'supertest'
const Sequelize = require('sequelize')
const models = require('./models')

const Op = Sequelize.Op

describe('server', () => {
    describe('GET /health-check', () => {
        test('should show healthy if db connection works', async () => {
            await request(app)
                .get('/health-check')
                .expect(200)
        })
    })

    describe('POST /cases', () => {
        afterEach(async () => {
            await models.cases.destroy({
                where: {
                    firstName: 'Manny',
                    lastName: 'Rodriguez'
                }
            })
        })

        test('should create a case', async () => {
            await request(app)
                .post('/cases')
                .set('Content-Header', 'application/json')
                .send({firstName: 'Manny', lastName: 'Rodriguez'})
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

    describe('GET /cases', () => {
        let seededCases

        beforeEach(async () => {
            seededCases = await models.cases.bulkCreate([{
                firstName: 'Robert',
                lastName: 'Pollard'
            },{
                firstName: 'Merrill',
                lastName: 'Garbus'
            }], {
                returning: true
            })
        })

        afterEach(async () => {
            const seededIds = seededCases.map(oneCase => oneCase.id)

            await models.cases.destroy({
                where: {
                    id: {
                        [Op.in]: seededIds
                    }
                }
            })
        })

        test('should get all cases', async () => {
            await request(app)
                .get('/cases')
                .set('Content-Header', 'application/json')
                .expect(200)
                .then(response => {
                    expect(response.body.cases).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                firstName: seededCases[0].firstName,
                                lastName: seededCases[0].lastName,
                                createdAt: seededCases[0].createdAt.toISOString(),
                                status: 'Initial'
                            }),
                            expect.objectContaining({
                                firstName: seededCases[1].firstName,
                                lastName: seededCases[1].lastName,
                                createdAt: seededCases[1].createdAt.toISOString(),
                                status: 'Initial'
                            })
                        ])
                    )
                })
        })

    })
})
