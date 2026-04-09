const express = require("express")
const router = new express.Router()

const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

/* *********************************
 * Account Management View
 ******************************** */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
)

/* *********************************
 * Login View
 ******************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* *********************************
 * Process Login
 ******************************** */
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* *********************************
 * Registration View
 ******************************** */
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/* *********************************
 * Process Registration
 ******************************** */
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

/* *********************************
 * Update Account View
 ******************************** */
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

/* *********************************
 * Process Account Update
 ******************************** */
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  utilities.handleErrors(accountController.updateAccount)
)

/* *********************************
 * Process Password Update
 ******************************** */
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  utilities.handleErrors(accountController.updatePassword)
)

/* *********************************
 * Logout
 ******************************** */
router.get("/logout", accountController.logoutAccount)

module.exports = router