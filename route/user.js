const express = require("express")
const router = express.Router()
const controller1 = require("../controller/userController.js")
const Userm = require("../model/userm")
const verify = require("../route/verifyToken")

router.post("/auth/google", controller1.authGoogle);
router.put("/favourites", controller1.addFavoriteCat);
// router.get('/user1', controller1.getAllUser)
router.post('/apply', controller1.addUser)
router.post('/auth', controller1.auth)
// router.put('/update/:id', controller1.updateUser)

// router.delete('/removeuser/:id', verify, controller1.removeUser)
router.use((req, res, next) => {
  console.log('Invalid access~')
  res.status(404).send({ 'status': 404, 'description': 'Endpoint not found' })
})

module.exports = router

