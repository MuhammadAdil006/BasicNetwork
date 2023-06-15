const { Gateway, Wallets, } = require('fabric-network');
const fs = require('fs');
const path = require("path")
// const log4js = require('log4js');
// const logger = log4js.getLogger('BasicNetwork');
const util = require('util')


const helper = require('./helper')
const query = async (channelName, chaincodeName, args, fcn, username, org_name) => {

    try {
        
        // load the network configuration
        // const ccpPath = path.resolve(__dirname, '..', 'config', 'connection-org1.json');
        // const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
        const ccp = await helper.getCCP(org_name) //JSON.parse(ccpJSON);

        // Create a new file system based wallet for managing identities.
        const walletPath = await helper.getWalletPath(org_name) //.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, org_name, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true }, eventHandlerOptions: {
                strategy: null
            } 
        });
      

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);
        let result;

        // if (fcn == "queryCar" || fcn =="queryCarsByOwner" || fcn == 'getHistoryForAsset' || fcn=='restictedMethod') {
        //     result = await contract.evaluateTransaction(fcn, args[0]);

        // } else if (fcn == "readPrivateCar" || fcn == "queryPrivateDataHash"
        // || fcn == "collectionCarPrivateDetails") {
        //     result = await contract.evaluateTransaction(fcn, args[0], args[1]);
        //     // return result

        // }
        // console.log(args[0],fcn);
        if (fcn=="balanceOf"){
            result = await contract.evaluateTransaction(fcn, args[0]);
            let ress=String(result);
            let arr=ress.split(",");
            let arr1=arr[1].split(":");
            // console.log(arr1);
            let x=arr1[1];
            arr1[1]=x.slice(0,-1);
            console.log(arr1);
            // arr1 contains balance and amount as array
            let arr2=arr[2];
            let y= arr2.split(":");
            // console.log(y);
            let name ="\""+y[1].slice(0,-1)+"\"";
            y[1]=name;
            if (arr1[1]==""){
                arr1[1]="0";
            }
            var JsonObject ={ "balance":parseInt(arr1[1]),"name":name};
            // console.log(result.response)
            console.log(`Transaction has been evaluated, result is: ${JsonObject}`);
            return JsonObject;
        }else if (fcn=="GetVehiclesByCNIC")
        {

            result = await contract.evaluateTransaction(fcn, args[0]);
            let ress=String(result);
            console.log("gg",ress);
            let allCars=[];
            if (result){
                var JSONObject = JSON.parse(result);
                return JSONObject;

            }
            return NONE;
        }else if (fcn=="GetVehicleHistory"){
            result = await contract.evaluateTransaction(fcn, args[0],args[1],args[2]);
            let ress=String(result);
            // let allCars=[];
            if (result){
                console.log(ress);
                
                const [cnics,txn,date]=SeparateThings(ress);
                console.log(cnics,txn,date);
                if (cnics.length>0){
                    return [cnics,txn,date];
                }else{
                    return NONE;
                }

            }
            return NONE;
        }
        
        // result = JSON.parse(result.toString());

        // return result
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return error.message

    }
}
//utility functions
function SeparateThings(json){
    let cc=json;
    let counter=cc.split('counter":')[1].split(",")[0];
    let value=(Number(counter));
    let txnArray=[];
    let cnicArray=[];
    let transferDateArray=[];
    if (value>0){
        let val=cc.split("txns");
    let array=val[1].split('{"txn"');
    let array2=array.slice(1,array.length);
    //slice the array from 1 to n and use below code
    array2.forEach(element => {
        let doc=element.split(', "value":');
        doc[0]="txn id"+doc[0];
        txnArray.push(doc[0]);
        // console.log(doc[1]);
        //getting transferdate
        //getting ownercnic
        var parsedArray=doc[1].split('"ownerCNIC":');
        // console.log(parsedArray);
        var date=parsedArray[1].split('"transferDate":')[1];
        date=date.split("}")[0];
        console.log(date);
        transferDateArray.push(date);
        var cnicINfoArray=parsedArray[1].split(',"soldPrice"');
        //correct cnic before pushing
        if (cnicINfoArray[0].includes("CNIC")){
            cnicINfoArray[0]=cnicINfoArray[0].split("CNIC.")[1];
            cnicINfoArray[0]=cnicINfoArray[0].split('"')[0];
        }
        
        cnicArray.push(cnicINfoArray[0]);
    });
    }
    return [txnArray,cnicArray,transferDateArray];
}
exports.query = query