module.exports = {
  up: async (queryInterface, Sequelize) => {
  await queryInterface.createTable('comments', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    commentableType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    commentableId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  // Add composite index for efficient polymorphic queries
  await queryInterface.addIndex('comments', ['commentableType', 'commentableId'], {
    name: 'comments_commentable_index',
  });
  },

  down: async (queryInterface) => {
  await queryInterface.dropTable('comments');
  }
};