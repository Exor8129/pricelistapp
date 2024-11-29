const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');

const Category = require('./models/Category');  // Import the Category model
const Pricelist = require('./models/Pricelist');  // Import the Pricelist model


const app=express();
const PORT=5000;

app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb://localhost:27017/pricelist';

mongoose.connect('mongodb://localhost:27017/pricelist', {
  // No need for useNewUrlParser and useUnifiedTopology anymore
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));





// Route to fetch all category names
app.get("/api/categoryNames", async (req, res) => {
  try {
    const categories = await Category.find();
    // console.log("Fetched Categories:", categories);  // Log the response
    if (categories.length === 0) {
      console.log("No categories found in the database.");
    }
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Route to fetch pricelist data
app.get("/api/pricelistData", async (req, res) => {
  try {
    const pricelistData = await Pricelist.find();
    res.json(pricelistData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pricelist data" });
  }
});

//Post data to Pricelistdata collection

app.post("/api/pricelistData", async (req, res) => {
  const newData = req.body; // Get the data from the request body

  try {
    const pricelist = new Pricelist(newData); // Create a new Pricelist document
    await pricelist.save(); // Save it to the database
    res.status(201).json(pricelist); // Return the saved pricelist entry
  } catch (error) {
    console.error("Error saving data: ", error); // Log the error
    res.status(500).json({ error: "Failed to save data" });
  }
});

// PUT request to update a specific pricelist entry
app.put("/api/pricelistData/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedEntry = await Pricelist.findByIdAndUpdate(id, updatedData, {
      new: true,  // This ensures we return the updated document
    });

    if (updatedEntry) {
      res.status(200).json(updatedEntry);  // Return the updated document
    } else {
      res.status(404).json({ message: "Pricelist entry not found" });
    }
  } catch (error) {
    console.error("Error updating entry:", error);
    res.status(500).json({ message: "Failed to update entry" });
  }
});




// DELETE request to delete a specific pricelist entry
app.delete("/api/pricelistData/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEntry = await Pricelist.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ error: "Pricelist entry not found" });
    }

    res.json({ message: "Pricelist entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete pricelist data" });
  }
});
// In your backend Express route (server.js or routes.js):
app.get("/api/pricelistdata/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Use the Pricelist model to find the data by ID
    const data = await Pricelist.findById(id); // Note: Using `Pricelist` instead of `pricelistData`
    
    if (!data) {
      return res.status(404).send("Data not found");
    }

    res.json(data); // Return the found data
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Server error");
  }
});


  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });