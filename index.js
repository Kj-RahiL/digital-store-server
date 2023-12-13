const express = require('express');
const app = express()
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.port || 8000;

// middleware
app.use(cors())
app.use(express.json())


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
    const cartCollection = client.db('productDB').collection('myCart')
    const blogCollection = client.db('productDB').collection('blogs')
    const serviceCollection = client.db('productDB').collection('services')

    // create product collection
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

    // my cart
    app.post('/myCart', async(req,res)=>{
      const newCart = req.body
      console.log(newCart)
      const result = await cartCollection.insertOne(newCart)
      res.send(result)
    })
    
    app.get('/myCart', async(req,res)=>{
      const cursor = cartCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.delete('/myCart/:id', async(req, res)=>{
      const id = req.params.id;
      console.log(id)
      const query= {_id:new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })

    // blog collection
    app.get('/blogs', async(req,res)=>{
      const result= await blogCollection.find().toArray()
      res.send(result)
    })

    // services collection
    app.get('/services', async(req,res)=>{
      const result= await serviceCollection.find().toArray()
      res.send(result)
    })

    app.get('/services/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await serviceCollection.findOne(query)
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