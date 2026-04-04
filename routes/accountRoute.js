const regValidate = require("../utilities/account-validation")
const express = require("express")
const router = new express.Router()

const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

/* Login */
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

/* Register view */
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

/* Register POST */
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router