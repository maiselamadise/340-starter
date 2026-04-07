// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")



// Route to build inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to deliver inventory item details (Task 1)
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventory));


//Route to build inventory management view
//router.get("/add-vehicle", utilities.handleErrors(invController.buildInventory)); 
router.get("/", utilities.handleErrors(invController.manageInventory)); 

//Route to classification
router.get("/add-classification", utilities.handleErrors(invController.addClassification));

//Route to classification post

router.post("/add-classification", utilities.handleErrors(invController.addVehicleByClassificationName)); 

// Route to build inventory view for new vehical
router.get("/add-vehicle", utilities.handleErrors(invController.addInventory));  

// Route to build inventory view for new vehical post
router.post("/add-vehicle", utilities.handleErrors(invController.addNewInventoryVehicle)); 



// router.get("/", invController.buildInventory)addClassification

//router.get("/add-classification", invController.addClassification)

// router.get("/add-vehicle", invController.addInventory)


// // Route to build inventory by classification view
// router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build details of vehicle view
// router.get("/detail/:inv_id", invController.buildbyInvId);

// router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventory));

// router.post("/add-classification", classValidate.classificationRules(), classValidate.checkClassificationData, invController.addNewClassification);

// router.post("/add-inventory", classValidate.inventoryRules(), classValidate.checkInventoryData, invController.addNewInventory);

// router.post("/update", classValidate.newInventoryRules(), classValidate.checkUpdateData, invController.updateInventory);

// module.exports = router;



module.exports = router
