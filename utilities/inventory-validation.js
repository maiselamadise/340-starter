const utilities = require("../utilities/");
const { body, validationResult } = require("express-validator");
const validate = {};

validate.classificationRules = () => [
  body("classification_name")
    .trim()
    .notEmpty()
    .withMessage("Classification name is required.")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("No spaces or special characters allowed."),
];

validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  let nav = await utilities.getNav();
  if (!errors.isEmpty()) {
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
    });
    return;
  }
  next();
};

validate.inventoryRules = () => [
  body("classification_id")
    .notEmpty()
    .withMessage("Classification is required."),
  body("inv_make").trim().notEmpty().withMessage("Make is required."),
  body("inv_model").trim().notEmpty().withMessage("Model is required."),
  body("inv_year")
    .isInt({ min: 1900, max: 2099 })
    .withMessage("Year must be between 1900 and 2099."),
  body("inv_description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),
  body("inv_image").trim().notEmpty().withMessage("Image path is required."),
  body("inv_thumbnail")
    .trim()
    .notEmpty()
    .withMessage("Thumbnail path is required."),
  body("inv_price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),
  body("inv_miles")
    .isInt({ min: 0 })
    .withMessage("Miles must be a positive integer."),
  body("inv_color").trim().notEmpty().withMessage("Color is required."),
];

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  let nav = await require("../utilities/").getNav();
  let classificationList =
    await require("../utilities/").buildClassificationList(
      req.body.classification_id
    );
  if (!errors.isEmpty()) {
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors,
      ...req.body, // to retain form data
    });
    return;
  }
  next();
};

module.exports = validate;