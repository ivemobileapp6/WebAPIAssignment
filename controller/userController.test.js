const request = require('supertest');
const app = require('../index'); // Import your app here
const userController = require('../controller/userController');
const userm = require('../model/userm');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

jest.mock('../model/userm');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn(),
  })),
}));
describe('userController', () => {
  const mockReq = (body) => ({
    body,
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  test('Error with invalid Google ID token', async () => {
    const req = mockReq({ id_token: 'invalid_id_token' });
    const res = mockRes();

    OAuth2Client.mockImplementation(() => ({
      verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid Google ID token')),
    }));

    await userController.authGoogle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid Google ID token' });
  });
});