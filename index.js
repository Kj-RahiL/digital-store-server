const express = require('express');
const app = express()
require('dotenv').config()
const cors = require('cors');
const port = process.env.port || 8000;

// middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uma9m7n.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db('productDB').collection('product')

    // create
    app.post('/product', async(req,res)=>{
      const user = req.body
      const result = await productCollection.insertOne(user)
      res.send(result)
    })

    // read
    app.get('/product', async(req,res)=>{
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/details/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
    })
    app.get('/updateProduct/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
    })

    // update
    app.put('/updateProduct/:id', async(req,res)=>{
      const id = req.params.id
      const product = req.body
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updateProduct = {
        $set: {
          name: product.name, 
          brandName: product.brandName, 
          category: product.category, 
          image: product.image, 
          price: product.price, 
          rating : product.rating,
          details: product.details

        },
      }
      console.log(updateProduct)
      const result = await productCollection.updateOne(filter, updateProduct, options);
      res.send(result)
    })
    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('My Digital server is running')
  })
  
  app.listen(port, () => {
    console.log(`MY digital store server is running on port: ${port}`)
  })