const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

app.use(cors())
app.use(express.json())


// Mongodb starts from here 


// 9XyhBNOHgJIkkE3k scic-task

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://scic-task:9XyhBNOHgJIkkE3k@cluster0.szfaclu.mongodb.net/?retryWrites=true&w=majority";

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

        // database 
        const database = client.db('task_manager');
        const taskCollection = database.collection('tasks');

        // tasks api
        app.get('/tasks', async (req, res) => {
            const result = await taskCollection.find().toArray();
            res.send(result);
        });
        app.delete("/tasks/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(filter);
            res.send(result)
        });
        app.post("/tasks", async (req, res) => {
            const newTask = req.body
            const result = await taskCollection.insertOne(newTask)
            res.send(result)
        });
        app.get("/tasks", async (req, res) => {
            const { email } = req.query
            let query = {}
            if (email) {
                query = { email: email }
            }
            const cursor = taskCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        });
        app.put("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            const updatedTask = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: updatedTask,
            };

            const result = await taskCollection.updateOne(filter, updateDoc);
            res.send(result)
        });
        app.patch("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            const updatedTask = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: updatedTask,
            };
            console.log(updateDoc);

            const result = await taskCollection.updateOne(filter, updateDoc);

            res.send(result)
        });

        app.delete("/tasks/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(filter);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})