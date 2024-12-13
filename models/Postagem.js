const Sequelize = require("sequelize")
const connection = require("../database/db")
const usuarioModel = require("../models/Usuario")


const Postagem = connection.define("postagens",{
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idade: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ultima_localidade: {
        type: Sequelize.TEXT
    },
    foto: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    informacoes_adicionais: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    data: {
        type: Sequelize.DATE,
        allowNull: true
    },
    aprovar: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
})

usuarioModel.hasMany(Postagem)
Postagem.belongsTo(usuarioModel)

Postagem.sync({force: false})
module.exports = Postagem