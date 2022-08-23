const Player = (sequelize, Sequelize) => sequelize.define('player', {
    name: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        allowNull: false,
    }
}, {
    timestamps: false,
})

module.exports = { Player }