const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async (req, res, next) => {
  try {
    const data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
      list += "<li>"
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
      list += "</li>"
    })
    list += "</ul>"
    return list
  } catch (error) {
    console.error("getNav error:", error)
    throw error
  }
}

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async (data) => {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += "<li>"
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += "<hr />"
      grid += "<h2>"
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>"
      grid += "</h2>"
      grid += "<span>$" + new Intl.NumberFormat("en-US").format(vehicle.inv_price) + "</span>"
      grid += "</div>"
      grid += "</li>"
    })
    grid += "</ul>"
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ***************************
 *  Build vehicle detail HTML (Task 1)
 * ************************** */
Util.buildVehicleDetailHTML = (vehicle) => {
  return `
    <div class="vehicle-detail-container">
      <div class="vehicle-image-section">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}" class="vehicle-detail-image">
      </div>
      <div class="vehicle-info-section">
        <div class="vehicle-header">
          <h1 class="vehicle-title">${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
          <div class="vehicle-price">$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</div>
        </div>
        
        <div class="vehicle-specs">
          <div class="spec-row">
            <span class="spec-label">Year:</span>
            <span class="spec-value">${vehicle.inv_year}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">Make:</span>
            <span class="spec-value">${vehicle.inv_make}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">Model:</span>
            <span class="spec-value">${vehicle.inv_model}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">Mileage:</span>
            <span class="spec-value">${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">Color:</span>
            <span class="spec-value">${vehicle.inv_color}</span>
          </div>
        </div>
        
        <div class="vehicle-description">
          <h3>Vehicle Description</h3>
          <p>${vehicle.inv_description}</p>
        </div>
        
        <div class="vehicle-actions">
          <button class="btn-contact">Contact Dealer</button>
          <button class="btn-finance">Get Financing</button>
        </div>
      </div>
    </div>
  `
}


/* ************************
 * Error handling wrapper (Task 2)
 ************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

//  /* ****************************************
//  *  Check Login
//  * ************************************ */
// Util.checkLogin = (req, res, next) => {
//   if (!res.locals.loggedin) {
//     req.flash("notice", "Please log in.")
//     return res.redirect("/account/login")
//   }
//   next()
// }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 * Middleware to check for Admin or Employee
 * **************************************** */
Util.checkAccountType = (req, res, next) => {
  const accountData = res.locals.accountData
  const allowedRoles = ["Admin", "Employee"]

  if (!accountData || !allowedRoles.includes(accountData.account_type)) {
    req.flash("notice", "You do not have access to this page.")
    return res.redirect("/account/login")
  }

  next()
}


module.exports = Util
