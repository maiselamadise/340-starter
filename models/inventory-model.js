const pool = require("../database/")

async function getClassifications() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
    return data.rows
  } catch (error) {
    console.error("getClassifications error:", error)
    throw error
  }
}

/* ***************************
 *  Get specific vehicle by inventory id
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [inv_id],
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryById error " + error)
    throw error
  }
}
async function getInventoryByClassificationId(classification_id) {
  const data = await pool.query(
    "SELECT * FROM inventory WHERE classification_id = $1",
    [classification_id]
  )
  return data.rows
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
}