
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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

  return sequelize
}