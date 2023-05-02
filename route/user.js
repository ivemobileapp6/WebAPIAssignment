const express = require("express")
const router = express.Router()
const controller1 = require("../controller/usercontroller.js")
const Userm = require("../model/Userm")
const verify = require("../route/verifyToken")

router.get('/userlist', controller1.getAllUser)
router.post('/register', controller1.addUser)
router.post('/auth', controller1.auth)
router.put('/update/:id', verify, controller1.updateUser)
router.delete('/removeuser/:id', verify, controller1.removeUser)
router.use((req, res, next) => {
  console.log('Invalid access~')
  res.status(404).send({ 'status': 404, 'description': 'Endpoint not found' })
})

module.exports = router

