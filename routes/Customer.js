const router = require("express").Router();
const auth = require("../controllers/AuthController");
const customer = require("../controllers/CustomerController");

/**
 * Add Customer
 */
router.post("/", auth.isUserLoggedIn, customer.addCustomer)

/**
 * Get Customers
 */
router.get("/", auth.isUserLoggedIn, customer.getCustomers)

/**
 * Get Customer Details
 */
router.get("/:customer_id", auth.isUserLoggedIn, customer.getCustomerDetails)

/**
 * update Customers
 */
router.patch("/:customer_id", auth.isUserLoggedIn, customer.updateCustomer)

/**
 * Delete Customers
 */
router.delete("/:customer_id", auth.isUserLoggedIn, customer.deleteCustomer)

module.exports = router;