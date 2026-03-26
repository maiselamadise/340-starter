const invModel = require("../models/inventory-model")

const Util = {}

/* Build Navigation */
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/">Home</a></li>'

  data.rows.forEach((row) => {
    list += `<li>
      <a href="/inv/type/${row.classification_id}">
        ${row.classification_name}
      </a>
    </li>`
  })

  list += "</ul>"
  return list
}

/* Build Grid */
Util.buildClassificationGrid = async function (data) {
  let grid = ""

  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += `<li>
        <a href="/inv/detail/${vehicle.inv_id}">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="/inv/detail/${vehicle.inv_id}">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
        </div>
      </li>`
    })
    grid += "</ul>"
  } else {
    grid = '<p class="notice">No vehicles found.</p>'
  }

  return grid
}

/* Error Handler */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util