const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(cors())

//MongoDB
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.jvbgqui.mongodb.net/?retryWrites=true&w=majority`;

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
    // client.connect();
    const carsCollection = client.db('toyCars').collection('products');


    app.get('/products', async (req, res) => {
      let query = {};
      if (req.query?.email) {
          query = { email: req.query.email }
      }
      const cursor = carsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
  })

  app.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await carsCollection.findOne(query);
    res.send(result);
})

app.put('/products/:id', async(req, res) => {
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = { upsert: true };
  const updatedToys = req.body;

  const toy = {
      $set: {
        customerName: updatedToys.customerName, 
        name: updatedToys.name, 
        sub_category: updatedToys.sub_category, 
        price: updatedToys.price, 
        short_description: updatedToys.short_description, 
        email: updatedToys.email, 
        rating: updatedToys.rating,
        image:updatedToys.image,
      }
  }

  const result = await carsCollection.updateOne(filter,toy, options);
  res.send(result);
})


app.post('/products', async (req, res) => {
  const product = req.body;
  console.log(product);
  const result = await carsCollection.insertOne(product);
  res.send(result);
});

app.delete('/products/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await carsCollection.deleteOne(query);
  res.send(result);
})

    // Send a ping to confirm a successful 
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Toys car')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})