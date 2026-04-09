const express = require("express")
const router = new express.Router()

const invController = require("../controllers/invController")
const utilities = require("../utilities")

/* ***************************
 * PUBLIC ROUTES (NO PROTECTION)
 *************************** */

// Classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Vehicle detail view
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId)
)

/* ***************************
 * PROTECTED ROUTES (ADMIN/EMPLOYEE ONLY)
 *************************** */

// Inventory management view
router.get(
  "/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.manageInventory)
)

// Add classification view
router.get(
  "/add-classification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.addClassification)
)

// Process classification
router.post(
  "/add-classification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.addVehicleByClassificationName)
)

// Add vehicle view
router.get(
  "/add-vehicle",
  utilities.checkAccountType,
  utilities.handleErrors(invController.addInventory)
)

// Process vehicle
router.post(
  "/add-vehicle",
  utilities.checkAccountType,
  utilities.handleErrors(invController.addNewInventoryVehicle)
)

// Edit inventory
router.get(
  "/edit/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.editInventory)
)

// Inventory JSON (optional to protect)
router.get(
  "/getInventory/:classification_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
)

module.exports = router