 // Needed for reading the connection profile as JS object
 const fs = require('fs');
 // Used for parsing the connection profile YAML file
 const yaml = require('js-yaml');
 // Import gateway class
 const { Gateway, Wallets } = require('fabric-network');
 const path = require("path");
 // Constants for profile
 const CONNECTION_PROFILE_PATH = 'profiles/dev-connection.yaml'
 // Path to the wallet
 const FILESYSTEM_WALLET_PATH = './wallet'
 // Identity context used
//  const USER_ID = 'Fbradmin'
 let USER_ID = 'Fbradmin'

 // Channel name
 const NETWORK_NAME = 'automobilechannel'
 // Chaincode
 const CONTRACT_ID = "gocc"
 
const helper = require('./helper')

const invokeTransaction = async (channelName, chaincodeName, fcn, args, username, org_name) => {
    try {
        // logger.debug(util.format('\n============ invoke transaction on channel %s ============\n', channelName));

        // load the network configuration
        const ccpPath =path.resolve(__dirname,  'profiles', 'dev-connection.yaml');
        // const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
         // 2. Setup the gateway object
         console.log("gg");
         let connectionProfile = yaml.load(fs.readFileSync(ccpPath, 'utf8'));
 
         // 2.2 Need to setup the user credentials from wallet
         const wallet = await Wallets.newFileSystemWallet(FILESYSTEM_WALLET_PATH);
     
         // 2.3 Set up the connection options
         let connectionOptions = {
             identity: username,
             wallet: wallet,
             discovery: { enabled: false, asLocalhost: true }
             /* Uncomment lines below to disable commit listener on submit **/
             , eventHandlerOptions: {
                 strategy: null
             } 
         }
         const gateway = new Gateway();
         // 2.4 Connect gateway to the network
         await gateway.connect(connectionProfile, connectionOptions)
         // console.log( gateway)
 
     // 3. Get the network
     let network = await gateway.getNetwork(NETWORK_NAME)
    //  console.log(network)
 
    //     // 5. Get the contract
     const contract = await network.getContract(CONTRACT_ID);

        // Create a new file system based wallet for managing identities.
        // const walletPath = await helper.getWalletPath(org_name) //path.join(process.cwd(), 'wallet');
        // const wallet = await Wallets.newFileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        // let identity = await wallet.get(username);
        // if (!identity) {
        //     console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
        //     await helper.getRegisteredUser(username, org_name, true)
        //     identity = await wallet.get(username);
        //     console.log('Run the registerUser.js application before retrying');
        //     return;
        // }

        

        

        let result;
    
        if (fcn === "transfer") {
            result = await contract.submitTransaction(String(fcn), String(args[0]),String(args[1]),String(args[2]),String(args[3]));
            // message = `Successfully added the car asset with key ${args[0]}`;
            console.log(String(result));
            // try{
            //     // Submit the transaction
            //     let result = await contract.submitTransaction('transfer','3520299610969', '1234', '100','Dar')
            //     console.log("Submit Response=",response.toString())
            // } catch(e){
            //     // fabric-network.TimeoutError
            //     console.log(e)
            // }
        }else if (fcn =="Manufacture"){
            result = await contract.submitTransaction(String(fcn), String(args[0]),String(args[1]),String(args[2]),String(args[3]),String(args[4]),String(args[5]),String(args[6]),String(args[7]),String(args[8]),String(args[9]),String(args[10]));
            // message = `Successfully added the car asset with key ${args[0]}`;
            console.log(String(result));
        }
        // } else if (fcn === "changeCarOwner") {
        //     result = await contract.submitTransaction(fcn, args[0], args[1]);
        //     message = `Successfully changed car owner with key ${args[0]}`
        // } else if (fcn == "createPrivateCar" || fcn =="updatePrivateData") {
        //     console.log(`Transient data is : ${transientData}`)
        //     let carData = JSON.parse(transientData)
        //     console.log(`car data is : ${JSON.stringify(carData)}`)
        //     let key = Object.keys(carData)[0]
        //     const transientDataBuffer = {}
        //     transientDataBuffer[key] = Buffer.from(JSON.stringify(carData.car))
        //     result = await contract.createTransaction(fcn)
        //         .setTransient(transientDataBuffer)
        //         .submit()
        //     message = `Successfully submitted transient data`
        // }
        // else {
        //     return `Invocation require either createCar or changeCarOwner as function but got ${fcn}`
        // }

        await gateway.disconnect();

        result = JSON.parse(String(result));
        let message="";
        if (result.code==0){
             message ="success";
        }
        let response = {
            message: message,
            result
        }

        return response;


    } catch (error) {

        console.log(`Getting error: ${error}`)
        return error.message

    }
}

exports.invokeTransaction = invokeTransaction;