
const Router = require("express").Router();
const sanitizeBody = require('xss-clean')
const FromData = require("../utils/FormData")

const usersRouter = require("./Users");
const rolesRouter = require("./Roles");
const wholesellerRouter = require("./WholeSeller");
const retailersRouter = require("./Retailers");
const customersRouter = require("./Customer");

Router.use("/users", FromData.rawFormData(), sanitizeBody(), usersRouter)
Router.use("/roles", FromData.rawFormData(), sanitizeBody(), rolesRouter)
Router.use("/wholesellers", FromData.fileFormData('public/wholesellers/', 'logo'), sanitizeBody(), wholesellerRouter)
Router.use("/retailers", FromData.rawFormData(), sanitizeBody(), retailersRouter)
Router.use("/customers", FromData.rawFormData(), sanitizeBody(), customersRouter)

module.exports = Router