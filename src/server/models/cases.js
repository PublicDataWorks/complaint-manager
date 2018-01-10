module.exports = (sequelize, DataTypes) => {
    return sequelize.define('cases', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            field: 'first_name',
            type: DataTypes.STRING(25)
        },
        lastName: {
            field: 'last_name',
            type: DataTypes.STRING(25)
        },
        status: {
            type: DataTypes.ENUM([
                'Initial', 'Active', 'Forwarded', 'Suspended', 'Complete'
            ]),
            defaultValue: 'Initial'
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE
        }
    })
}