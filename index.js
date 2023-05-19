const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app=express();
const port=process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())

//eduToys
//9dMNcIMYCyXrIa5c
console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rin8xcl.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const addToyCollection=client.db('eduToys').collection('addToys')
  app.post('/addToys',async(req,res)=>{
    const addToy=req.body;
    console.log(addToy);
    const result=await addToyCollection.insertOne(addToy);
    res.send(result)
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  //  await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('edukids server is running')
})
app.listen(port,()=>{
    console.log( ` server is running on port:${port}`)
})