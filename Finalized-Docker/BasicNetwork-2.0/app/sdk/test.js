const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// Connection profile and wallet path
const connectionProfilePath = '../config/connection-manufacturer.json';
const walletPath  = path.join(process.cwd(), 'manufacturer-wallet');

// Organization and admin credentials
const orgName = 'manufacturer';
const adminId = 'admin';
const adminPassword = 'adminpw';

// User to register and enroll
const username = 'user2';
const userPassword = 'userpw';

// Load connection profile
const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));

async function enrollAdmin() {
  try {
    // Create a new CA client
    console.log(connectionProfile);
    const caInfo = connectionProfile.certificateAuthorities["ca.manufacturer.com"].url;
    const ca = new FabricCAServices(caInfo);

    // Enroll the admin identity
    const enrollment = await ca.enroll({ enrollmentID: adminId, enrollmentSecret: adminPassword });

    // Create a new wallet
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Create a new identity for the admin
    const identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: connectionProfile.organizations["Manufacturer"].mspid,
      type: 'X.509',
    };
    await wallet.put(adminId, identity);
    console.log('Successfully enrolled admin and stored in wallet!');
  } catch (error) {
    console.error(`Failed to enroll admin: ${error}`);
    process.exit(1);
  }
}

async function registerAndEnrollUser() {
  try {
    // Load wallet
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if user is already registered
    const userIdentity = await wallet.get(username);
    if (userIdentity) {
      console.error(`User ${username} already registered in wallet!`);
      process.exit(1);
    }

    // Create a new CA client
    const caInfo = connectionProfile.certificateAuthorities[orgName].url;
    const ca = new FabricCAServices(caInfo);

    // Enroll the admin to get a signing identity
    const adminIdentity = await wallet.get(adminId);
    const enrollment = await ca.enroll({ enrollmentID: adminId, enrollmentSecret: adminPassword });
    const identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: connectionProfile.organizations[orgName].mspid,
      type: 'X.509',
    };

    // Register and enroll the user
    const secret = await ca.register(
      { enrollmentID: username, affiliation: orgName.toLowerCase() },
      adminIdentity
    );
    await ca.enroll({ enrollmentID: username, enrollmentSecret: secret }, identity);

    // Create a new identity for the user
    await wallet.put(username, identity);
    console.log(`Successfully registered and enrolled user ${username} and stored in wallet!`);
  } catch (error) {
    console.error(`Failed to register and enroll user: ${error}`);
    process.exit(1);
  }
}

enrollAdmin()
  .then(() => {
    // registerAndEnrollUser();
    console.log("done");
})
  .catch((error) => console.error(error));
