/* ******************************************
 * Primary server file
 *******************************************/

const expressLayouts = require("express-ejs-layouts")
const express = require("express")
require("dotenv").config()

const utilities = require("./utilities/")
const app = express()

const baseController = require("./controllers/baseController")

/* ***********************
 * Middleware
 *************************/
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Global Navigation
 *************************/
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav()
    next()
  } catch (error) {
    next(error)
  }
})

/* ***********************
 * Routes
 *************************/

// Static routes
app.use(require("./routes/static"))

// Home
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))

/* ***********************
 * ✅ REQUIRED: Footer Error Route
 *************************/
app.get("/inv/trigger-error", (req, res, next) => {
  next(new Error("Intentional error triggered"))
})

/* ***********************
 * 404 Handler
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we couldn't find that page." })
})

/* ***********************
 * Error Handler (MVC compliant)
 *************************/
app.use(async (err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message =
    err.status == 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav: res.locals.nav || "<p>Navigation unavailable</p>",
  })
})

/* ***********************
 * Server Start
 *************************/
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})