module.exports = (sequelize, DataTypes) => {
    const Groups = sequelize.define(
        'Groups',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                comment: 'Group ID',
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                comment: 'group title',
                // setter to standardize
                set(val) {
                    this.setDataValue(
                        'title',
                        val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
                    );
                }
            },
            description: {
                type: DataTypes.STRING,
                comment: 'group short description',
                // setter to standardize
                set(val) {
                    this.setDataValue(
                        'description',
                        val
                    );
                }
            },
            ownerId: {
                type: DataTypes.UUID,
                comment: 'Group Owner ID',
                allowNull: true,
            },
            metadatas: {
                type: DataTypes.JSON,
                set(val) {
                    this.setDataValue(
                        'metadatas',
                        val
                    );
                },
                allowNull: true,
                comment: 'metadata',
            }
        },
        {
            // logical delete over physical delete
            paranoid: true,
        }
    );

    return Groups;
};
