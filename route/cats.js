const express = require("express");
const router = express.Router();
const controller = require("../controller/catController.js");
const verify = require("../route/verifyToken");
const upload = require('../config/uploadPhotos.js')


router.get("/favourites/:id", controller.getCatById);
router.get("/cat", controller.getAllCats);
router.post("/cat", upload.single('photos'), controller.addCat);
router.put("/cat/:id", upload.single('photos'), controller.updateCatById);
router.delete("/cat/:id", controller.removeCat);
router.post("/catphoto", upload.single('photo'), controller.addPhoto);
router.get("/cats", controller.getAllCats);

router.use((req, res, next) => {
  console.log("Invalid access~");
  res.status(404).send({ status: 404, description: "Endpoint not found" });
});

module.exports = router;