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
        phoneNumber: {
            field: 'phone_number',
            type: DataTypes.DECIMAL(10, 0)
        },
        email: {
            field: 'email',
            type: DataTypes.STRING
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
    }, {
        hooks: {
            beforeUpdate: (instance, options) => {
                if (instance.status === 'Initial') {
                    instance.status = 'Active'
                }
            }
        }
    })
}