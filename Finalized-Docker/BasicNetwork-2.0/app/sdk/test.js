const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const helper=require('./helper');
// Set connection options
const ccpPath = helper.getCCP("fbr");


async function invoke() {
  const walletPath = await helper.getWalletPath("fbr") //.join(process.cwd(), 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const gatewayOptions = {
  wallet,
  identity: 'Fbradmin',
  discovery: { enabled: true, asLocalhost: true },
  eventHandlerOptions:{
    strategy:null
  }
};
  try {
    // Connect to gateway using connection profile and wallet
    const gateway = new Gateway();
    await gateway.connect(ccpPath, gatewayOptions);

    // Get network and contract objects
    const network = await gateway.getNetwork('automobilechannel');
    const contract = network.getContract('gocc');
    console.log(contract);
    // Submit transaction to chaincode
    // const result =await contract.submitTransaction("transfer", "3520299610969", "1234", "100","Dar");
    let txn=contract.createTransaction("transfer");
    console.log(txn.getName());
    console.log(txn.getTransactionId());
    let result=await txn.submit("3520299610969", "1234", "100","Dar");
    console.log('Transaction has been submitted',String(result));
    gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }
}

invoke();
