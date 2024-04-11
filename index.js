const express = require('express')

const setup = require('./models')

const app = express()
app.use(express.json())
const port = 3000

const sequelize = setup()
const { Animal, Habitat } = sequelize.models

app.get('/animals', async (req, res) => {
  const { diet, sortParam, sortDirection, } = req.query

  let results;
  if (diet) {
    results = await Animal.findAll({ where: { diet }, include: 'habitat' })
  } else {
    results = await Animal.findAll({ include: 'habitat' })
  }

  if (sortParam && sortDirection) {
    results.sort((animal1, animal2) => {
      return animal1[sortParam].localeCompare(animal2[sortParam]) * sortDirection
    })
  }

  res.json(results)
})

app.get('/animals/:id', async (req, res) => {
  const { id } = req.params
  const animal = await Animal.findByPk(id, { include: 'habitat' })
  res.json(animal)
})

app.post('/animals', async (req, res) => {
  const { name, type, diet, domesticated, population, habitat_id } = req.body

  // what do we need? we need to get the habitat that we're trying to add to

  // const targetHabitat = habitats.find(habitat => habitat.id === habitat_id)
  const targetHabitat = await Habitat.findByPk(habitat_id, { include: 'animals' })
  // get its capacity and compare it to the sum of all existing animals' populations
  let totalPop = 0
  targetHabitat.animals.forEach(animal => {
    totalPop += animal.population
  })

  totalPop += population
  // //prevent behavior below if indicated habitat would be pushed beyond its capacity
  if (totalPop > targetHabitat.capacity) {
    res.statusMessage = "Could not add animal to habitat, new population would be above specified capacity";
    res.status(400).end();
  } else {
    await Animal.create({ name, type, diet, domesticated, population, habitat_id })
    res.send('Created')
  }
})

app.delete('/animals/:id', async (req, res) => {
  const { id } = req.params
  await Animal.destroy({ where: { id } })
  res.send('Deleted!');
})

app.patch('/animals/:id/change_population', async (req, res) => {
  const { id } = req.params
  const { population } = req.body

  await Animal.update({ population }, { where: { id } })

  res.send('Updated!')
})

app.delete('/animals', async (req, res) => {
  await Animal.drop()
  res.send('Deleted EVERYTHING!');
})

// HABITATS
app.get('/habitats', async (req, res) => {
  const habitats = await Habitat.findAll({ include: 'animals' })
  res.json(habitats)
})

app.get('/habitats/:id', async (req, res) => {
  const { id } = req.params
  const habitat = await Habitat.findByPk(id, { include: 'animals' })
  res.json(habitat)
})

app.post('/habitats', async (req, res) => {
  const { name, description, climate, open, capacity } = req.body
  await Habitat.create({ name, description, climate, open, capacity })
  res.json('Created!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})