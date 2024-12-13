const Sequelize = require("sequelize")
const connection = new Sequelize('CRA','root', 'suasenhaaqui', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00',
    logging: false
})

module.exports = connection