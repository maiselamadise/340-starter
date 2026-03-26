const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invController = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId

  console.log("PARAM:", classification_id) // 👈 debug

  const data = await invModel.getInventoryByClassificationId(classification_id)

  console.log("DATA:", data) // 👈 debug

  const grid = await utilities.buildClassificationGrid(data)
  const nav = await utilities.getNav()

  res.render("inventory/classification", {
    title: "Vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * Build inventory detail view
 * ************************** */
invController.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id

  const data = await invModel.getInventoryById(inv_id)
  const nav = await utilities.getNav()

  res.render("inventory/detail", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    vehicle: data,
  })
}

module.exports = invController