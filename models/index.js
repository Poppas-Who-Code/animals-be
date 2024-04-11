const { Sequelize } = require('sequelize');

module.exports = () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './animals.db'
  });

  require('./habitat')(sequelize)
  require('./animal')(sequelize)

  const { Animal, Habitat } = sequelize.models

  Animal.belongsTo(Habitat, { foreignKey: 'habitat_id', as: 'habitat' })
  Habitat.hasMany(Animal, { foreignKey: 'habitat_id', as: 'animals' })

  Animal.sync()
  Habitat.sync()
  return sequelize
}