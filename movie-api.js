const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const PORT = 3000

const app = express()
app.use(cors())


const uri = "";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let movieList = [
  'Themm Avengers',
  'All Dogs Go To Heaven',
  'The Aristocats',
  'The Brave Little Toaster',
  'The Lord of the Rings',
  'The Revenant',
  'Cats & Dogs'
];

app.route('/all')
  .get(async (req, res) => {
    let result = [];
    let error = null;
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      const collection = client.db("test").collection("movie");
      // finds all items in the collection
      result = await collection.find({}).toArray();

      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (e) {
      console.dir(e)
      error = e;
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }

    if (error === null) {

      res.json(result.map((value) => {
        return value.title;
      }))
    }
    else {
      res.status(500).send("Failure");
    }
  })

  .delete(async (req, res) => {
    let result = {};
    let error = null;
    try {
      await client.connect();
      const collection = client.db("test").collection("movie");
      result = await collection.deleteMany({})
    }   catch (e) {
      console.dir(e)
      error = e;
    }
    finally {

      await client.close();
    }
  })

app.get('/find', async (req, res) => {
  let result = {};
  let error = null
  if(req.query.hasOwnProperty('contains')) {
  try{
    await client.connect();
    const collection = client.db("test").collection("movie");
    result = await collection.find({
      title: {
        $regex: new RegExp(req.query.contains, 'i')}
    }).toArray();


    console.log(result)
    if(error === null) {
      res.json(result.map((value) => {
        return value.title;
      }))
    } else {
      res.status(500).send("Failure")
    }
  } catch(e){
    console.dir(e);
    error = e;
  }finally{
    await client.close();
  }
    } else if (req.query.hasOwnProperty('startsWith')){

      try {
        await client.connect();
        const collection = client.db("test").collection("movie");
        result = await collection.find({
          title: {
            $regex: new RegExp(req.query.startsWith, 'i')
          }
        }).toArray();
        if (error === null ) {
          res.json(result.map((value) => {
            return value.title;
          }))
        } else {
          res.status(500).send("Failure")
        }
      } catch(e){
    console.dir(e);
    error = e;
  } finally{
    await client.close();
  }
}})

app.route('/insert')
  .post(async(req, res) => {
    let error = null;
    let result = {}
    try {

      await client.connect();
      const collection = client.db("test").collection("movie");
      insertList = [
        { "title": "The Avengers" },
        { "title": "All Dogs Go To Heaven" },
        { "title": "The Aristocats" },
        { "title": "The Brave Little Toaster" },
        { "title": "The Lord of the Rings" },
        { "title": "The Revenant" },
        { "title": "Cats & Dogs" }]

      result = await collection.insertMany(insertList);
      if (error === null ) {
        res.sendStatus(200)
        // res.json(result.map((value) => {
        //   return value.title;
        // }))
      } else {
        res.status(500).send("Failure")
      }
    } catch(e) {
      console.dir(e)
      error = e;
    }
    finally{
      await client.close();
    }
  })
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
