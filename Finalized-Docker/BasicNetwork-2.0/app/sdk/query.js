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
            var JsonObject ={ "balance":parseInt(arr1[1]),"name":name};
            // console.log(result.response)
            console.log(`Transaction has been evaluated, result is: ${JsonObject}`);
            return JsonObject;
        }else if (fcn=="GetVehiclesByCNIC")
        {

            result = await contract.evaluateTransaction(fcn, args[0]);
            let ress=String(result);
            let allCars=[];
            if (result){
                var JSONObject = JSON.parse(result);
                return JSONObject;

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

exports.query = query