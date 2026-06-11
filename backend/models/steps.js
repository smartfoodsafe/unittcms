function defineStep(sequelize, DataTypes) {
  const Step = sequelize.define(
    'Step',
    {
      step: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      result: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { tableName: 'steps' }
  );

  Step.associate = (models) => {
    Step.belongsToMany(models.Case, {
      through: 'caseSteps',
    });
  };

  return Step;
}

export default defineStep;
