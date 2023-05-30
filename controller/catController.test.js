const request = require('supertest');
const express = require('express');
const catController = require('./catController');
const catsm = require("../model/catsm")
const userm = require("../model/userm")
const catsphotpm = require("../model/catsphotom")

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes for testing
app.post('/addCat', catController.addCat);
app.get('/getCatById/:id', catController.getCatById);
app.put('/updateCatById/:id', catController.updateCatById);
app.get('/getAllCats', catController.getAllCats);
app.delete('/removeCat/:id', catController.removeCat);
app.post('/addPhoto', catController.addPhoto);

// Add any additional routes for testing

// Mock the database models
jest.mock('../model/catsm');
jest.mock('../model/userm');

describe('catController', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch all cats', async () => {
    const cats = [{ _id: '1', age: 2, breed: 'Bengal', gender: 'male', description: 'Friendly' }];
    catsm.find.mockResolvedValue(cats);

    const response = await request(app).get('/getAllCats');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(cats);
  });

  // test('Add a cat', async () => {
  //   const cat = {
  //     age: 2,
  //     breed: 'Bengal',
  //     gender: 'male',
  //     description: 'A beautiful cat',
  //     photos: [],
  //     createdAt: Date.now(),
  //   };

  //   catsm.mockReturnValue(cat);
  //   catsm.prototype.save = jest.fn().mockResolvedValue(cat);

  //   const response = await request(app).post('https://webapiassignment.ivemobileapp6.repl.co/cat').send(cat);
  //   expect(response.status).toBe(201);
  //   expect(response.body).toEqual({ success: true, data: cat });
  // });

  test('should fetch cat by user ID', async () => {
  const userId = '1';
  const user = {
    _id: userId,
    favourites: ['2'],
  };
  const cat = {
    _id: '2',
    age: 2,
    breed: 'Bengal',
    gender: 'male',
    description: 'Friendly',
  };

  userm.findById.mockResolvedValue(user);
  catsm.find.mockResolvedValue([cat]);

  const response = await request(app).get(`/getCatById/${userId}`);
  expect(response.status).toEqual(200);
  expect(response.body).toEqual([cat]);
});

test('should return 404 when user not found', async () => {
  const userId = '1';

  userm.findById.mockResolvedValue(null);

  const response = await request(app).get(`/getCatById/${userId}`);
  expect(response.status).toEqual(404);
  expect(response.body).toEqual({ message: 'User not found' });
});

test('should return 500 on error', async () => {
  const userId = '1';

  userm.findById.mockRejectedValue(new Error('Internal server error'));

  const response = await request(app).get(`/getCatById/${userId}`);
  expect(response.status).toEqual(500);
  expect(response.body).toEqual({ message: 'Internal server error' });
});

  test('should remove cat by ID', async () => {
  const catId = '2';

  catsm.findByIdAndDelete.mockResolvedValue({ _id: catId });

  const response = await request(app).delete(`/removeCat/${catId}`);
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({ "Success": 'Removed a cat' });
});

test('should return 404 when cat not found', async () => {
  const catId = '2';

  catsm.findByIdAndDelete.mockResolvedValue(null);

  const response = await request(app).delete(`/removeCat/${catId}`);
  expect(response.status).toEqual(404);
  expect(response.body).toEqual({ status: "Failed", message: "Cat not found" });
});

test('should return 400 on error', async () => {
  const catId = '2';

  catsm.findByIdAndDelete.mockRejectedValue(new Error('Bad request error'));

  const response = await request(app).delete(`/removeCat/${catId}`);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({ status: "Failed", msg: "Failed to remove cat" });
});

});