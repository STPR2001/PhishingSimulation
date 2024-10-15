const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth/AuthController");
const VerifyTokenController = require("../controllers/auth/VerifyToken");

router.post("/login", AuthController.user_login);
router.post("/create", AuthController.user_create);

module.exports = router;
