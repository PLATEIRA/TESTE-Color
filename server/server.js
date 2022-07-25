const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var mysql = require('mysql');

// Inicializa o servidor web
const app = express();

// Configura o disparo de e-mail
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || "aryelly.jordanna@unemat.br",
    pass: process.env.EMAIL_PASS || "caqdlaxxirzcynbi",
  },
});

// Configura a conexão com o Banco de dados
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
});

function validateForm (nome = '', email = '', mensagem = '') {
  let valido = true;

  if (
    typeof nome !== 'string' ||
    nome.indexOf(" ") === -1 ||
    nome.length <= 3
  ) {
    console.error("Nome não é válido", typeof nome);
    valido = false;
  } else if (
    typeof email !== 'string' ||
    email.indexOf("@") === -1 ||
    email.indexOf(".") === -1 ||
    email.length <= 5
  ) {
    console.error("E-mail não é válido");
    valido = false;
  } else if (
    typeof mensagem !== 'string' ||
    mensagem.length <= 5
  ) {
    console.error("Mensage não é válido");
    valido = false;
  }

  return valido
}

// Para usar JSON no body da request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Server Config
app.use(methodOverride('X-HTTP-Method'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('X-Method-Override'));
app.use(methodOverride('_method'));

// Router
app.post('/form-message', async (req, res, next) => {
  if (!validateForm(req.body.name, req.body.email, req.body.message)) {
    console.error("Formulário não é válido");
    return res.sendStatus(403);
  }

  // Envio do e-mail
  try {
    await transporter.sendMail({
      from: 'aryelly.jordanna@unemat.br', // sender address
      to: req.body.email, // list of receivers
      subject: "Olá Tudo bem? ✔", // Subject line
      text: req.body.message, // plain text body
      html: `<b>${req.body.message}</b>`, // html body
    });

    console.log("E-mail enviado!");
  } catch (e) {
    console.error("Erro ao enviar o email");
    return res.sendStatus(500);
  }

  try {
    const query = 'INSER INTO testevaga (nome, email, mensagem) values ?'
    const values = [req.body.name, req.body.email, req.body.message];

    connection.connect();
    connection.query(query, values, function (error, results, fields) {
      if (error) res.sendStatus(500);
    });
  }  catch (e) {
    console.error("Erro ao salvar no banco de dados");
    return res.sendStatus(500);
  }

  res.sendStatus(200);
});

// se chegar a executar essa parte após os routers é porque nao encontrou a página
app.use((request, response, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Trata erros acontecidos nos processos acima
app.use((err, request, response) => {
  response.status(err.status || 500).json({ err: err.message });
});

// Server Listner
const server = app.listen(8080, () => {
  const host = server.address().address;
  const { port } = server.address();
  console.log('Example app listen att http://%s:%s', host, port);
});
