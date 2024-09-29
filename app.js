const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

let db = null;
let client = null;

const connectDB = async () => {
  try {
    client = new MongoClient(
      "mongodb+srv://cayyanraj:2305@full-stack-lab.ptod1.mongodb.net/?retryWrites=true&w=majority&appName=full-stack-lab"
    );
    await client.connect();
    db = client.db("employees"); // Make sure the 'employees' database exists
    console.log("Connected with Atlas");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.send(`
    <h1>Employee Management</h1>
    <button onclick="window.location.href='/employees'">Get Employees</button>
    <button onclick="window.location.href='/add-employee'">Add Employee</button>
  `);
});

app.get("/employees", async (req, res) => {
  try {
    const employeesCollection = db.collection("employees");
    const employees = await employeesCollection.find({}).toArray();
    const employeesCount = await employeesCollection.countDocuments();
    
    if (employeesCount === 0) {
      res.send(`<h2>No employees found</h2>`);
    } else {
      res.send(employees);
    }
  } catch (err) {
    res.status(500).send("Error retrieving employees");
  }
});

app.get("/add-employee", (req, res) => {
  res.send(`
    <h2>Add New Employee</h2>
    <form action="/add-employee" method="POST">
      <label for="name">Name:</label><br>
      <input type="text" id="name" name="name" required><br>
      <label for="position">Position:</label><br>
      <input type="text" id="position" name="position" required><br><br>
      <input type="submit" value="Add Employee">
    </form>
  `);
});

app.use(express.urlencoded({ extended: true }));

app.post("/add-employee", async (req, res) => {
  try {
    const { name, position } = req.body;
    const employeesCollection = db.collection("employees");
    await employeesCollection.insertOne({ name, position });
    res.send("Employee added successfully! <br> <a href='/'>Go back</a>");
  } catch (err) {
    res.status(500).send("Error adding employee");
  }
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running at http://localhost:${PORT}`);
});
