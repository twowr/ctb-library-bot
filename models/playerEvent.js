module.exports = (sequelize, Sequelize) => {
    return sequelize.define('event', {
        event_id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        date: {
            type: Sequelize.DataTypes.DATEONLY,
            allowNull: false,
        },
        title: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        body: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timestamps: false,
    })
}