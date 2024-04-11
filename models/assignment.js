const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Assignment', {
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });

  return sequelize
}