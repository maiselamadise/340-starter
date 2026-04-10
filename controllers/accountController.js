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
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
 * Register View
 **************************************** */
async function buildRegister(req, res) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 * Register Account
 **************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body

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
    return res.render("account/register", {
      title: "Register",
      nav,
    })

  } catch (error) {
    console.error(error)
    req.flash("notice", "Error processing registration.")
    return res.render("account/register", {
      title: "Register",
      nav,
    })
  }
}

/* ****************************************
 * Login
 **************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  try {
    const account = await accountModel.getAccountByEmail(account_email)

    if (!account) {
      req.flash("notice", "Invalid credentials.")
      return res.render("account/login", {
        title: "Login",
        nav,
      })
    }

    const match = await bcrypt.compare(
      account_password,
      account.account_password
    )

    if (!match) {
      req.flash("notice", "Invalid credentials.")
      return res.render("account/login", {
        title: "Login",
        nav,
      })
    }

    delete account.account_password

    const token = jwt.sign(
      {
        account_id: account.account_id,
        account_email: account.account_email,
        account_type: account.account_type,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    )

    res.cookie("jwt", token, { httpOnly: true })

    return res.redirect("/account/")

  } catch (error) {
    console.error(error)
    req.flash("notice", "Login error. Try again.")
    return res.render("account/login", {
      title: "Login",
      nav,
    })
  }
}

/* ****************************************
 * Update View
 **************************************** */
async function buildUpdateAccount(req, res) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)

  const result = await accountModel.getAccountById(account_id)

  if (!result.rows.length) {
    req.flash("notice", "Account not found.")
    return res.redirect("/account/")
  }

  const accountData = result.rows[0]

  res.render("account/update", {
    title: "Update Account",
    nav,
    ...accountData,
    errors: null,
  })
}

/* ****************************************
 * Update Account
 **************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.render("account/update", {
      title: "Update Account",
      nav,
      ...req.body,
      errors,
    })
  }

  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body

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
 * Account Management View
 **************************************** */
async function buildManagement(req, res) {
  let nav = await utilities.getNav()

  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData: res.locals.accountData,
  })
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
  buildManagement,
  logoutAccount,
}