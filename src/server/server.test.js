import app from './server'
import request from 'supertest'

describe('server', function () {
  describe('/cases', function () {
    test.skip('should create a case', async () => {
      await request(app)
        .post('/cases')
        .send({firstName: 'Manny', lastName: 'Cat'})
        .expect(200)
    })
  });
});
