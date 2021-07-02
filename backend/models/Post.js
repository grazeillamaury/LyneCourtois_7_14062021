module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("post", {
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING(191)
    },
    liked: {
      type: Sequelize.TEXT,
      defaultValue: 0
    },
    pinned: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    timestamps: false
  });

  return Post;
};