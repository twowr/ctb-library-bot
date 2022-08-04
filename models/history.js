module.exports = (sequelize, DataTypes) => {
    return sequelize.define('player', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        when: {
            type: DataTypes.STRING,
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