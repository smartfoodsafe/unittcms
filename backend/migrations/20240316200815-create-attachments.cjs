module.exports = {
  up: async (queryInterface, Sequelize) => {
  await queryInterface.createTable('attachments', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    detail: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    path: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
  },

  down: async (queryInterface) => {
  await queryInterface.dropTable('attachments');
  }
};