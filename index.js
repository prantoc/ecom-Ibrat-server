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

//# JWT Access Token verify
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unathorized Access !' })
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden Access!' })
        }
        req.decoded = decoded
        next()
    });
}




async function run() {
    try {
        const DB = client.db("Ecom");
        const productsCollection = DB.collection("products")
        const usersCollection = DB.collection("users")
        const cartCollection = DB.collection("usersCart")

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

        //#  Add to cart product
        app.post('/add-cart', verifyJWT, async (req, res) => {
            const data = req.body
            const query = { productId: data.productId }
            const getProduct = await cartCollection.findOne(query);
            if (getProduct) {
                const updateDoc = {
                    $set: {
                        quantity: getProduct.quantity + 1,
                        price: getProduct.price + data.price
                    },
                };

                const result = await cartCollection.updateOne(query, updateDoc);
                res.send(result)

            } else {
                const result = await cartCollection.insertOne(data)
                res.send(result)
            }

        })
        //#  get all products
        app.get('/storedProducts', verifyJWT, async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const result = await cartCollection.find(query).toArray();
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