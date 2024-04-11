const { Sequelize } = require('sequelize');

module.exports = () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './zoo.db'
  });

  require('./habitat')(sequelize)
  require('./employee')(sequelize)
  require('./assignment')(sequelize)

  const { Habitat, Employee, Assignment } = sequelize.models

  Habitat.belongsToMany(Employee, { through: Assignment })
  Employee.belongsToMany(Habitat, { through: Assignment })

  Employee.sync()
  Assignment.sync()
  Habitat.sync()
  return sequelize
}