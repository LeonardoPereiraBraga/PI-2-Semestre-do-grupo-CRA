const express = require("express")
const router = express.Router()
const postagemModel = require("../models/Postagem")
const usuarioModel = require("../models/Usuario")
const funcionarioModel = require("../models/Funcionario")
const multer = require("multer");
const path = require("path");
const Postagem = require("../models/Postagem");
const session = require("express-session")

router.get("/funcionario", (req,res) => {
    res.render("funcionarioLogin.ejs")
})

router.post("/funcionario/auth", async (req,res) => {
    const {email,senha} = req.body
    const Funcionario = await funcionarioModel.findOne({where: {email:email}})
    if(Funcionario != undefined){
        if(senha == Funcionario.senha){
          req.session.user = {
            id: Funcionario.id,
            email: Funcionario.email,
            admin: 1
          }
          res.redirect("/funcionario/home")
        }else{
          req.flash('error', 'Credenciais Incorretas');
          res.redirect("/funcionario")
        }
      }else{
        req.flash('error', 'Credenciais Incorretas');
        res.redirect("/funcionario")
  
      }
})

router.get("/funcionario/home", async (req,res) => {
    if(req.session.user == undefined){
        res.redirect("/home")
      }else if(req.session.user.admin == 0){
        console.log("Caiu aqui")
        res.redirect("/registro")
      }
     
      
      else{
        console.log(req.session.user.admin)
        const usuarios = await usuarioModel.findAll()
        const postagens = await postagemModel.findAll({
            order: [['createdAt', 'DESC']]})
        const session = await funcionarioModel.findByPk(req.session.user.id)
        const isAdmin = req.session.user.admin
        console.log(isAdmin)
        res.render("FuncionarioHome.ejs", {usuarios: usuarios, session: session, postagens: postagens, isAdmin: isAdmin})
      }
})

module.exports = router