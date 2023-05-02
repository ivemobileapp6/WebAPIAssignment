const express = require("express")
const router = express.Router()
const filmRoute = require('./cats.js')
const userRoute = require('./user.js')


router.get('/filmrecord/:keyword', filmRoute)
router.post('/film', filmRoute)
router.get('/film/:film', filmRoute)
router.get('/list', filmRoute)
router.get('/user1', userRoute)
router.post('/auth', userRoute)
router.post('/apply', userRoute)
router.put('/update/:id', userRoute)
router.delete('/removefilm/:id', filmRoute)
router.delete('/removeuser/:id', userRoute)
router.use((req, res, next) => {
  console.log('Invalid access~')
  res.status(404).send({ 'status': 404, 'description': 'Endpoint not found' })
})


module.exports = router

