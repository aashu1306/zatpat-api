const router = require("express").Router();
const authController = require("../controllers/AuthController");

/**
 * Login User
 */
router.post("/login", authController.loginUser)

/**
 * Login User
 */
router.get("/", authController.isUserLoggedIn, authController.getUsers)

/**
 * Login User
 */
router.post("/signup", authController.signUpUser)

module.exports = router;