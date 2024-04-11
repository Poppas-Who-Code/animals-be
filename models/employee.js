const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Employee', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qualifications: {
      type: DataTypes.STRING,
      allowNull: false
    },
    allergies: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hire_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    employment_status: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });

  return sequelize
}