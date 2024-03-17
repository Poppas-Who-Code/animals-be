const express = require('express')

const { Animal } = require('./models/animal')

const app = express()
app.use(express.json())
const port = 3000

// query by type
app.get('/animals', async (req, res) => {
  const { diet, sortParam, sortDirection } = req.query

  let results;
  if (diet) {
    results = await Animal.findAll({ where: { diet } })
  } else {
    results = await Animal.findAll()
  }


  if (sortParam && sortDirection) {
    results.sort((animal1, animal2) => {
      return animal1[sortParam].localeCompare(animal2[sortParam]) * sortDirection
    })
  }

  res.json(results)
  // Animal.findAll().then(results => {
  //   res.json(results)
  // })
})

app.get('/animals/:id', async (req, res) => {
  const { id } = req.params
  const animal = await Animal.findByPk(id)
  res.json(animal)

})

app.post('/animals', async (req, res) => {
  // const name = req.body.name
  // const type = req.body.type
  // const diet = req.body.diet
  // const domesticated = req.body.domesticated
  // const population = req.body.population
  // skipping validations
  const { name, type, diet, domesticated, population } = req.body
  const animal = await Animal.create({ name, type, diet, domesticated, population })

  console.log(animal)
  res.send('Created!');
})

app.delete('/animals/:id', async (req, res) => {
  // 1. acquire data from request
  const { id } = req.params
  

  // 1a. validate data (optional)

  // 2. use data acquired in step 1 to interact with database 
  await Animal.destroy({ where: { id } })

  // 3. send a response
  res.send('Deleted!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Patch (or updating) is basically a combination of GET to find and POST to create