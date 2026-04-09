const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")
require("dotenv").config()

/* ****************************************
 * Login View
 **************************************** */
async function buildLogin(req, res) {
  res.render("account/login", {
    title: "Login",
  })
}

/* ****************************************
 * Register View
 **************************************** */
async function buildRegister(req, res) {
  res.render("account/register", {
    title: "Register",
    errors: null,
  })
}

/* ****************************************
 * Register Account
 **************************************** */
async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash("notice", `Welcome ${account_firstname}, please log in.`)
      return res.redirect("/account/login")
    }

    req.flash("notice", "Registration failed.")
    return res.redirect("/account/register")

  } catch (error) {
    req.flash("notice", "Error processing registration.")
    return res.redirect("/account/register")
  }
}

/* ****************************************
 * Login
 **************************************** */
async function accountLogin(req, res) {
  const { account_email, account_password } = req.body

  const account = await accountModel.getAccountByEmail(account_email)

  if (!account) {
    req.flash("notice", "Invalid credentials.")
    return res.redirect("/account/login")
  }

  try {
    if (await bcrypt.compare(account_password, account.account_password)) {

      delete account.account_password

      const token = jwt.sign(account, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      })

      res.cookie("jwt", token, { httpOnly: true })

      return res.redirect("/account/")
    }

    req.flash("notice", "Invalid credentials.")
    return res.redirect("/account/login")

  } catch (error) {
    throw new Error("Login failed")
  }
}

/* ****************************************
 * Update View
 **************************************** */
async function buildUpdateAccount(req, res) {
  const account_id = parseInt(req.params.account_id)

  const result = await accountModel.getAccountById(account_id)
  const accountData = result.rows[0]

  res.render("account/update", {
    title: "Update Account",
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
    errors: null,
  })
}

/* ****************************************
 * Update Account
 **************************************** */
async function updateAccount(req, res) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render("account/update", {
      title: "Update Account",
      ...req.body,
      errors,
    })
  }

  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const result = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (result.rowCount) {
    req.flash("notice", "Account updated successfully.")
  } else {
    req.flash("notice", "Update failed.")
  }

  return res.redirect("/account/")
}

/* ****************************************
 * Update Password
 **************************************** */
async function updatePassword(req, res) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.redirect(`/account/update/${req.body.account_id}`)
  }

  const { account_id, account_password } = req.body

  const hashed = await bcrypt.hash(account_password, 10)

  const result = await accountModel.updatePassword(account_id, hashed)

  if (result.rowCount) {
    req.flash("notice", "Password updated.")
  } else {
    req.flash("notice", "Password update failed.")
  }

  return res.redirect("/account/")
}

/* ****************************************
 * Logout
 **************************************** */
function logoutAccount(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "Logged out.")
  res.redirect("/")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildUpdateAccount,
  updateAccount,
  updatePassword,
  logoutAccount,
}