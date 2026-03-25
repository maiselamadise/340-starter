// inventoryRoute.js
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
// ❌ REMOVED: inventory-validation (file doesn't exist)

// Route for vehicle detail view
router.get("/detail/:inv_id", invController.buildByInventoryId)

module.exports = router



