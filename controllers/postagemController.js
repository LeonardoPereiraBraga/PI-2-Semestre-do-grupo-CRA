const express = require("express")
const router = express.Router()
const postagemModel = require("../models/Postagem")
const usuarioModel = require("../models/Usuario")
const funcionarioModel = require("../models/Funcionario")
const multer = require("multer");
const path = require("path");
const Postagem = require("../models/Postagem");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "public/postagens/");
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
const upload = multer({ storage });


router.get("/postagem", async (req,res) => {
  if(req.session.user == undefined){
    res.redirect("/registro")
  }
  if(req.session.user.admin == 1){
    res.redirect("/funcionario/home")
  }

  else{
    const usuarios = await usuarioModel.findAll()
    let session
    if(req.session.user.admin == 1) session = await funcionarioModel.findByPk(req.session.user.id)
    else session = await usuarioModel.findByPk(req.session.user.id)
    console.log("sua session é" + session)
    res.render("postagem.ejs", {usuarios: usuarios, session: session, isAdmin: req.session.user.admin})
  }
})

router.post("/postagem/save",upload.single("file"),(req,res) => {
    const {nome,idade,localidade,data,informacoes} = req.body
    const fotoDesaparecido = req.file.filename
    const dataAno = data.split("-")
    if(dataAno[0] > 2024 || dataAno[0] <= 0){
      req.flash('error', 'Digite uma data válida');
      res.redirect("/postagem")
    }
    else if(isNaN(idade) || idade > 200){
      req.flash('error', 'Digite uma idade válida');
      res.redirect("/postagem")
    }
    else{
    postagemModel.create({
        nome: nome,
        idade: idade,
        ultima_localidade: localidade,
        foto: fotoDesaparecido,
        informacoes_adicionais: informacoes,
        data: data,
        aprovar: 0, 
        usuarioId: req.session.user.id
    }).then(() => {
        req.flash('success', 'Postagem realizada com sucesso! Aguarde a aprovação de um Admin');
        res.redirect("/home")
    }).catch((error) => {
        console.log(error)
    })}
})

router.get("/postagem/detalhes/:id" , async (req,res) => {
  const postagem = await postagemModel.findByPk(req.params.id)
  console.log(postagem)
  let session
  if(req.session.user.admin == undefined) req.session.user.admin = 0
  else if(req.session.user.admin == 1) session = await funcionarioModel.findByPk(req.session.user.id)
  else session = await usuarioModel.findByPk(req.session.user.id)
    res.render("detalhes.ejs",{session:session, postagem:postagem, isAdmin: req.session.user.admin})
})



router.get("/postagem/aprovar/:id",(req,res) => {
  const id = req.params.id
  Postagem.update({aprovar: 1}, {where: {id:id}})
  req.flash('success', 'Postagem Aprovada');
  res.redirect("/funcionario/home")
})
router.get("/postagem/recusar/:id",(req,res) => {
  const id = req.params.id
  Postagem.update({aprovar: 2}, {where: {id:id}})
  req.flash('success', 'Postagem Recusada');
  res.redirect("/funcionario/home")
})

router.get("/sobre", async (req,res) => {
  let session
  if(req.session.user.admin == undefined) req.session.user.admin = 0
  else if(req.session.user.admin == 1) session = await funcionarioModel.findByPk(req.session.user.id)
  else session = await usuarioModel.findByPk(req.session.user.id)
  res.render("sobre.ejs", {session:session, isAdmin: req.session.user.admin})
})

router.get("/apoia", async (req,res) => {
  let session
  if(req.session.user.admin == undefined) req.session.user.admin = 0
  else if(req.session.user.admin == 1) session = await funcionarioModel.findByPk(req.session.user.id)
  else session = await usuarioModel.findByPk(req.session.user.id)
  res.render("apoia.ejs", {session:session, isAdmin: req.session.user.admin})

})

module.exports = router