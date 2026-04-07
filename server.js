/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()

const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")

const session = require("express-session")
const pgSession = require("connect-pg-simple")(session)
const pool = require("./database/")

const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const flash = require("connect-flash")

const app = express()

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Middleware
 *************************/
app.use(
  session({
    store: new pgSession({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET || "superSecretKey",
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
  })
)

// Flash messages
app.use(flash())
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

// Body & cookie parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// JWT check
app.use(utilities.checkJWTToken)

/* ***********************
 * Routes
 *************************/
app.use(static)

app.get("/", utilities.handleErrors(baseController.buildHome))

// Static files
app.use(express.static("public"))

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes
app.use("/account", accountRoute)

/* ***********************
 * 404 Handler (optional but recommended)
 *************************/
app.use((req, res, next) => {
  const error = new Error(`Page not found: ${req.originalUrl}`)
  error.status = 404
  next(error)
})

/* ***********************
 * Global Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  console.error("Error occurred:", err.stack)

  let nav = ""
  try {
    nav = await utilities.getNav()
  } catch (navError) {
    console.error("Error getting navigation:", navError)
    nav = "<ul><li><a href='/'>Home</a></li></ul>"
  }

  const status = err.status || 500
  const message =
    err.message || "Something went wrong. Please try again later."

  res.status(status).render("errors/error", {
    title: `Error ${status}`,
    nav,
    message,
    status,
    layout: "./layouts/layout",
  })
})

/* ***********************
 * Server
 *************************/
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})