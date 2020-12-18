const db = require("../../data/dbConfig");

module.exports = {
  getUserById,
  addUser,
}

function getUserById(id) {
  return db('users')
    .where({id})
    .first()
}

function addUser(body) {
  return db('users')
    .insert({body})
    .then(id => {
      return getUserById(id)
    })
}
