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
    console.log("Fetched Categories:", categories);  // Log the response
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


  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });