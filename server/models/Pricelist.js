const mongoose = require('mongoose');

// Define the schema for the pricelist data
const pricelistDataSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  Category_Name: { type: String, required: true },
  Variant_Name: { type: String, required: true },
  Single_Rate: { type: Number, required: true },
  Five_Plus: { type: Number, required: false },
  Ten_Plus: { type: Number, required: false },
  Twenty_Plus: { type: Number, required: false },
  Fifty_Plus: { type: Number, required: false },
  Hundred_Plus: { type: Number, required: false },
  MRP: { type: Number, required: true }
});

// Create a model based on the schema
const Pricelist = mongoose.model('Pricelist', pricelistDataSchema);

module.exports = Pricelist;
