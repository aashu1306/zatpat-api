const DataBase = require("../models/index")
const WholeSeller = require("../models/wholeseller")
const UserRoles = require("../models/user_roles")
const User = require("../models/user")
const { check, validationResult } = require("express-validator");
const { catchAsync, getImagePath } = require("../utils/Helper")

User.hasOne(WholeSeller, { foreignKey: { name: 'wholeseller_id' } });

const tableKeys = ["name", "logo", "email", "code", "mobile", "aadhar_no", "details", "status"]

/**
 * Get All WholeSellers
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} WholeSellers Data Object
 */
module.exports.getWholeSellers = catchAsync(async (req, res, next) => {
    const wholesellers = await WholeSeller.findAll()
    return res.status(200).json({
        success: true,
        status: "success",
        wholesellers,
        message: "WholeSeller fetched succesfully"
    });
})

/**
 * Get WholeSeller Details
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} WholeSellers Data Object
 */
module.exports.getWholeSellerDetails = catchAsync(async (req, res, next) => {
    const wholeseller = await WholeSeller.findAll({ where: { wholeseller_id: req.params.wholeseller_id } })
    return res.status(200).json({
        success: true,
        status: "success",
        wholeseller,
        message: "WholeSeller fetched succesfully"
    });
})

/**
 * Create WholeSellers
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} Created WholeSellers Data
 */
module.exports.addWholeSellers = async (req, res, next) => {
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

        let wholeSellerData = {
            name: req.body.name,
            email: req.body.email,
            code: req.body.code,
            mobile: req.body.mobile,
            aadhar_no: req.body.aadhar_no,
            status: req.body.status,
            details: req.body.details,
            wholeseller_id: user.id
        }
        if (req.file) {
            wholeSellerData.logo = getImagePath(req, req.file.path)
        }
        const wholeSeller = await WholeSeller.create(wholeSellerData, { transaction })
        const userRoles = await UserRoles.create({ userId: user.id, roleId: 2 }, { transaction })
        await transaction.commit()
        return res.status(201).json({
            success: true,
            status: "success",
            message: `WholeSellers created succesfully`
        });
    } catch (error) {
        transaction.rollback()
        next(error)
    }
}

/**
 * Update WholeSellers
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} Updated WholeSellers Data
 */
module.exports.updateWholeSellers = async (req, res, next) => {
    let userData = {}, wholeSellerData = {}
    /** Data Prepare */
    if (req.body.name) {
        userData['first_name'] = req.body.name
        wholeSellerData['name'] = req.body.name
    }
    if (req.body.email) {
        userData['email'] = req.body.email
        wholeSellerData['email'] = req.body.email
    }
    if (req.body.mobile) {
        userData['mobile'] = req.body.mobile
        wholeSellerData['mobile'] = req.body.mobile
    }
    if (req.body.status) {
        userData['status'] = req.body.status
        wholeSellerData['status'] = req.body.status
    }

    if (req.body.code) {
        wholeSellerData['code'] = req.body.code
    }
    if (req.body.details) {
        wholeSellerData['details'] = req.body.details
    }
    if (req.body.aadhar_no) {
        wholeSellerData['aadhar_no'] = req.body.aadhar_no
    }
    if (req.file) {
        wholeSellerData['logo'] = getImagePath(req, req.file.path)
    }
    const transaction = await DataBase.transaction();
    try {
        const user = await User.update(userData, { where: { id: req.params.wholeseller_id } }, { transaction })
        const wholeSeller = await WholeSeller.update(wholeSellerData, { where: { wholeseller_id: req.params.wholeseller_id } }, { transaction })
        await transaction.commit()
        return res.status(200).json({
            success: true,
            status: "success",
            message: `WholeSellers updated succesfully`
        });
    } catch (error) {
        transaction.rollback()
        next(error)
    }
}

/**
 * Delete WholeSellers
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 */
module.exports.deleteWholeSellers = catchAsync(async (req, res, next) => {
    await User.destroy({ where: { id: req.params.wholeseller_id } })
    return res.status(200).json({
        success: true,
        status: "success",
        message: `WholeSellers Deleted Successfully`
    });
})