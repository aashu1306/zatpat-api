const router = require("express").Router();
const authController = require("../controllers/AuthController");
const retailerController = require("../controllers/RetailerController");

/**
 * Add Retailer
 */
router.post("/", authController.isUserLoggedIn, retailerController.addRetailer)

/**
 * Get Retailers
 */
router.get("/", authController.isUserLoggedIn, retailerController.getRetailers)

/**
 * Get Retailer Details
 */
router.get("/:retailer_id", authController.isUserLoggedIn, retailerController.getRetailerDetails)

/**
 * update Retailers
 */
router.patch("/:retailer_id", authController.isUserLoggedIn, retailerController.updateRetailers)

/**
 * Delete Retailers
 */
router.delete("/:retailer_id", authController.isUserLoggedIn, retailerController.deleteRetailers)

module.exports = router;