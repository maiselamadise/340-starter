const invModel = require("../models/inventory-model")

const Util = {}

/* ***************************
 * Build Navigation
 * ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications()

  let list = "<ul>"
  list += '<li><a href="/">Home</a></li>'

  data.forEach((row) => {
    list += `<li>
      <a href="/inv/type/${row.classification_id}">
        ${row.classification_name}
      </a>
    </li>`
  })

  list += "</ul>"
  return list
}

/* ***************************
 * Build Classification Grid
 * ************************** */
Util.buildClassificationGrid = async function (data) {
  let grid = ""

  if (data.length > 0) {
    grid = '<ul id="inv-display" class="vehicle-grid">'

    data.forEach((vehicle) => {
      const price = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(vehicle.inv_price)

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
          <span>${price}</span>
        </div>
      </li>`
    })

    grid += "</ul>"
  } else {
    grid = '<p class="notice">No vehicles found.</p>'
  }

  return grid
}

/* ***************************
 * Build Vehicle Detail HTML
 * ************************** */
Util.buildVehicleDetailHTML = function (vehicle) {
  return `
    <div class="vehicle-detail-container">
      <div class="vehicle-image-section">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}" class="vehicle-detail-image">
      </div>

      <div class="vehicle-info-section">
        <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
        <p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p>${vehicle.inv_description}</p>
      </div>
    </div>
  `
}

/* ***************************
 * Error Handler Wrapper
 * ************************** */
Util.handleErrors = function (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

module.exports = Util