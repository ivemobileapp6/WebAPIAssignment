const request = require('supertest');
const { app } = require('./index');

describe('Test endpoints', () => {
  it('should respond with 200 for a valid GET request', async () => {
    const response = await request(app).get('/getcat');
    expect(response.status).toBe(200);
  });
});
