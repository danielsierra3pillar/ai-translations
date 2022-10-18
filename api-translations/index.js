const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const app = express()

app.use(cors())
const connection = mysql.createPool({
    host: 'ai-translations.cpuskbampv3u.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: '123456789',
    database: 'translations',
    port: 3306
})

app.get('/translations', (req, res) => {
    connection.query('select * from translation', (error, results) => {
        const parsed = JSON.stringify(results)
        res.send(JSON.parse(parsed))
    })
})
app.listen(3001, () => {
    console.log('Translations API running')
})