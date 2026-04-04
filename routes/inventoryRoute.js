const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Public route: inventory detail (site visitors)
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildVehicleDetail)
)
router.get("/error", (req, res, next) => {
  throw new Error("Intentional 500 error")
})

module.exports = router