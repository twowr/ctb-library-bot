module.exports = (sequelize, Sequelize) => {
    return sequelize.define('player', {
        name: {
            type: Sequelize.DataTypes.STRING,
            unique: true,
            allowNull: false,
        }
    }, {
        timestamps: false,
    })
}