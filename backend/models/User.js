module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    username: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(191),
      allowNull: false,
      unique : 'uniqueIndex'
    },
    mail_visible: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 1
    },
    password: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    biography : Sequelize.TEXT,
    image: Sequelize.STRING(191),
    sex: {
      type: Sequelize.STRING(1),
      allowNull: false
    },
    date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    timestamps: false
  });

  return User;
};