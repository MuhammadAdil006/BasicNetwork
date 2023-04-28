
// Load required modules
const { Wallets, Gateway } = require('fabric-network');
const path = require('path');
const fs=require('fs');
// Set connection options
const ccpPath = path.resolve(__dirname, '..','config', 'connection-fbr.json');

const identityLabel = 'Manufaactureradmin';
const channelName = 'automobilechannel';
const chaincodeName = 'gocc';
const functionName = 'balanceOf';
const args = ['3520299610969'];

async function queryFromChaincode() {
  const walletPath = path.resolve(__dirname, '..', 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  try {
    // Connect to the gateway using the wallet
    const gateway = new Gateway();
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
    const ccp = JSON.parse(ccpJSON);
    await gateway.connect(ccp, {
      wallet,
      identity: await wallet.get('Fbradmin'),
      discovery: { enabled: true, asLocalhost: true }
    });

    // Get the network and chaincode
    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

    // Submit the transaction
    const result = await contract.evaluateTransaction(functionName, ...args);
    let ress=String(result);
    let arr=ress.split(",");
    let arr1=arr[1].split(":");
    // console.log(arr1);
    let x="\""+arr1[1];
    arr1[1]=x;
    // console.log(arr1);
    // arr1 contains balance and amount as array
    let arr2=arr[2];
    let y= arr2.split(":");
    // console.log(y);
    let name ="\""+y[1].slice(0,-1)+"\"";
    y[1]=name;
    let c=arr1.concat(JsonObject);
    var JsonObject ="{ \"balance\":"+arr1[1]+",\"name\":"+name+"}";
    console.log(JsonObject);
    // console.log(`Query result: ${String(result)}`);

    // Disconnect from the gateway
    await gateway.disconnect();

    return result.toString();
  } catch (error) {
    console.error(`Failed to query chaincode: ${error}`);
    return null;
  }
}
queryFromChaincode();