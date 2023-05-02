const express = require("express");
const router = express.Router();
const controller = require("../controller/catController.js");
const authController = require("../controller/authController.js");
const verify = require("../route/verifyToken");

// Charity worker registration and login
router.post("/register", authController.registerCharityWorker);
router.post("/login", authController.loginCharityWorker);

// Cat management (add, remove, update) for charity workers
router.post("/cat", verify, controller.addCat);
router.get("/cat/:id", verify, controller.getCat); 
router.put("/cat/:id", verify, controller.updateCat); //<--
router.delete("/cat/:id", verify, controller.removeCat);

// Public access to cat listings
router.get("/cats", controller.getAllCats);
router.get("/search/:keyword", controller.searchCats);   //<---

// Invalid access
router.use((req, res, next) => {
  console.log("Invalid access~");
  res.status(404).send({ status: 404, description: "Endpoint not found" });
});

module.exports = router;