// Free-text columns were created as STRING (varchar(255)). SQLite does not
// enforce varchar lengths, so real deployments hold longer values; Postgres
// rejects them. Convert those columns to TEXT on Postgres.
// SQLite is skipped: lengths are not enforced there and its changeColumn
// requires a full table rebuild.
const TEXT_COLUMNS = [
  ['cases', 'title', false],
  ['cases', 'description', true],
  ['cases', 'preConditions', true],
  ['cases', 'expectedResults', true],
  ['steps', 'step', false],
  ['steps', 'result', false],
  ['runs', 'description', true],
  ['folders', 'detail', true],
  ['projects', 'detail', true],
];

export async function up(queryInterface, Sequelize) {
  if (queryInterface.sequelize.getDialect() !== 'postgres') return;

  for (const [table, column, allowNull] of TEXT_COLUMNS) {
    await queryInterface.changeColumn(table, column, {
      type: Sequelize.TEXT,
      allowNull,
    });
  }
}

export async function down(queryInterface, Sequelize) {
  if (queryInterface.sequelize.getDialect() !== 'postgres') return;

  for (const [table, column, allowNull] of TEXT_COLUMNS) {
    await queryInterface.changeColumn(table, column, {
      type: Sequelize.STRING,
      allowNull,
    });
  }
}
