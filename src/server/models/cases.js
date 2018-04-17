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
            district: {
                type: DataTypes.STRING
            },
            firstContactDate: {
                field: 'first_contact_date',
                type: DataTypes.DATEONLY
            },
            incidentDate: {
                field: 'incident_date',
                type: DataTypes.DATEONLY
            },
            incidentTime: {
                field: 'incident_time',
                type: DataTypes.TIME
            },
            narrativeSummary: {
                field: 'narrative_summary',
                type: DataTypes.STRING(500)
            },
            narrativeDetails: {
                field: 'narrative_details',
                type: DataTypes.TEXT
            },
            createdBy: {
                field: 'created_by',
                type: DataTypes.STRING
            },
            assignedTo: {
                field: 'assigned_to',
                type: DataTypes.STRING
            },
            createdAt: {
                field: 'created_at',
                type: DataTypes.DATE
            },
            updatedAt: {
                field: 'updated_at',
                type: DataTypes.DATE
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
        Case.hasMany(models.civilian, {foreignKey: {name: 'caseId', field: 'case_id'}})
        Case.hasMany(models.attachment, {foreignKey: {name: 'caseId', field: 'case_id'}})
        Case.belongsTo(models.address, { as: "incidentLocation", foreignKey: {name: 'incidentLocationId', field: 'incident_location_id', allowNull: true}})
    }

    return Case
}