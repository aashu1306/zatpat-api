const DataBase = require("../models/index")
const Retailer = require("../models/retailer")
const WholeSeller = require("../models/wholeseller")
const UserRoles = require("../models/user_roles")
const User = require("../models/user")
const { check, validationResult } = require("express-validator");
const { catchAsync } = require("../utils/Helper")

User.hasOne(Retailer, { foreignKey: { name: 'retailer_id' } });
WholeSeller.hasMany(Retailer, { foreignKey: { name: 'retailer_wholeseller_id' } });

const tableKeys = ["name", "email", "mobile", "aadhar_no", "details"]

/**
 * Get All Retailers
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} Retailers Data Object
 */
module.exports.getRetailers = catchAsync(async (req, res, next) => {
    const retailers = await Retailer.findAll({ where: { retailer_wholeseller_id: req.user_id } })
    return res.status(200).json({
        success: true,
        status: "success",
        retailers,
        message: "Retailers fetched succesfully"
    });
})

/**
 * Get Retailer Details
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} Retailers Data Object
 */
module.exports.getRetailerDetails = catchAsync(async (req, res, next) => {
    const retailer = await Retailer.findOne({ where: { retailer_id: req.params.retailer_id } })
    return res.status(200).json({
        success: true,
        status: "success",
        retailer,
        message: "Retailer fetched succesfully"
    });
})

/**
 * Create Retailer
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} Created Retailer Data
 */
module.exports.addRetailer = async (req, res, next) => {
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

    const transaction = await DataBase.transaction();
    try {
        let userData = {
            email: req.body.email,
            first_name: req.body.name,
            mobile: req.body.mobile,
            password: req.body.mobile,
            status: req.body.status,
        };
        const user = await User.create(userData, { transaction })

        let retailerData = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            aadhar_no: req.body.aadhar_no,
            status: req.body.status,
            details: req.body.details,
            retailer_id: user.id,
            retailer_wholeseller_id: req.user_id,
        }
        const retailer = await Retailer.create(retailerData, { transaction })
        const userRoles = await UserRoles.create({ userId: user.id, roleId: 3 }, { transaction })
        await transaction.commit()
        return res.status(201).json({
            success: true,
            status: "success",
            message: `Retailer created succesfully`
        });
    } catch (error) {
        transaction.rollback()
        next(error)
    }
}

/**
 * Update Retailer
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} Updated Retailer Data
 */
module.exports.updateRetailers = async (req, res, next) => {
    let userData = {}, retailerData = {}
    /** Data Prepare */
    if (req.body.name) {
        userData['first_name'] = req.body.name
        retailerData['name'] = req.body.name
    }
    if (req.body.email) {
        userData['email'] = req.body.email
        retailerData['email'] = req.body.email
    }
    if (req.body.mobile) {
        userData['mobile'] = req.body.mobile
        retailerData['mobile'] = req.body.mobile
    }
    if (req.body.status) {
        userData['status'] = req.body.status
        retailerData['status'] = req.body.status
    }
    if (req.body.details) {
        retailerData['details'] = req.body.details
    }
    if (req.body.aadhar_no) {
        retailerData['aadhar_no'] = req.body.aadhar_no
    }
    const transaction = await DataBase.transaction();
    try {
        const user = await User.update(userData, { where: { id: req.params.retailer_id } }, { transaction })
        const retailer = await Retailer.update(retailerData, { where: { retailer_id: req.params.retailer_id } }, { transaction })
        await transaction.commit()
        return res.status(200).json({
            success: true,
            status: "success",
            message: `Retailer updated succesfully`
        });
    } catch (error) {
        transaction.rollback()
        next(error)
    }
}

/**
 * Delete Retailer
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 */
module.exports.deleteRetailers = catchAsync(async (req, res, next) => {
    await User.destroy({ where: { id: req.params.retailer_id } })
    return res.status(200).json({
        success: true,
        status: "success",
        message: `Retailer Deleted Successfully`
    });
})