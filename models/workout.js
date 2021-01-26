'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class workout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.workout.hasMany(models.comment)
      models.workout.belongsToMany(models.user, {through: "users_workouts"})
    }
  };
  workout.init({
    name: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    apiId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'workout',
  });
  return workout;
};