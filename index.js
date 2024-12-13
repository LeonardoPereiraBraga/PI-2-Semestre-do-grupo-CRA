const express = require("express")
const app = express()
const connection = require("./database/db")
const session = require("express-session")
const flash = require('connect-flash');

//Controllers
const usuarioController = require("./controllers/usuarioController")
const postagemController = require("./controllers/postagemController")
const funcionarioController = require("./controllers/funcionarioController")
//Models
const Postagem = require("./models/Postagem")
const Usuario = require("./models/Usuario")
const Funcionario = require("./models/Funcionario")

app.set('view engine', 'ejs')

app.use(session({
    secret: "qualquercoisa",
    cookie: {maxAge: 3600000 } //Deslogar depois de 3600000ms(1Hora)
}))

app.use(express.static('public')) //Carregando arquivos do Front-End
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(flash());

// Middleware para passar mensagens flash para as views
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('success');
  res.locals.errorMessage = req.flash('error');
  next();
});

connection.authenticate().then(() => {
    console.log("Conexao feita com o Banco de Dados")
}).catch((error) => {
    console.log(error)
})

//Controllers
app.use("/", usuarioController)
app.use("/", postagemController)
app.use("/", funcionarioController)

app.listen(8080, () => {
    console.log('%cAbra o localhost no seu navegador: http://localhost:8080', 'color: blue; text-decoration: underline;');
})