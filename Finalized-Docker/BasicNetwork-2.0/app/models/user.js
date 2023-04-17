const mongoose = require('mongoose');
//this acts as a constructor for schema objects
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type:String,
        required:true,
        unique:true
    },
    cnic:{
        type:Number,
        required:true,
        unique:true
    },
    organization:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    dateOfBirth:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    userType:{
        type:String,
        required:true
    }
});


//creating model
//1st argument collection name from mongo db,2nd argument schema name
const User=mongoose.model("User",userSchema);

module.exports = User;