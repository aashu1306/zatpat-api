const Retailer = require("../models/retailer")
const Customer = require("../models/customer")
const { check, validationResult } = require("express-validator");
const { catchAsync } = require("../utils/Helper")

Retailer.hasMany(Customer, { foreignKey: { name: 'customer_retailer_id' } });

const tableKeys = ["name", "email", "mobile", "aadhar_no", "details"]

/**
 * Get All Customers
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} Customers Data Object
 */
module.exports.getCustomers = catchAsync(async (req, res, next) => {
    const customers = await Customer.findAll({ where: { customer_retailer_id: req.user_id } })
    return res.status(200).json({
        success: true,
        status: "success",
        customers,
        message: "Customers fetched succesfully"
    });
})

/**
 * Get Customer Details
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} Customer Data Object
 */
module.exports.getCustomerDetails = catchAsync(async (req, res, next) => {
    const customer = await Customer.findOne({ where: { customer_id: req.params.customer_id } })
    return res.status(200).json({
        success: true,
        status: "success",
        customer,
        message: "Customer fetched succesfully"
    });
})

/**
 * Create Customer
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} Created Customer Data
 */
module.exports.addCustomer = catchAsync(async (req, res, next) => {
    /**
	 * Validate Input Data
	 */
    await check("name", "Name Is Required").exists().run(req);
    await check("email", "Email Id Is Required").exists().run(req);
    await check("email", "Email Id Is Not Valid").isEmail().run(req);
    await check("mobile", "Contact Number Is Required").exists().run(req);
    await check("mobile", "Contact Number Is not valid").isNumeric().run(req);
    await check("aadhar_no", "Aadhar number is required").exists().run(req);
    await check("aadhar_no", "Aadhar number is not valid").isNumeric().run(req);
    await check("status", "Account Active Status Is Required").exists().run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(422).json({ status: "fail", success: false, errors: result.array() });
    await Customer.create({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        aadhar_no: req.body.aadhar_no,
        status: req.body.status,
        details: req.body.details,
        customer_retailer_id: req.user_id,
    })
    return res.status(201).json({
        success: true,
        status: "success",
        message: `Customer created succesfully`
    });
})

/**
 * Update Customer
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} Updated Customer Data
 */
module.exports.updateCustomer = catchAsync(async (req, res, next) => {
    custmorData = {}
    /** Data Prepare */
    if (req.body.name) {
        custmorData['name'] = req.body.name
    }
    if (req.body.email) {
        custmorData['email'] = req.body.email
    }
    if (req.body.mobile) {
        custmorData['mobile'] = req.body.mobile
    }
    if (req.body.status) {
        custmorData['status'] = req.body.status
    }
    if (req.body.details) {
        custmorData['details'] = req.body.details
    }
    if (req.body.aadhar_no) {
        custmorData['aadhar_no'] = req.body.aadhar_no
    }
    await Customer.update(custmorData, { where: { customer_id: req.params.customer_id } })
    return res.status(200).json({
        success: true,
        status: "success",
        message: `Customer updated succesfully`
    });
})

/**
 * Delete Customer
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 */
module.exports.deleteCustomer = catchAsync(async (req, res, next) => {
    await Customer.destroy({ where: { customer_id: req.params.customer_id } })
    return res.status(200).json({
        success: true,
        status: "success",
        message: `Customer Deleted Successfully`
    });
})