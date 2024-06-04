const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Life Sync is running successfully!');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kj2w8eq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const LifeSyncCollection = client.db('LifeSyncDB').collection('users');

    app.get('/users', async (req, res) => {
      const result = await LifeSyncCollection.find().toArray();
      res.send(result);
    });
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await LifeSyncCollection.find(query).toArray();
      res.send(result);
    });

app.patch('/users/:email', async (req, res) => {
  const email = req.params.email;
  const updatedUserData = req.body;

  try {
    const result = await LifeSyncCollection.updateOne(
      { email: email },
      { $set: updatedUserData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await LifeSyncCollection.insertOne(user);
      res.send(result);
    });

    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Life Sync server listening on port ${port}`);
});
