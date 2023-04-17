const mongoose = require('mongoose');
//this acts as a constructor for schema objects
const schema = mongoose.schema;

schema defines the structure of the object or model
const userSchema = new Schema({
    username: {
        type:String,
        required:true,
        unique:true
    },})