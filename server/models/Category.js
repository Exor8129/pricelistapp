const mongoose=require('mongoose');

const categoryNameSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    Category_Name: { type: String, required: true },
    Image_URL: { type: String, required: true }
});

const Category = mongoose.model('Category', categoryNameSchema, 'categoryNames');

module.exports = Category;
