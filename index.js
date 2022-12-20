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

        //#  User Signup Function
        app.post('/signup', async (req, res) => {
            const data = req.body
            const result = await usersCollection.insertOne(data)
            res.send(result)
        })

        //# JWT Access Token Create && User Login Function
        app.get('/login', async (req, res) => {
            const email = req.query.email
            const password = req.query.password
            const query = { email: email, password: password }
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN);
                const credential = { accessToken: token, name: user.name, email: user.email }
                return res.send(credential)
            }
            res.status(403).send({ accessToken: '' })

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