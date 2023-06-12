const express = require('express');
const router=express.Router();
const User = require('./../models/user');
const helper=require('../sdk/helper');
const session=require('express-session');
// const invoke = require('../sdk/invoke')
const query = require('../sdk/query');
const invoke=require('../sdk/invoke');
router.post('/transferTokens',async function(req,res){
    // console.log(req.body);
    //do some changes
    let receiver_name=req.body.Reciever_name;
    let rec_cnic=req.body.Reciever_cnic;
    let amount =req.body.amount;

    const result=req.session.user;
    //handle session here and return homepage
    //query for balance
    // let message =  query.query(channelName, chaincodeName, req.session.cnic, "balanceOf", req.session.username, req.session.organization);
    let usern=result.username;
    let Org="Fbr";
    if (result.userType=="admin"){
        usern="Fbradmin";
        // Org="Manufacturer";
    }
    console.log(result);
    console.log(result.cnic);
    let transferResult=await TransferTokens(result.cnic,rec_cnic,amount,receiver_name,usern,Org);
    console.log(transferResult);
    await sleep(2000);
    let message= await balanceOf(result.cnic,usern,Org);
    // console.log("message",message);
    let transferMessage="";
    if (transferResult.nessage=="success"){
        transferMessage="success";
    }
    console.log(message);
    res.render('homepage',{username:result.username,token:message["balance"],transferMessage});
});
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
router.post('/login',async function(req, res){
    console.log(req.body);
    var a=req.body['login-email'];
    var b=req.body["login-password"];
    // var c=req.body["login-org"];
    User.findOne({email: a,password:b}).then(async function(result){
        if (result==null){
            console.log("User not found");
            res.render('index',{title:"Automobile Registration System",registerSuccess:"notfound"});
        }else{
            req.session.user=result;
            req.session.authorized=true;
            console.log(req.session.user);
            //handle session here and return homepage
            //query for balance
            // let message =  query.query(channelName, chaincodeName, args, fcn, req.username, req.orgname);
            let usern=result.username;
            let Org="Fbr";
            if (result.userType=="admin"){
                usern="Fbradmin";
                // Org="Manufacturer";
            }
            console.log(result);
            console.log(result.cnic);
           
            let message= await balanceOf(result.cnic,usern,Org);
            console.log("message",message);
            let transferMessage="no";

            //get the vehicles owned
            // "GetVehiclesByCNIC", "7777"
            let cars=await query.query("automobilechannel", "gocc", [result.cnic],"GetVehiclesByCNIC",usern,Org);
            

            res.render('homepage',{username:result.username,token:message["balance"],transferMessage,cars});
        }
    }).catch((error)=>{
        console.log(error);
    });
    
});
async function balanceOf(cnic, usern, Org){
    var message = await query.query("automobilechannel", "gocc", [cnic], "balanceOf", usern, Org);
    return message;
}
async function TransferTokens(cnic,rec_cnic,amount,rec_name,usern,Org){
    // else if (fcn=="transfer"){
    //     result = await contract.evaluateTransaction(fcn, args[0],args[1],args[2],args[3]);
    //     // console.log(String(fcn), String(args[0]),String(args[1]),String(args[2]),String(args[3]));
    //     console.log(String(result));
    //     return result;
    // }
    var result=await invoke.invokeTransaction("automobilechannel", "gocc", "transfer", [cnic,rec_cnic,amount,rec_name], usern, Org);
    return result;
}
router.post('/registerUser', (req, res)=>{
    const date=req.body.day+"-"+req.body.month+"-"+req.body.year;
    req.body.dateOfBirth=date;
    req.body.userType="user";
    req.body.organization="Fbr";
    console.log(req.body);
    const user= new User(req.body
        );
        user.save().then((result)=>{
            helper.getRegisteredUser(req.body.username, "Fbr", true).then((result)=>{
                console.log(result);
                res.render("index",{title:"Automobile registration",registerSuccess:"success"});
            }) 
        }).catch((error)=>{console.log(error);
           
            res.render("index",{title:"Automobile registration",registerSuccess:"error"});
        });
});
router.post('/getHistory',async function(req,res){
    // console.log(req.body);
    const result=req.session.user;
   
    let usern=result.username;
    let Org="Fbr";
    if (result.userType=="admin"){
        usern="Fbradmin";
        // Org="Manufacturer";
    }
    console.log(usern);
    console.log(req.body["chassis_no"],req.body["engine_no"],req.body["companyName"]);
    const [cnics,txn,date]=await query.query("automobilechannel", "gocc", [req.body["chassis_no"],req.body["engine_no"],req.body["companyName"]],"GetVehicleHistory",usern,Org);
    console.log('gg',cnics,txn,date);
    //u need to gather cnic info now and inject into frontend
    res.render('History',{cnics,txn,date});


});
router.post('/transferVehicle',async function(req,res){
    const date=new Date();
    let year=date.getFullYear();
    let month=date.getMonth();
    let day=date.getDay();
    console.log(req.body);
    const resultt=req.session.user;
    const manufacturerCnic=resultt.cnic;
    const todayDate=day.toString() +'/'+ month.toString()+'/'+year.toString();
    let usern="Fbradmin";
    let Org="Fbr";
    // ["TransferOwnership", "7777","1234","A7655","23B8","Honda","2019-02-01"]}
    var result=await invoke.invokeTransaction("automobilechannel", "gocc", "TransferOwnership", [manufacturerCnic,req.body.buyercnic,req.body.chassis,req.body.engine,req.body.companyName,todayDate], usern, Org);
    await sleep(2000);
    let message= await balanceOf(resultt.cnic,usern,Org);
    console.log("message",message);
    let transferMessage="no";

    //get the vehicles owned
    // "GetVehiclesByCNIC", "7777"
    let cars=await query.query("automobilechannel", "gocc", [resultt.cnic],"GetVehiclesByCNIC",usern,Org);
    

    res.render('homepage',{username:resultt.username,token:message["balance"],transferMessage,cars});

});
router.post('/maufactureVehicle',async function(req,res){
    const date=new Date();
    let year=date.getFullYear();
    let month=date.getMonth();
    let day=date.getDay();
    // let rec_cnic=req.body.Reciever_cnic;
    console.log(req.body);
    const resultt=req.session.user;
    const manufacturerCnic=resultt.cnic;
    const todayDate=day.toString() +'/'+ month.toString()+'/'+year.toString();
    let usern="Fbradmin";
    let Org="Fbr";
    var result=await invoke.invokeTransaction("automobilechannel", "gocc", "Manufacture", [manufacturerCnic,req.body.engineNo,req.body.chassisNo,req.body.companyName,year,req.body.type,"city",manufacturerCnic,req.body.manufacturePrice,req.body.retailPrice,todayDate], usern, Org);
    await sleep(2000);
    let message= await balanceOf(resultt.cnic,usern,Org);
    console.log("message",message);
    let transferMessage="no";

    //get the vehicles owned
    // "GetVehiclesByCNIC", "7777"
    let cars=await query.query("automobilechannel", "gocc", [resultt.cnic],"GetVehiclesByCNIC",usern,Org);
    

    res.render('homepage',{username:resultt.username,token:message["balance"],transferMessage,cars});
});
module.exports=router;