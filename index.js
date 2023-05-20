const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

// 1. post from addToys  
  app.post('/addToys',async(req,res)=>{
    const addToy=req.body;
    console.log(addToy);
    const result=await addToyCollection.insertOne(addToy);
    res.send(result)
  })

  // 2. get for all toys
   app.get('/addToys',async(req,res)=>{
    const cursor=addToyCollection.find();
    const result=await cursor.toArray();
    res.send(result);
   })

   //3.get myToys email ways 
 app.get('/myToys/:email',async(req,res)=>{
 
  console.log(req.params.email)
  const result=await addToyCollection.find({sellerEmail: req.params.email}).toArray()
  res.send(result)
 })
 
 //4. delete id ways data from myToys
 app.delete('/myToys/:email/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId (id)};
  const result=await addToyCollection.deleteOne(query);
  res.send(result)
 })
 
 //4 . update id ways in myToys.
 app.put('/updateToy/:id',async(req,res)=> {

  const id=req.params.id;
  const body=req.body;
  const filter={_id: new ObjectId (id)};
  const updateDoc={
    $set:{     
      productName:body.productName,
      sellerName:body.sellerName,
      sellerEmail:body.sellerEmail,
      imgUrl:body.imgUrl,
      price:body.price,
      rating:body.rating,
      quantity:body.quantity,
      subCategory:body.subCategory,
      description:body.description
    },
  };
  const result=await addToyCollection.updateOne(filter,updateDoc);
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