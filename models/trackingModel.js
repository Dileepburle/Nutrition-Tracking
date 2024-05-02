const mongoose = require("mongoose");

const trackingSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    foodId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'foods',
        required:true
    },
    details:{
        calories:Number,
        energy:Number,
        proteins:Number,
        carbohydrates:Number,
        fats:Number,   
    },
    eatenDate:{
        type:String,
        default:new Date().toLocaleDateString()
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    }

},{timestamps:true})

const trackingModel = mongoose.model("trackings",trackingSchema)

module.exports = trackingModel;