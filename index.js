const express = require('express')
const { Op } = require('@sequelize/core');
const cors = require('cors')

const setup = require('./models');
const { where } = require('sequelize');

const app = express()
app.use(express.json())
app.use(cors())
const port = 3000

const sequelize = setup()

const { Habitat, Assignment, Employee } = sequelize.models

// build the endpoint (choose the HTTP method and URL)
// in the endpoint, use the above models to interact with the database
// send a response (if necessary)

const getValueAndOperation = (queryValue) => {
  const hasLessThan = /</.test(queryValue)
  const hasEqual = /=/.test(queryValue)
  const hasGreaterThan = />/.test(queryValue)

  const value = queryValue.replace(/\D/g, '')

  let operation = Op.eq
  if (hasLessThan && hasGreaterThan) {
    throw new Error('must only specify less than or greater than, not both')
  }
  if (hasLessThan) {
    if (hasEqual) {
      operation = Op.lte
    } else {
      operation = Op.lt
    }
  }

  if (hasGreaterThan) {
    if (hasEqual) {
      operation = Op.gte
    } else {
      operation = Op.gt
    }
  }

  return { value, operation }
}

// list and filter employees by some field
// GET /employees/filter?experience=5&role=Ornithologist
app.get('/employees/filter', async (req, res) => {
  const { experience, role, salary, sortBy, sortDirection } = req.query

  const filterData = {}
  if (experience) {
    const { value, operation } = getValueAndOperation(experience)
    filterData.experience = { [operation]: value }
  }

  if (role) {
    filterData.role = role
  }

  if (salary) {
    const { value, operation } = getValueAndOperation(salary)
    filterData.salary = { [operation]: value }
  }
  const order = []
  if (sortBy && sortDirection) {
    order.push([sortBy, sortDirection.toUpperCase()])
  }

  const employeeList = await Employee.findAll({ where: filterData, order })
  res.json(employeeList)
})

// return all habitats that have incomplete assignments
app.get('/habitats/incomplete_assignments', async (req, res) => {
  // get all assignments that are EITHER incomplete OR unassigned
  // const assignments = await Assignment.findAll({ include: 'habitat', where: { [Op.or]: [{ status: "incomplete" }, { status: "unassigned" }] } })
  // const habitats = assignments.map(assignment => assignment.habitat)

  const habitats = await Habitat.findAll({ include: { model: Assignment, as: "assignments", where: { [Op.or]: [{ status: "incomplete" }, { status: "unassigned" }] } } })
  res.json(habitats)
})


// populate/update employee info
app.put('/employees', async (req, res) => {
  const {
    id,
    name,
    role,
    experience,
    qualifications,
    allergies,
    hire_date,
    salary,
    employment_status } = req.body

  await Employee.upsert({
    name,
    role,
    experience,
    qualifications,
    allergies,
    hire_date: new Date(hire_date),
    salary,
    employment_status
  }, id ? { where: { id } } : {})


  res.send('updated employee')
})

// populate/update habitat info
app.put('/habitats', async (req, res) => {
  const { name, description, climate, open, capacity } = req.body

  await Habitat.upsert({ name, description, climate, open, capacity }, { where: { name } })
  // if (id) {
  //   // const habitat = await Habitat.findByPk(id)
  //   // habitat.setAttributes({ description: "beef" })
  //   // habitat.save()

  //   await Habitat.update({ name, description, climate, open, capacity }, { where: { id } })
  // } else {
  //   await Habitat.create({ name, description, climate, open, capacity })
  // }

  res.send('updated habitat')
})

// get information about an employee
app.get('/employees/:id', async (req, resPECT) => {
  const { id } = req.params
  const employee = await Employee.findByPk(id, { include: "assignments" })

  resPECT.json(employee)
})

// get info about a habitat
app.get('/habitats/:id', async (req, resPECT) => {
  const { id } = req.params
  const habitat = await Habitat.findByPk(id, { include: "employees" })

  resPECT.json(habitat)
})

// create a new assignment
app.post('/assignments', async (req, res) => {
  const { description, duration, status, employee_id, habitat_id } = req.body

  await Assignment.create({ description, duration, status, employee_id, habitat_id })

  res.send('created assignment')
})


// get all assignments
app.get('/assignments', async (req, res) => {
  const assignments = await Assignment.findAll({ include: ['employee', 'habitat'] })
  res.json(assignments)
})

// remove an assignment
app.delete('/assignments/:id', async (req, res) => {
  const { id } = req.params;

  // await Assignment.destroy({ where: { id } })

  const assignment = await Assignment.findByPk(id)
  await assignment.destroy()
  res.json('destroyed')

  // OLD WAY OF DEALING WITH PROMISES
  // Assignment.findByPk(id)
  //   .then((assignment) => {
  //     return assignment.destroy()
  //   })
  //   .then(() => {
  //     res.json('destroyed')
  //   })
})

// remove an employee

// list all habitats and all employees working in that habitat
app.get('/habitats', async (req, res) => {
  const { name, climate, open, capacity } = req.query

  const filterData = {}
  if (name) {
    filterData.name = name
  }

  if (climate) {
    filterData.climate = climate
  }

  if (open) {
    filterData.open = open === "1"
  }

  if (capacity) {
    const { value, operation } = getValueAndOperation(capacity)
    filterData.capacity = { [operation]: value }
  }

  const habitatList = await Habitat.findAll({ where: filterData, include: 'employees' });
  res.json(habitatList)
})

// list all of an employee's assignments
app.get('/employees/:id/assignments', async (req, res) => {
  const { id } = req.params
  // const assignments = await Assignment.findAll({ where: { employee_id: id } })
  const employee = await Employee.findByPk(id, { include: "assignments" });

  res.json(employee.assignments)
})

// list all assignments in a habitat
app.get('/habitats/:id/assignments', async (req, res) => {
  const { id } = req.params
  const assignments = await Assignment.findAll({ where: { habitat_id: id } })

  res.json(assignments)
})

// update an assignment's status
app.patch('/assignments/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  await Assignment.update({ status }, { where: { id: id } })
  res.send('status updated')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// HOMEWORK: Apply filters (whatever you want) to habitats and assignments endpoints using query parameters
