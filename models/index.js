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

  Assignment.belongsTo(Employee, { as: "employee", foreignKey: "employee_id", })
  Employee.hasMany(Assignment, { as: "assignments", foreignKey: "employee_id" })

  Assignment.belongsTo(Habitat, { as: "habitat", foreignKey: "habitat_id" })
  Habitat.hasMany(Assignment, { as: "assignments", foreignKey: "habitat_id" })


  Habitat.belongsToMany(Employee, { through: Assignment, as: "employees", foreignKey: 'habitat_id' })
  Employee.belongsToMany(Habitat, { through: Assignment, as: "habitats", foreignKey: 'employee_id' })

  Employee.sync()
  Assignment.sync()
  Habitat.sync()
  return sequelize
}