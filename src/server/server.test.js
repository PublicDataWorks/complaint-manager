import app from './server'
import request from 'supertest'

describe('server', function () {
  describe('/health-check', function () {
    test('should show healthy if db connection works', async () => {
      await request(app)
        .get('/health-check')
        .expect(200)
    })
  });
});
