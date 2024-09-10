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


const Book = require('./models/books');
// Conexão com MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cimatec',
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
app.get('/cadastro', (req, res) => {
    res.render('cadastro');
});
// app.post('/adicionar-livro', (req, res) => {
//     let data = { title: req.body.title, author: req.body.author, year: req.body.year };
//     let sql = "INSERT INTO books SET ?";
//     db.query(sql, data, (err, results) => {
//         if (err) {
//             console.error('Erro ao inserir dados:', err);
//             throw err;
//         }
//         res.redirect('/');
//     });
// });

app.post('/adicionar-livro', async (req, res) => {
    const {
        title,
        author,
        year
    } = req.body;

    // Criar um objeto com todos os dados recebidos
    const book = {
        title,
        author,
        year
    };

    try {
        // Salvar a apólice no banco de dados usando Sequelize
        const novoBook = await Book.create(book);

        // Redirecionar para a página de apólices após o salvamento
        res.redirect('/');
    } catch (error) {
        console.error('Erro ao salvar a Livro:', error);
        res.status(500).send('Erro ao salvar a Livro.');
    }
});

app.get('/livros', async (req, res) => {
    try {
        const allBooks = await Book.findAll();
        res.render('livros', {Book: allBooks })
    } catch (error) {
        res.status(500).send('Erro ao buscar livros: ' + error.message);
    }
});

app.delete('/livros/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Book.destroy({ where: { id } });
        res.redirect('/livros'); // Redireciona para a lista de livros após a exclusão
    } catch (error) {
        res.status(500).send('Erro ao deletar o livro: ' + error.message);
    }
});

describe('Testes da Aplicação Express', function() {

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

    it('Deve carregar a página livros com os livrros do banco',  function(done){
        request(app)
            .get('/livros')
            .expect('Content-Type', /html/)
            .expect(200, done)
    })
    it('Deve deletatar um livro na página dos livros', function(done){
        request(app)
        .delete('/livros/1')
        .expect('Location', '/livros')
        .expect(302, done)
    })
});
