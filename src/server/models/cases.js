module.exports = (sequelize, DataTypes) => {
    const Case = sequelize.define('cases', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            complainantType: {
                type: DataTypes.ENUM([
                    'Civilian', 'Police Officer'
                ]),
                defaultValue: 'Civilian',
                field: 'complainant_type',
            },
            status: {
                type: DataTypes.ENUM([
                    'Initial', 'Active', 'Forwarded', 'Suspended', 'Complete'
                ]),
                defaultValue: 'Initial'
            },
            firstContactDate: {
                field: 'first_contact_date',
                type: DataTypes.DATE
            },
            createdAt: {
                field: 'created_at',
                type: DataTypes.DATE
            },
            updatedAt: {
                field: 'updated_at',
                type: DataTypes.DATE
            },
            narrative: {
                field: 'narrative',
                type: DataTypes.TEXT
            }
        },
        {
            hooks: {
                beforeUpdate: (instance, options) => {
                    if (instance.status === 'Initial') {
                        instance.status = 'Active'
                    }
                }
            },
        },
    )

    Case.associate = (models) => {
        Case.hasMany(models.civilian, {foreignKey: 'case_id'})
    }

    return Case
}