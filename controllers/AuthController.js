const { promisify } = require("util")
const { Op } = require("sequelize")
const JWT = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const Users = require("../models/user");
const UserRoles = require("../models/user_roles");
const Role = require('../models/role')
const { catchAsync } = require("../utils/Helper");
const AppError = require("../utils/AppError");

Users.belongsToMany(Role, { through: UserRoles })

const signToken = (obj = {}) => {
	const token = JWT.sign(obj, process.env.APP_SECRET, {
		expiresIn: process.env.LOGIN_EXPIRE_TIME,
	});
	return token;
};


/**
 * Login Users
 *
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 *
 * @returns {Object} Users Data Object
 */
module.exports.loginUser = catchAsync(async (req, res, next) => {/**
	* Validate Input Data
	*/
   await check("username", "User Name Is Required").exists().run(req);
   await check("password", "Password Is Required").exists().run(req);

   const result = validationResult(req);
   if (!result.isEmpty()) {
	   return res.status(422).json({ status: "fail", success: false, errors: result.array() });
   }
   const { username, password } = req.body;
   const userData = await Users.findOne({
	   where: {
		   [Op.or]: [{ email: username }, { mobile: username }]
	   },
	   include: {
		   model: Role, as: 'roles', through: {
			   attributes: []
		   }
	   }
   })
   if (!userData || !(await userData.isPasswordMatched(password))) {
	   return next(new AppError("Username or password is incorrect", 401));
   }

   user = userData.toJSON()
   if (user.status === "INACTIVE") {
	   return next(new AppError("User account is inactive", 401));
   }
   let roleData = null;
   if (user.roles) {
	   roleData = user.roles.reduce((old, current) => current.name, null)
	   delete user.roles
	   user.user_role = roleData
   }

   let token = signToken({ id: user.id, password: user.password });

   /**
	* Remove Sensitive Information
	*/
   delete user.password
   delete user.id
   return res.status(200).json({ status: "success", success: true, token, user });
});

/**
 * Check is user is logged in
 *
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 *
 */
module.exports.isUserLoggedIn = catchAsync(async (req, res, next) => {
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		token = req.headers.authorization.split(" ")[1]
	}
	if (!token) {
		return next(new AppError('You are not logged in ! Please login to get access', 401))
	}
	const decoded = await promisify(JWT.verify)(token, process.env.APP_SECRET)
	const user = await Users.findByPk(decoded.id);
	if (!user) {
		return next(new AppError('User is not found in system', 401))
	}

	if (user.status === 'INACTIVE') {
		return next(new AppError('User account is inactive', 403))
	}
	req.user_id = user.id
	req.userName = `${user.first_name} ${user.last_name}`
	next()
});

/**
 * Create User
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} User Data Object
 */
module.exports.signUpUser = catchAsync(async (req, res, next) => {
	/**
	 * Validate Input Data
	 */
	await check("first_name", "First Name Is Required").exists().run(req);
	await check("last_name", "Last Name Is Required").exists().run(req);
	await check("email", "Email Id Is Required").exists().run(req);
	await check("mobile", "Contact Number Is Required").exists().run(req);
	await check("password", "Password Is Required").exists().run(req);
	await check("status", "Active Status is Required").exists().run(req);
	const result = validationResult(req);
	if (!result.isEmpty()) return res.status(422).json({ status: "fail", success: false, errors: result.array() });
	let userData = {
		email: req.body.email,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		mobile: req.body.mobile,
		password: req.body.password,
		status: req.body.status,
	};
	let user = await Users.create(userData)
	await UserRoles.create({ roleId: 1, userId: user.id })

	return res.status(201).json({
		status: "success",
		success: true,
		message: "User Created succesfully",
	});
});

/**
 * Create User
 * 
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @param {Object} next Express Request Next handler Function.
 * 
 * @returns {Object} User Data Object
 */
module.exports.getUsers = catchAsync(async (req, res, next) => {
	const users = await Users.findAll({
		attributes: { exclude: ['password'] },
		include: {
			model: Role, as: 'roles', through: {
				attributes: []
			}
		}

	})
	return res.status(201).json({
		status: "success",
		success: true,
		users,
		message: "User Created succesfully",
	});
});