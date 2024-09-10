const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
const port = 5500;

const Book = require('./models/books');

// Configurando o EJS como template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));


// Middleware para parsing de JSON e urlencoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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

// Rota para a página inicial (home.ejs)
app.get('/home', (req, res) => {
    res.render('home'); // Renderiza o arquivo home.ejs na rota /home
});

// Rota para a página de cadastros (index.ejs)
app.get('/cadastro', (req, res) => {
    res.render('cadastro'); // Renderiza o arquivo index.ejs na rota /
});

app.get('/sobre', (req, res) => {
    res.render('sobre'); 
});


// Rota para processar o formulário de adição de livros
// app.post('/adicionar-livro', (req, res) => {
//     let data = { title: req.body.title, author: req.body.author, year: req.body.year };
//     let sql = "INSERT INTO books SET ?";
//     db.query(sql, data, (err, results) => {
//         if (err) {
//             console.error('Erro ao inserir dados:', err);
//             throw err;
//         }
//         res.redirect('/'); // Redireciona de volta para a página inicial de cadastros
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
        console.error('Erro ao salvar a apólice:', error);
        res.status(500).send('Erro ao salvar a apólice.');
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



// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
