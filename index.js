//# all required 
const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');

//#port setup
const port = process.env.PORT || 5000
//# used cors
app.use(cors())
//# json req body parser 
app.use(express.json())


//# MongoDb Setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7incky7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const DB = client.db("Ecom");
        const productsCollection = DB.collection("products")
        const usersCollection = DB.collection("users")

        //# Products Get Api
        app.get('/products', async (req, res) => {
            const products = await productsCollection.find({}).toArray()
            res.send(products)
        })

        app.post('/signup', async (req, res) => {
            const data = req.body
            const result = await usersCollection.insertOne(data)
            res.send(result)
        })


    } finally {
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Ecom Server is running!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})