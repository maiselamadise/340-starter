const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invController = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId

    const data = await invModel.getInventoryByClassificationId(classification_id)

    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()

    res.render("inventory/classification", {
      title: "Vehicles",
      nav,
      grid,
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
    const inv_id = req.params.inv_id

    const data = await invModel.getInventoryById(inv_id)

    if (!data) {
      throw new Error("Vehicle not found")
    }

    const nav = await utilities.getNav()
    const detail = await utilities.buildVehicleDetail(data)

    res.render("inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      detail,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invController