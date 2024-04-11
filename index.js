const express = require('express')

const setup = require('./models')

const app = express()
app.use(express.json())
const port = 3000

const sequelize = setup()

const { Habitat, Assignment, Employee } = sequelize.models

// build the endpoint (choose the HTTP method and URL)
// in the endpoint, use the above models to interact with the database
// send a response (if necessary)

// populate/update employee info
// populate/update habitat info
// get information about an employee
// get info about a habitat
// create a new assignment

// remove an assignment
// remove an employee
// list all habitats and all employees working in that habitat
// list all of an employee's assignments
// list all assignments in a habitat
// list and filter employees by some field
// update an assignment's status

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})