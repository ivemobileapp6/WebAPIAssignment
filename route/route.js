const express = require("express")
const router = express.Router()
const catRoute = require('./cats.js')
const userRoute = require('./user.js')
const upload = require('../config/uploadPhotos.js')

router.get("/favourites/:id", catRoute);
// router.get("/getcat/:id", catRoute);
router.get("/cat", catRoute);
router.post("/cat", catRoute);
router.delete("/cat/:id", catRoute);
router.put("/cat/:id", catRoute);

router.get('/filmrecord/:keyword', catRoute)
router.post('/film', catRoute)
router.get('/film/:film', catRoute)
router.get('/list', catRoute)

router.post("/auth/google", userRoute)
router.put("/favourites", userRoute);
router.get('/user1', userRoute)
router.post('/auth', userRoute)
router.post('/apply', userRoute)
router.put('/update/:id', userRoute)

router.use((req, res, next) => {
  console.log('Invalid access~')
  res.status(404).send({ 'status': 404, 'description': 'Endpoint not found' })
})


module.exports = router

