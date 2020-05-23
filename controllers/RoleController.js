const Roles = require("../models/role")
const { catchAsync } = require("../utils/Helper")

/**
 * Get All Roles
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} Roles Data Object
 */
module.exports.getRoles = catchAsync(async (req, res, next) => {
    const roles = await Roles.findAll({ where: { user_id: req.user_id } })
    return res.status(200).json({
        success: true,
        status: "success",
        roles,
        message: "Role fetched succesfully"
    });
})

/**
 * Create Role
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} Created Role Data
 */
module.exports.addRole = catchAsync(async (req, res, next) => {
    await Roles.create({
        name: req.body.name,
        description: req.body.description,
        isDefault: false,
        user_id: req.user_id
    })
    return res.status(201).json({
        success: true,
        status: "success",
        message: `Role created succesfully`
    });
})

/**
 * Delete Role
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 */
module.exports.deleteRole = catchAsync(async (req, res, next) => {
    await Roles.destroy({ where: { id: req.params.role_id } })
    return res.status(200).json({
        success: true,
        status: "success",
        message: `Role Deleted Successfully`
    });
})