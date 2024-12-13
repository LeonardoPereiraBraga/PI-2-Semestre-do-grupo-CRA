const Sequelize = require("sequelize")
const connection = require("../database/db")


const Usuario = connection.define("usuarios",{
    nome: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false
    },
    telefone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fileName: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Usuario.sync({force: false})
module.exports = Usuario