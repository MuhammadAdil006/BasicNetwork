const User = require('./models/user');

//interacting with database
app.get('/registerUser',(req,res)=>{
    const user= new User({
        username:"adil",
        cnic:35202,
        organization:"excise",
        email:"adil@gmail.com",
        password:"gg",
        dateOfBirth:"December 17, 1995",
        gender:"male",
        userType:"user"
    });
    user.save().then((result)=>{
        res.send(result);
    }).catch((error)=>{
        console.log(error);
    });
});


getting all data
User.find().then((result)=>{
        res.render('index',{title:"Getting",blog:result});
    }).catch((error)=>{
        console.log(error);
    });
