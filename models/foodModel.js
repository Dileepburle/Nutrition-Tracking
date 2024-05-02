const mongoose = require("mongoose");

const foodSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    calories:{
        type:Number,
        required:true,
    },
    energy:{
        type:Number,
        required:true
    },
    fats:{
        type:Number,
        required:true
    },
    carbohydrates:{
        type:Number,
        required:true
    },
    proteins:{
        type:Number,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    }
})

const foodModel = mongoose.model("foods",foodSchema);

module.exports = foodModel;