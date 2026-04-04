/* ******************************************
 * Primary server file
 *******************************************/
const accountRoute = require("./routes/accountRoute")
const expressLayouts = require("express-ejs-layouts")
const express = require("express")
require("dotenv").config()

const session = require("express-session")
const pgSession = require("connect-pg-simple")(session)
const flash = require("connect-flash")

const pool = require("./database/")
const utilities = require("./utilities/")
const baseController = require("./controllers/baseController")

const app = express()

/* ***********************
 * Middleware
 *************************/
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// ✅ Session
app.use(
  session({
    store: new pgSession({
      pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "devSecret",
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
  })
)

// ✅ Flash middleware
app.use(flash())

// ✅ Make messages available to ALL views
app.use((req, res, next) => {
  res.locals.messages = req.flash()
  next()
})

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
    const nav = await utilities.getNav()
    res.locals.nav = nav || "<p>No navigation available</p>"
    next()
  } catch (error) {
    console.error("NAV ERROR:", error.message)
    res.locals.nav = "<p>Navigation unavailable</p>"
    next()
  }
})

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", require("./routes/inventoryRoute"))
app.use("/account", accountRoute)

/* ***********************
 * Error Handling
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we couldn't find that page." })
})

app.use((err, req, res, next) => {
  console.error(`❌ ERROR at ${req.originalUrl}`)
  console.error(err.stack)

  const status = err.status || 500

  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"

  res.status(status).render("errors/error", {
    title: status,
    message,
    nav: res.locals.nav,
  })
})

/* ***********************
 * Server Start
 *************************/
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`)
})