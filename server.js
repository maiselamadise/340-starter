const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()

const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")

const session = require("express-session")
const pool = require("./database/")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const flash = require("connect-flash")
const app = express()

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Session Middleware
 *************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET || "devSecret123",
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    cookie: {
      secure: false,
    },
  })
)

/* ***********************
 * Flash Messages
 *************************/
app.use(flash())
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

/* ***********************
 * Body & Cookie Middleware
 *************************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(utilities.checkJWTToken)

/* ***********************
 * JWT Middleware
 *************************/
app.use(utilities.checkJWTToken)

/* ***********************
 * NAV Middleware (🔥 IMPORTANT)
 *************************/
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav()
    next()
  } catch (err) {
    console.error("Nav error:", err)
    next()
  }
})

/* ***********************
 * Static Files
 *************************/
app.use(express.static("public"))
app.use(static)

/* ***********************
 * Routes
 *************************/
app.get("/", utilities.handleErrors(baseController.buildHome))

app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

/* ***********************
 * Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  console.error("Error:", err.stack)

  const status = err.status || 500
  const message = err.message || "Something went wrong."

  res.status(status).render("errors/error", {
    title: `Error ${status}`,
    message,
    status,
  })
})

/* ***********************
 * Server Start
 *************************/
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})