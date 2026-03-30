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

async function getInventoryById(inv_id) {
  try {
    const sql = `
      SELECT * 
      FROM inventory 
      WHERE inv_id = $1
    `
    const result = await pool.query(sql, [inv_id])
    return result.rows[0]
  } catch (error) {
    console.error("getInventoryById error: " + error)
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