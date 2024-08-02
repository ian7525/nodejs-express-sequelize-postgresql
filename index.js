const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const { createHandler } = require('graphql-http/lib/use/express')

const schema = require('./app/schema/graphqlSchema')

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

const db = require('./app/models')
db.sequelize
  .sync()
  .then(() => {
    console.log('Synced db.')
  })
  .catch((err) => {
    console.log('Failed to sync db: ' + err.message)
  })

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to tutorial.' })
})

require('./app/routes/tutorial.routes')(app)

app.all(
  '/graphql',
  createHandler({
    schema,
    formatError: (error) => {
      console.error('GraphQL Error:', error)
      return error
    },
  })
)

// set port, listen for requests
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
