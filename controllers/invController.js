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
      title: "Vehicle Classification",
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
invController.buildVehicleDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id

    const data = await invModel.getInventoryById(inv_id)

    const detailHTML = await utilities.buildVehicleDetail(data)

    const nav = await utilities.getNav()

    res.render("inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      detail: detailHTML
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invController