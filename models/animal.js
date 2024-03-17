const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './animals.db'
});

const Animal = sequelize.define('Animal', {
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  diet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  domesticated: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  population: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

Animal.sync() 

module.exports = { Animal }