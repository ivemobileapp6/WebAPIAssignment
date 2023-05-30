const express = require("express")
const router = express.Router()
const controller1 = require("../controller/userController.js")


router.post("/auth/google", controller1.authGoogle);
router.put("/favourites", controller1.addFavoriteCat);
router.post('/apply', controller1.addUser)
router.post('/auth', controller1.auth)

router.use((req, res, next) => {
  console.log('Invalid access~')
  res.status(404).send({ 'status': 404, 'description': 'Endpoint not found' })
})

module.exports = router

