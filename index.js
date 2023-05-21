const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rin8xcl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const addToyCollection = client.db('eduToys').collection('addToys');

    // 1. POST to addToys
    app.post('/addToys', async (req, res) => {
      const addToy = req.body;
      const result = await addToyCollection.insertOne(addToy);
      res.send(result);
    });

    // 2. GET for all toys
    app.get('/addToys', async (req, res) => {
      const cursor = addToyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // 3. GET myToys by email
    app.get('/myToys/:email', async (req, res) => {
      const result = await addToyCollection
        .find({ sellerEmail: req.params.email })
        .toArray();
      res.send(result);
    });

    // 4. DELETE data from myToys by id
    app.delete('/myToys/:email/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addToyCollection.deleteOne(query);
      res.send(result);
    });

    // 5. UPDATE data in myToys by id
    app.put('/updateToy/:id', async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          productName: body.productName,
          sellerName: body.sellerName,
          sellerEmail: body.sellerEmail,
          imgUrl: body.imgUrl,
          price: body.price,
          rating: body.rating,
          quantity: body.quantity,
          subCategory: body.subCategory,
          description: body.description,
        },
      };
      const result = await addToyCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // 6. GET data for a single toy by id
    app.get('/addToys/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const options = {
          projection: { productName: 1, price: 1, description: 1, imgUrl: 1 },
        };
        const result = await addToyCollection.findOne(query, options);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });

    // 7. GET data for all toys based on search text
    app.get('/toySearch/:text', async (req, res) => {
      try {
        const searchText = req.params.text;
        const result = await addToyCollection
          .find({
            $or: [
            
              { subCategory: { $regex: searchText, $options: 'i' } },
            ],
          })
          .toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('edukids server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
