//# all required 
const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken');

//#port setup
const port = process.env.PORT || 5000
//# used cors
app.use(cors())
//# json req body parser 
app.use(express.json())






app.get('/', (req, res) => {
    res.send('Ecom Server is running!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})