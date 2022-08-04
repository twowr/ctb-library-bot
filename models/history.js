module.exports = (sequelize, DataTypes) => {
    return sequelize.define('player', {
        section_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        when: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        whp: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        witi: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
}