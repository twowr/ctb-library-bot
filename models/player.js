module.exports = (sequelize,  Sequelize) => {
    return sequelize.define('player', {
        player: {
            type: Sequelize.DataTypes.STRING,
            unique: true,
            allowNull: false,
        }
    }, {
        timestamps: false,
    })
}