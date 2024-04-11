const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Habitat = sequelize.define('Habitat', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    climate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    open: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  return sequelize
}