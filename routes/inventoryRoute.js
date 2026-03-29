const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Vehicle detail view 
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildByInvId)
)

module.exports = router