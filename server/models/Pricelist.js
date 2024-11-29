const mongoose = require('mongoose');

// Define the schema for the pricelist data
const pricelistDataSchema = new mongoose.Schema({
  Category_Name_id: {
    type: String, // Reference to the categoryNames collection
    ref: 'categoryNames',
    required: true,
  },
  Variant: {
    type: String, // Variant name
    required: true,
  },
  Single: {
    type: Number, // Price for single
    required: true,
  },
  '5+': {
    type: String, // Price for 5+
    required: false,
  },
  '10+': {
    type: Number, // Price for 10+
    required: false,
  },
  '20+': {
    type: String, // Price for 20+ (could be "-" which is a string)
    required: false,
  },
  '50+': {
    type: String, // Price for 50+ (could be "-" which is a string)
    required: false,
  },
  '100+': {
    type: String, // Price for 100+ (could be "-" which is a string)
    required: false,
  },
  '500+': {
    type: String, // GST information
    required: true,
  },
  GST: {
    type: String, // GST information
    required: true,
  },
  GDL: {
    type: String, // GST information
    required: false,
  },
  MRP: {
    type: Number, // Maximum Retail Price
    required: true,
  },

});

// Create a model based on the schema
const Pricelist = mongoose.model('Pricelist', pricelistDataSchema, 'pricelistData');

module.exports = Pricelist;
