const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async (req, res, next) => {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
      const error = new Error("No vehicles found for this classification")
      error.status = 404
      throw error
    }

    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build inventory detail view (Task 1)
 * ************************** */
invCont.buildByInventoryId = async (req, res, next) => {
  try {
    const invId = req.params.invId
    const data = await invModel.getInventoryById(invId)

    if (!data || data.length === 0) {
      const error = new Error("Vehicle not found")
      error.status = 404
      throw error
    }

    const vehicle = data[0]
    const vehicleHTML = utilities.buildVehicleDetailHTML(vehicle)
    const nav = await utilities.getNav()

    res.render("./inventory/detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHTML,
      vehicle,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Trigger intentional error (Task 3)
 * ************************** */
invCont.triggerError = async (req, res, next) => {
  try {
    // Intentionally throw a 500 error
    const error = new Error("Intentional 500 Error for Testing Purposes")
    error.status = 500
    throw error
  } catch (error) {
    next(error)
  }
}


/* ****************************************
*  Deliver management view
* *************************************** */
invCont.manageInventory = async (req, res, next) => {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
   title: "Vehicle Management",
    nav,
    errors: null
 })
}

/* ****************************************
*  Deliver add-classification view
* *************************************** */
invCont.addClassification = async (req, res, next) => {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
   title: "Vehicle Management",
    nav,
    errors: null
 })
}



/* ****************************************
*  Deliver registration for car view
* *************************************** */
 invCont.addInventory = async (req, res, next) => {
   let nav = await utilities.getNav()
   const classificationList = await utilities.buildClassificationList()
   res.render("inventory/add-vehicle", {
    title: "Add vehicle",
     nav,
      classificationList,
     errors: null
   })
 }


 /* ****************************************
 *  Process Registration for car view
 * *************************************** */


 invCont.addNewInventoryVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body
  try {
    const data = await invModel.addNewInventoryVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
    if (data) {
      req.flash("notice", `New ${inv_make} vehicle was successfully added.`)
      res.redirect("/inv/")
    } else {
      throw new Error("Error adding a new vehicle")
    }
  } catch (error) {
    console.error("Error adding a new inventory vehicle", error)
    res.status(500).render("inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      errors: []
    })
  }
}


invCont.addVehicleByClassificationName = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {classification_name} = req.body
  try {
    const data = await invModel.addVehicleByClassificationName(classification_name)
    if (data) {
      req.flash("notice", `New ${inv_make} classification was successfully added.`)
      res.redirect("/inv/")
    } else {
      throw new Error("Error adding a new vehicle")
    }
  } catch (error) {
    console.error("Error adding a new inventory vehicle", error)
    res.status(500).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: []
    })
  }
}

 /* ****************************************
 *  Process Registration
 * *************************************** */
//  invCont.addNewInventoryVehicle = async (req, res, next) => {
//    let nav = await utilities.getNav()
//    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
 
//    const regResult = await accountModel.addNewInventoryVehicle(
//      account_firstname,
//      account_lastname,
//      account_email,
//      account_password
//    )
 
//    if (regResult) {
//      req.flash(
//        "notice",
//        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
//      )
//      res.status(201).render("account/login", {
//        title: "Login",
//        nav,
//      })
//    } else {
//      req.flash("notice", "Sorry, the registration failed.")
//      res.status(501).render("account/register", {
//        title: "Registration",
//        nav,
//      })
//    }
//  }
 




// invCont.addNewClassification = async function (req, res, next) {
//   let nav = await utilities.getNav()
//   const { classification_name } = req.body
//   try {
//     const data = await invModel.addVehicleByClassificationName(classification_name)
//     if (data) {
//       req.flash("notice", `${classification_name} was successfully added!`)
//       res.redirect("/inv/")
//     } else {
//       throw new Error("Error inserting a new vehicle classification")
//     }
//   } catch (error) {
//     console.error("Error adding a new vehicle classification", error)
//     res.status(500).render("inventory/management", {
//       title: "Vehicle Management",
//       nav,
//       errors: []
//     })
//   }
// }







module.exports = invCont
