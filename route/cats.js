const express = require("express");
const router = express.Router();
const controller = require("../controller/catController.js");
// const authController = require("../controller/authController.js");
const verify = require("../route/verifyToken");
const upload = require('../config/uploadPhotos.js')

// Charity worker registration and login
// router.post("/register", authController.registerCharityWorker);
// router.post("/login", authController.loginCharityWorker);
router.post("/catphoto", upload.single('photo'), controller.addPhoto);
// Cat management (add, remove, update) for charity workers
router.post("/addcat",  upload.single('photo'), controller.addCat);
router.get("/getcat/:id", controller.getCatById); 
// router.put("/cat/:id", verify, controller.updateCat); //<--
router.delete("/cat/:id", verify, controller.removeCat);

// Public access to cat listings
router.get("/cats", controller.getAllCats);
// router.get("/search/:keyword", controller.searchCats);   //<---

// Invalid access
router.use((req, res, next) => {
  console.log("Invalid access~");
  res.status(404).send({ status: 404, description: "Endpoint not found" });
});

module.exports = router;