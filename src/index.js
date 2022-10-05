const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();


const app = express();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => console.log('Servidor em funcionamento.'));

app.use(express.json());

app.use(cors());

// *** INÍCIO DO BLOCO DISCIPLINAS ***
// Listando todas as disciplinas
app.get('/disciplinas', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM DISCIPLINAS')
        return res.status(200).send(rows)
    } catch(err) {
        return res.status(400).send(err)
    }
});

// Adicionar Disciplina
app.post('/add-disciplina', async (req, res) => {
    const { nome } = req.body;
    try {
        const disciplina = await pool.query('INSERT INTO DISCIPLINAS (nome) VALUES ($1) RETURNING *', [nome])
        return res.status(200).send(disciplina.rows)
    } catch(err) {
        return res.status(400).send(err)
    }
});

// Editar Disciplina
app.put('/editar-disciplina/:id', async (req, res) => {
    const { id, nome } = req.params;
    const data = req.body;
    try {
        const disciplina = await pool.query('UPDATE DISCIPLINAS SET nome = ($2) WHERE id = ($1) RETURNING *', [id, data.nome])
        return res.status(400).send(disciplina.rows)
    } catch(err) {
        return res.status(400).send(err)
    }
});

// Excluir Disciplina
app.delete('/excluir-disciplina/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const excluida = await pool.query('DELETE FROM DISCIPLINAS WHERE id = ($1) RETURNING *', [id])
        return res.status(200).send({
            message: 'Disciplina excluída.'
        })
    } catch(err) {
        return res.status(400).send(err)
    }
});

// *** FIM DO BLOCO DISCIPLINA ***


// *** INÍCIO DO BLOCO LIVROS ***
// Listando todos os livros
app.get('/livros', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM LIVROS')
        return res.status(200).send(rows)
    } catch(err) {
        return res.status(400).send(err)
    }
});

// Listando os livros por Disciplina específica
app.get('/livros/:id_disciplina', async (req, res) => {
    const { id_disciplina } = req.params;    
    try {
        const { rows } = await pool.query('SELECT * FROM LIVROS WHERE id_disciplina = ($1)', [id_disciplina])
        return res.status(200).send(rows)
    } catch(err) {
        return res.status(400).send(err)
    }
});

// Adicionar Livro
app.post('/add-livro', async (req, res) => {
    const { nome, id_disciplina } = req.body;
    try {
        const livro = await pool.query('INSERT INTO LIVROS (nome, id_disciplina) VALUES ($1, $2) RETURNING *', [nome, id_disciplina])
        return res.status(200).send(livro.rows)
    } catch(err) {
        return res.status(400).send(err)
    }
});

// Editar Livro
app.put('/editar-livro/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const livro = await pool.query('UPDATE LIVROS SET nome = ($2), id_disciplina = ($3) WHERE id = ($1) RETURNING *', [id, data.nome, data.id_disciplina])
        return res.status(400).send(livro.rows)
    } catch(err) {
        return res.status(400).send(err)
    }
});

// Excluir Livro
app.delete('/excluir-livro/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const excluido = await pool.query('DELETE FROM LIVROS WHERE id = ($1) RETURNING *', [id])
        return res.status(200).send({
            message: 'Livro excluído.'
        })
    } catch(err) {
        return res.status(400).send(err)
    }
});

// *** FIM DO BLOCO LIVROS ***