'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users_workouts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  users_workouts.init({
    userId: DataTypes.INTEGER,
    workoutId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users_workouts',
  });
  return users_workouts;
};