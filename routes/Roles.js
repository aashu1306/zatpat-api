const router = require("express").Router();
const controller = require("../controllers/RoleController");
const authController = require("../controllers/AuthController");

/**
 * Create New Role
 */
router.post("/", authController.isUserLoggedIn, controller.addRole)

/**
 * Get All Roles
 */
router.get("/", authController.isUserLoggedIn, controller.getRoles)

/**
 * Delete Role
 */
router.delete("/:role_id", authController.isUserLoggedIn, controller.deleteRole)

module.exports = router;