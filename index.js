const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const userBorrowBookCollections = client.db("userInfoDB").collection("userInfo");
        const borrowBookCollections = client.db("bookBorrowPageDB").collection("borrowBooksPage");
        // Create:
        app.post('/addedBook', async (req, res) => {
            const book = req.body;
            const result = await bookCollections.insertOne(book);
            res.send(result);
        });
        app.get('/addedBook', async(req,res)=>{
            const result= await bookCollections.find().toArray();
            res.send(result);
        });
        // Borrowed Books Users:
        app.post('/userInfo', async (req, res) => {
            const userInformation = req.body;
            console.log(userInformation);
            const result = await userBorrowBookCollections.insertOne(userInformation);
            res.send(result);
        });
        app.get('/userInfo', async(req,res)=>{
            const result= await userBorrowBookCollections.find().toArray();
            res.send(result);
        });
        // Borrowed Books:
        app.post('/borrowedPageBooks', async (req, res) => {
            const borrowBookPage = req.body;
            const result = await borrowBookCollections.insertOne(borrowBookPage);
            res.send(result);
        });
        app.get('/borrowedPageBooks', async(req,res)=>{
            const result= await borrowBookCollections.find().toArray();
            res.send(result);
        });

        // updateQuantity:
        app.get('/addedBook/:id', async(req,res)=>{
            const id= req.params.id;
            const query={_id: new ObjectId(id)};
            const result= await bookCollections.findOne(query);
            res.send(result);
        })
        app.patch('/addedBook/:id', async(req,res)=>{
            const id= req.params.id;
            const filter= {_id: new ObjectId(id)};
            const options= {upsert: true};
            const updatedQuantity= req.body;
            const updateQuantity={
                $set:{
                     bookQuantity:updatedQuantity.quantity
                }
            }
            const result= await bookCollections.updateOne(filter, updateQuantity, options);
            res.send(result);
        })
        // Delete:
        app.delete('/borrowedPageBooks/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id: new ObjectId(id)};
            const result = await borrowBookCollections.deleteOne(query);
            res.send(result);
        })
        app.get('/borrowedPageBooks/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id: new ObjectId(id)};
            const result = await borrowBookCollections.findOne(query);
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