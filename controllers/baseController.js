const utilities = require("../utilities/")

const baseController = {}

baseController.buildHome = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()

    req.flash("notice", "This is a flash message.")

    res.render("index", {
      title: "Home",
      nav, // ✅ FIXED
    })
  } catch (error) {
    next(error)
  }
}

module.exports = baseController