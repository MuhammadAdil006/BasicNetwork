<!-- get data from db and inject it into views -->
<!-- NOSQL -->
<!-- collection = Table -->
<!-- documnet=Row -->
<!-- mogno db username and password for admin
adil 788925 -->
now go to clusters and select connect

connect to your application

const dbURL='mongodb+srv://adil:788925@automobileregistration.eygwh3a.mongodb.net/AutomobileRegistration?retryWrites=true&w=majority';

copied this connection string


<!-- //use mongoose Object documnet mapping library -->
mongoose is just like EntityFramework
User model
user.get(),user.findById()

schema defines the structure of a type of data/document
properities and its types

<!-- User collection schema -->
<!-- attr -->
<!-- username (string) required,cnic(number) required,organnization,email,passwod,day,month,year,gender,userType:admin,user -->

<!-- now from schema create model -->
<!-- get,save,delete etc mothods -->
it create  a model


npm install mongoose
const mongoose = require('mongoose');
//remove depracated version warinings
mongoose.connect(dbURL,{userNewUrlParser:true,useUnifiedTopology:true}).then((result) =>{console.log(result );}).catch((error) =>{console.log(error)});
mongoose.connect(dbURL).then((result) =>{
    console.log("db connected");
    app.listen(4000);
}).catch((error) =>{console.log(error)});