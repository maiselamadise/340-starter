const utilities = {}

utilities.registrationRules = () => {
  return []
}

utilities.checkRegData = (req, res, next) => {
  next()
}

module.exports = utilities