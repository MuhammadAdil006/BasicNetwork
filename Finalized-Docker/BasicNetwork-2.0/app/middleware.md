app.use(function);
app.get('/', function);
<!-- link break and it returns -->
<!-- we can use middleware to parse the json response data,authentication
 -->
 <!-- //logger middleware -->
app.use((req,res,next) =>{
    console.log("host:"+req.hostname);
    console.log("port:"+req.port);
    console.log("path:"+req.path);
    console.log("method:"+req.method);
    //to move on the the next middlware
    next();
});


<!-- 3rd party middlware -->
<!-- use session cookies middlewares -->
logger middleware
npm install morgan

const morgan = require('morgan');
app.use(morgan('dev'));