const invModel = require("../models/inventory-model")
const utilities = require("../utilities")
const invController = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId

    const data = await invModel.getInventoryByClassificationId(classification_id)

    const nav = await utilities.getNav()
    const grid = await utilities.buildClassificationGrid(data)

    res.render("inventory/classification", {
      title: "Inventory By Classification",
      nav,
      grid,   // ✅ MATCHES VIEW
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build inventory detail view 
 * ************************** */
invController.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id   // ✅ MATCHES ROUTE

    const data = await invModel.getInventoryById(inv_id)

    if (!data) {
      return next({ status: 404, message: "Vehicle not found" })
    }

    const nav = await utilities.getNav()
   const detailHTML = utilities.buildVehicleDetailHTML(data)

    res.render("inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      detailHTML,   // ✅ MATCHES VIEW
    })

  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Intentional Error
 * ************************** */
invController.triggerError = function (req, res, next) {
  throw new Error("Intentional 500 error")
}

module.exports = invController