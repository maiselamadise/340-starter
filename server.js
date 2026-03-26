/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

const expressLayouts = require("express-ejs-layouts")
const express = require("express")
require("dotenv").config()

const utilities = require("./utilities/")
const app = express()

const baseController = require("./controllers/baseController")

// Database (for development troubleshooting)
const pool = require("./database/")

/* ***********************
 * Static Files
 *************************/
app.use(express.static("public"))

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

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


// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))

/* ***********************
 * Intentional 500 Error Route (for testing)
 *************************/
app.get("/error", (req, res, next) => {
  next(new Error("Intentional server error"))
})

/* ***********************
 * 404 Route - must be last route
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we couldn't find that page." })
})

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = ""
  try {
    nav = await utilities.getNav()
  } catch (e) {
    nav = "<p>Navigation unavailable</p>"
  }

  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message
  if (err.status == 404) {
    message = err.message
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?"
  }

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"

/* ***********************
 * Server Start
 *************************/
app.listen(port, () => {
  console.log(`App running at http://${host}:${port}`)
})