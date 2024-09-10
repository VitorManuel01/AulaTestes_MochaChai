'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  books.init({
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'books',
  });
  return books;
};

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Certifique-se de que o caminho está correto

const books = sequelize.define('books', {
  title: {
      type: DataTypes.STRING,
      allowNull: false
  },
  author: {
      type: DataTypes.STRING,
      allowNull: false
  },
  year: {
      type: DataTypes.INTEGER,
      allowNull: true
  }
}, {
  sequelize,
  modelName: 'books',
});

module.exports = books;