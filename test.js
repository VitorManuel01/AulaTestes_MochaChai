const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Configuração do app para testes
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'aulateste'
});
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        throw err;
    }
    console.log('Conectado ao MySQL!');
});

// Rotas
app.get('/home', (req, res) => {
    res.render('home');
});
app.get('/', (req, res) => {
    res.render('index');
});
app.post('/adicionar-livro', (req, res) => {
    let data = { title: req.body.title, author: req.body.author, year: req.body.year };
    let sql = "INSERT INTO books SET ?";
    db.query(sql, data, (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            throw err;
        }
        res.redirect('/');
    });
});

describe('Testes da Aplicação Express', function() {
    it('Deve carregar a página inicial', function(done) {
        request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200, done);
    });

    it('Deve carregar a página home', function(done) {
        request(app)
            .get('/home')
            .expect('Content-Type', /html/)
            .expect(200, done);
    });

    it('Deve adicionar um livro e redirecionar para a página inicial', function(done) {
        request(app)
            .post('/adicionar-livro')
            .send({ title: 'Teste Livro', author: 'Autor Teste', year: 2024 })
            .expect('Location', '/')
            .expect(302, done);
    });
});
