const pool = require("../database/")

/* *****************************
 * Register Account
 ***************************** */
async function registerAccount(first, last, email, password) {
  try {
    const sql = `
      INSERT INTO account 
      (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES ($1, $2, $3, $4, 'Client') 
      RETURNING *`
    return await pool.query(sql, [first, last, email, password])
  } catch (error) {
    console.error("Register error:", error)
    return null
  }
}

/* *****************************
 * Check Email
 ***************************** */
async function checkExistingEmail(email) {
  try {
    const result = await pool.query(
      "SELECT * FROM account WHERE account_email = $1",
      [email]
    )
    return result.rows[0]
  } catch (error) {
    console.error("checkExistingEmail error:", error)
    return null
  }
}

/* *****************************
 * Get by Email
 ***************************** */
async function getAccountByEmail(email) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname,
              account_email, account_type, account_password
       FROM account WHERE account_email = $1`,
      [email]
    )
    return result.rows[0]
  } catch (error) {
    console.error("getAccountByEmail error:", error)
    return null
  }
}

/* *****************************
 * Get by ID
 ***************************** */
async function getAccountById(id) {
  try {
    const result = await pool.query(
      "SELECT * FROM account WHERE account_id = $1",
      [id]
    )
    return result.rows[0]
  } catch (error) {
    console.error("getAccountById error:", error)
    return null
  }
}

/* *****************************
 * Update Account
 ***************************** */
async function updateAccount(id, first, last, email) {
  try {
    const result = await pool.query(
      `UPDATE account
       SET account_firstname = $1,
           account_lastname = $2,
           account_email = $3
       WHERE account_id = $4`,
      [first, last, email, id]
    )
    return result.rowCount
  } catch (error) {
    console.error("updateAccount error:", error)
    return null
  }
}

/* *****************************
 * Update Password
 ***************************** */
async function updatePassword(account_id, hashedPassword) {
  try {
    const result = await pool.query(
      "UPDATE account SET account_password = $1 WHERE account_id = $2",
      [hashedPassword, account_id]
    )
    return result.rowCount
  } catch (error) {
    console.error("updatePassword error:", error)
    return null
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
}