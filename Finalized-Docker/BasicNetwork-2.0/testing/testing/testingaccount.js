const yaml = require('js-yaml');
const fs = require('fs');
const { Wallets, Gateway } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');

async function enrollUser() {
  try {
    // Load the connection profile YAML file
    const connectionFile = yaml.load(fs.readFileSync('dev-connection.yaml', 'utf8'));

    // Extract the CA credentials from the YAML file
    const caInfo = connectionFile.certificateAuthorities['ca.manufacturer.com'];
    const caTLSCACertsPath = caInfo.tlsCACerts.path;
    const caURL = caInfo.url;
    const caName = caInfo.caName;

    // Create a new CA client
    const caTLSCACerts = fs.readFileSync(caTLSCACertsPath);
    // console.log(caTLSCACerts);
    const caClient = new FabricCAServices(caURL, { trustedRoots: caTLSCACerts, verify: false }, caName);
    // console.log(caClient);
    // Create a new wallet instance
    const wallet = await Wallets.newFileSystemWallet('./wallet');

    // // Check if the admin identity already exists in the wallet
    const adminExists = await wallet.get('Fbradmin');
    //working perfectly fine
    // if (!adminExists) {
      // Enroll the admin identity with the CA
    //   const enrollment = await caClient.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });

    //   // Create a new identity object for the admin
    //   const identity = {
    //     credentials: {
    //       certificate: enrollment.certificate,
    //       privateKey: enrollment.key.toBytes(),
    //     },
    //     mspId: 'ManufacturerMSP',
    //     type: 'X.509',
    //   };

    //   // Add the admin identity to the wallet
    //   await wallet.put('admin', identity);
    // // }

    // Check if the user identity already exists in the wallet
    const userExists = await wallet.get('user6');
    if (!userExists) {
      // Register and enroll a new user identity with the CA
      const adminIdentity = await wallet.get('Fbradmin');
      const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
      const adminUser = await provider.getUserContext(adminIdentity, 'Fbradmin');
      const enrollment = await caClient.register({
        enrollmentID: 'user6',
        // affiliation: 'org3',//error here
        role: 'client',
        enrollmentSecret: 'myEnrollmentSecret'
      }, adminUser);
      console.log(enrollment);
      const userEnrollment = await caClient.enroll({
        enrollmentID: 'user6',
        enrollmentSecret: enrollment,
      });

      // Create a new identity object for the user
      const userIdentity = {
        credentials: {
          certificate: userEnrollment.certificate,
          privateKey: userEnrollment.key.toBytes(),
        },
        mspId: 'FbrMSP',
        type: 'X.509',
      };

      // Add the user identity to the wallet
      await wallet.put('user6', userIdentity);
    }

    // Connect to the gateway using the user identity
    const gateway = new Gateway();
    await gateway.connect(connectionFile, {
      wallet,
      identity: 'user6',
      discovery: { enabled: true, asLocalhost: true },
    });
  } catch (error) {
    console.error(`Failed to enroll and register user: ${error}`);
    process.exit(1);
  }
}

enrollUser();
