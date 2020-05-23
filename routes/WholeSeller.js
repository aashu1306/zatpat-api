const router = require("express").Router();
const authController = require("../controllers/AuthController");
const wholesellerController = require("../controllers/WholeSellerController");

/**
 * Add Whole Seller
 */
router.post("/", authController.isUserLoggedIn, wholesellerController.addWholeSellers)

/**
 * Get Whole Sellers
 */
router.get("/", authController.isUserLoggedIn, wholesellerController.getWholeSellers)

/**
 * Get Whole Seller Details
 */
router.get("/:wholeseller_id", authController.isUserLoggedIn, wholesellerController.getWholeSellerDetails)

/**
 * update Whole Sellers
 */
router.patch("/:wholeseller_id", authController.isUserLoggedIn, wholesellerController.updateWholeSellers)

/**
 * Delete Whole Sellers
 */
router.delete("/:wholeseller_id", authController.isUserLoggedIn, wholesellerController.deleteWholeSellers)

module.exports = router;