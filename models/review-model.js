const pool = require("../database/")

/* Insert a new review */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql = `
      INSERT INTO reviews (review_text, inv_id, account_id)
      VALUES ($1, $2, $3) RETURNING *`
    const result = await pool.query(sql, [review_text, inv_id, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("addReview error", error)
    throw error
  }
}

/* Get all reviews for a vehicle */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `
      SELECT r.review_id, r.review_text, r.review_date, 
             a.account_firstname, a.account_lastname
      FROM reviews r
      JOIN account a ON r.account_id = a.account_id
      WHERE inv_id = $1
      ORDER BY review_date DESC`
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByInvId error", error)
    throw error
  }
}

/* Delete review (Admin/Employee only) */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM reviews WHERE review_id = $1"
    const result = await pool.query(sql, [review_id])
    return result.rowCount
  } catch (error) {
    console.error("deleteReview error", error)
    throw error
  }
}

module.exports = { addReview, getReviewsByInvId, deleteReview }
