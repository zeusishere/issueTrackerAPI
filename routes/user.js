const express = require("express");
const router = express.Router();
let userController = require("../controller/user");
// post method
router.post("/sign-in", userController.signInUser);
// post method
router.post("/sign-up", userController.createUser);
module.exports = router;
