const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xyyby40.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        // ----------------------------------------------
        // CODE START FROM HERE
        // ----------------------------------------------
        const bookCollections = client.db("bookDB").collection("books");
        // Create:
        app.post('/addedBook', async (req, res) => {
            const book = req.body;
            const result = await bookCollections.insertOne(book);
            res.send(result);
        });
        app.get('/addedBook', async(req,res)=>{
            const result= await bookCollections.find().toArray();
            res.send(result);
        })

        // ----------------------------------------------
        // CODE ENDS HERE
        // ----------------------------------------------
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Library is running");
});
app.listen(port, () => {
    console.log(`Library is running on port, ${port}`);
});