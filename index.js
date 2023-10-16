require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7s5ai.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("paintxpress");
    const serviceCollection = db.collection("services");
    const categoryCollection = db.collection("categories");
    const projectCollection = db.collection("projects");
    const reviewCollection = db.collection("reviews");
    const teamCollection = db.collection("teams");
    //

    //get all service

    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
      // console.log(product);
    });

    //get filtered services

    app.get("/filteredServices", async (req, res) => {
      const { search, category } = req.query;

      const filter = {};
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ];
      }
      if (category) {
        filter.category = category;
      }

      const service = await serviceCollection.find(filter).toArray();
      res.send(service);
    });

    //get single services

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const result = await serviceCollection.findOne({ _id: ObjectId(id) });
      // console.log(result);
      res.send(result);
    });

    //

    //get all paint categories

    app.get("/categories", async (req, res) => {
      const cursor = categoryCollection.find({});
      const category = await cursor.toArray();
      res.send(category);
      // console.log(product);
    });

    //get all projects

    app.get("/projects", async (req, res) => {
      const project = await projectCollection.find({}).toArray();
      res.send(project);
      // console.log(product);
    });

    //get filtered projects

    app.get("/filteredProjects", async (req, res) => {
      const { search, category } = req.query;

      const filter = {};
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ];
      }
      if (category) {
        filter.category = category;
      }

      const project = await projectCollection.find(filter).toArray();
      res.send(project);
      // console.log(product);
    });

    // reviews
    app.get("/reviews", async (req, res) => {
      const review = await reviewCollection.find({}).toArray();
      res.send(review);
    });

    //team

    app.get("/teams", async (req, res) => {
      const team = await teamCollection.find({}).toArray();
      res.send(team);
    });

    //
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  // console.log(`Example app listening on port ${port}`);
});
