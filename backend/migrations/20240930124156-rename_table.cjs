module.exports = {
  up: async (queryInterface) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */

  await queryInterface.renameColumn('users', 'createdAt', 'created_at');
  await queryInterface.renameColumn('users', 'updatedAt', 'updated_at');
  await queryInterface.renameColumn('users', 'avatarPath', 'avatar_path');
  },

  down: async () => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  }
};