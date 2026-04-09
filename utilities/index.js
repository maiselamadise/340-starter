const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Build Navigation
 ************************** */
Util.getNav = async () => {
  try {
    const data = await invModel.getClassifications()

    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'

    data.rows.forEach((row) => {
      list += `<li>
        <a href="/inv/type/${row.classification_id}" 
        title="See our inventory of ${row.classification_name}">
        ${row.classification_name}
        </a>
      </li>`
    })

    list += "</ul>"
    return list
  } catch (error) {
    console.error("getNav error:", error)
    throw error
  }
}

/* **************************************
 * Build Classification Grid
 ************************************** */
Util.buildClassificationGrid = async (data) => {
  let grid = ""

  if (data.length > 0) {
    grid += '<ul id="inv-display">'

    data.forEach((vehicle) => {
      grid += `<li>
        <a href="/inv/detail/${vehicle.inv_id}">
          <img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
        </div>
      </li>`
    })

    grid += "</ul>"
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  return grid
}

/* ***************************
 * Vehicle Detail HTML
 ************************** */
Util.buildVehicleDetailHTML = (vehicle) => {
  return `
    <div class="vehicle-detail-container">
      <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
      <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
      <p>Price: $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>
      <p>Mileage: ${vehicle.inv_miles}</p>
      <p>Color: ${vehicle.inv_color}</p>
      <p>${vehicle.inv_description}</p>
    </div>
  `
}

/* ************************
 * Error Wrapper
 ************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/* ************************
 * Build Classification List
 ************************** */
Util.buildClassificationList = async (classification_id = null) => {
  let data = await invModel.getClassifications()

  let list = '<select name="classification_id" required>'
  list += "<option value=''>Choose a Classification</option>"

  data.rows.forEach((row) => {
    list += `<option value="${row.classification_id}"
      ${classification_id == row.classification_id ? "selected" : ""}>
      ${row.classification_name}
    </option>`
  })

  list += "</select>"
  return list
}

/* ****************************************
 * Check JWT Token (FIXED)
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      (err, accountData) => {
        if (err) {
          res.locals.loggedin = false
          res.clearCookie("jwt")
          return next()
        }

        res.locals.accountData = accountData
        res.locals.loggedin = true
        next()
      }
    )
  } else {
    res.locals.loggedin = false
    next()
  }
}

/* ****************************************
 * Check Login
 **************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    return next()
  }

  req.flash("notice", "Please log in.")
  return res.redirect("/account/login")
}

/* ****************************************
 * Check Admin or Employee
 **************************************** */
Util.checkAccountType = (req, res, next) => {
  const accountData = res.locals.accountData

  if (
    accountData &&
    (accountData.account_type === "Admin" ||
      accountData.account_type === "Employee")
  ) {
    return next()
  }

  req.flash("notice", "You do not have access to this page.")
  return res.redirect("/account/login")
}

module.exports = Util