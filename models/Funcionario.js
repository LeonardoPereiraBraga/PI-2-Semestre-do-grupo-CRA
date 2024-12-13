const Sequelize = require("sequelize")
const connection = require("../database/db")



const Funcionario = connection.define("funcionarios",{
    nome: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    cpf: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    telefone: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    senha: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})



Funcionario.sync({force: false})



module.exports = Funcionario