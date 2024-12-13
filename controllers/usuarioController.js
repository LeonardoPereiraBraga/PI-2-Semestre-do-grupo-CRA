const express = require("express")
const router = express.Router()
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs")
const postagemModel = require("../models/Postagem")
const usuarioModel = require("../models/Usuario")
const funcionarioModel = require("../models/Funcionario")

router.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "style-src 'self' 'blob:' 'unsafe-inline'");
  next();
});



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "public/uploads/");
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
const upload = multer({ storage });

router.get("/", (req,res) => {
  res.redirect("/registro")
})

router.get("/login", (req,res) => {
    res.render("login.ejs")
})
router.post("/login/entrar", async (req,res) => {
    const {email,senha} = req.body
    
    const User = await usuarioModel.findOne({where: {email:email}})
    
    if(User != undefined){
      const correct = bcrypt.compareSync(senha, User.senha)
      if(correct){
        req.session.user = {
          id: User.id,
          email: User.email,
          admin: 0
        }
        res.redirect("/home")
      }else{
        req.flash('error', 'Credenciais Incorretas');
        res.redirect("/login")
      }
    }else{
      req.flash('error', 'Credenciais Incorretas');
      res.redirect("/login")

    }
})


router.get("/registro", (req,res) => {
  if(req.session.user == undefined){
    res.render("registro.ejs")
  
  }else{
    res.redirect("/home")
  }
    
})
router.post("/registro/criar",upload.single("file"), async (req,res) => {
    const {nome,cpf,telefone,email,senha} = req.body
    const fotoPerfil = req.file.filename
    if(isNaN(cpf) || cpf.length < 11){
      req.flash('error', 'Digite um CPF válido');
      res.redirect("/registro")
    }
    else if(isNaN(telefone)){
      req.flash('error', 'Digite um Número válido');
      res.redirect("/registro")
    }
    else{
    const User = await usuarioModel.findOne({where:{email:email}})
    if(User != undefined){
      req.flash('error', 'Já existe um Usuario associado a este Email');
      res.redirect("/registro")
    }
    else{
    console.log(User)
    // A FAZER: VERIFICAR SE JA TEM ALGUIEM COM ESSE EMAIL
    let salt = bcrypt.genSaltSync(10)
    let passwordCryptada = bcrypt.hashSync(senha,salt)
    usuarioModel.create({
      nome: nome,
      cpf: cpf,
      telefone: telefone,
      email: email,
      senha: passwordCryptada,
      fileName: fotoPerfil
    }).then((usuario) => {
      req.session.user = {
        id: usuario.id,
        email: usuario.email,
        admin: 0
      }
      console.log(req.session.user)
      res.redirect("/home")
    })}}
})
router.get("/home", async (req,res) => {
  if(req.session.user == undefined){
    res.redirect("/registro")
  }
  else if(req.session.user.admin == 1){
    res.redirect("/funcionario/home")
  }
  
  else{
    const usuarios = await usuarioModel.findAll()
    console.log(req.session.user)
    const postagens = await postagemModel.findAll()
    let session;
    if(req.session.user.admin == 1){
      session = await funcionarioModel.findByPk(req.session.user.id)
    }else{
      session = await usuarioModel.findByPk(req.session.user.id)
    }
    console.log("sua session é" + session)
    const isAdmin = req.session.user.admin
    res.render("home.ejs", {usuarios: usuarios, session: session, postagens: postagens, isAdmin:isAdmin})
    
  }
})

router.get("/deslogar", (req,res) => {
  req.session.user = undefined
  res.redirect("/home")
})

router.get("/historico", async (req,res) => {
  const session = await usuarioModel.findByPk(req.session.user.id)
  const postagens = await postagemModel.findAll({where: {usuarioId: req.session.user.id}})
  res.render("notificacoes.ejs", {session:session, isAdmin: 0, postagens: postagens})

})
  
  


module.exports = router

