require('dotenv').config()

const { createClient } = require('@libsql/client')

const connection = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

module.exports = { connection }
