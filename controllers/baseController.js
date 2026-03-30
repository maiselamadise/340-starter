const utilities = require("../utilities/")
const baseController = {}

/* ************************
 * Build Home Page
 ************************** */
baseController.buildHome = async function (req, res, next) {
  const nav = await utilities.getNav()
res.render("inventory/detail", {
  title: `${data.inv_make} ${data.inv_model}`,
  nav,
  vehicleDetail: detailHTML
})  
}

module.exports = baseController