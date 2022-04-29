const express = require('express');
const app = express();
const cors = require('cors');

const port = 4000;
app.use(express.json());


const { MongoClient, ServerApiVersion , ObjectId } = require('mongodb');
const uri = "mongodb+srv://userAdmin:2Ub1BN1uRpcDhG47@cluster0.xyczk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
        await client.connect();
        const notesCollection = client.db("notesTaker").collection("notes");
        console.log('connected to db');


      /* 

        {
            "userName": "sakib",
            "note":"all rounder sakib al hassan in the world "
        } 


        
        */

        //get api to read all notes 
        //http://localhost:4000/notes
        app.get('/notes', async (req, res)=>{
           const q =(req.query);
           console.log(q);
           const cursor = notesCollection.find({})
           const result = await cursor.toArray()
            res.send(result)
        })

        // create notes 
        app.post('/note' , async (req , res)=>{
            const data = req.body 
            console.log(data);
            const result = await notesCollection.insertOne(data)
            res.send(result)
        })

        // update note 
        //http://localhost:4000/note/626a359b56ef0ab5f979eea0
        app.put('/note/:id', async (req, res)=>{
            const id = req.params.id;
            const data = req.body 
            console.log("from update api ",data);
            const filter = {_id:ObjectId(id)}
            const options = { upsert: true };
            // console.log('from put method ' , id);
            const updateDoc = {
                $set: {
                  userName:data.userName,
                  note: data.note
                },
              };

              const result = await notesCollection.updateOne(filter, updateDoc, options);
            res.send(result)

        })



        // delete note 
        //http://localhost:4000/note/626a359b56ef0ab5f979eea0

        app.delete('/note/:id', async( req, res)=>{
            const id = req.params.id 
            const filter = {_id:ObjectId(id)}
            const result = await notesCollection.deleteOne(filter);
            res.send(result)

        })
      
    }

    finally{

    }
}

run().catch(console.dir);



/*   
    client.connect(err => {
    const collection = client.db("example").collection("test");
    console.log('mongoDb connect');
    //perform actions on the collection object
    client.close(); 


});

*/


//app get 

app.get("/", (req, res) => {
    res.send("hello world");
  });
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });