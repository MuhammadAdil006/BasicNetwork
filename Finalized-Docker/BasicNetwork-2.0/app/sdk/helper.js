'use strict';

var { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');

const util = require('util');
// ccp stands for common connection profile
const getCCP =  (org) => {
    let ccpPath;
    // if (org == "Excise") {
    //     ccpPath = path.resolve(__dirname, '..', 'config', 'connection-excise.json');

    // } else if (org == "Fbr") {
    //     ccpPath = path.resolve(__dirname, '..', 'config', 'connection-fbr.json');
    // }else if (org == "Manufacturer") {
    //     ccpPath = path.resolve(__dirname, '..', 'config', 'connection-manufacturer.json');
    // } else
    //     return null
    ccpPath = path.resolve(__dirname, '..', 'config', 'connection-fbr.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
    const ccp = JSON.parse(ccpJSON);
    console.log(ccp)
    return ccp
    //connnecton profile conatins informaation about organizationa url and peer and its address also tls certificates
}

const getCaUrl =  (org, ccp) => {
    let caURL;
    // if (org == "Excise") {
    //     caURL = "https://localhost:7056";

    // } else if (org == "Fbr") {
    //     caURL ="https://localhost:7054";
    // }else if (org == "Manufacturer") {
    //     caURL = "https://localhost:7053";
    // } else
    //     return null
    caURL ="https://localhost:7054";
    return caURL

}

const getWalletPath =  (org) => {
    let walletPath;
    // if (org == "Excise") {
    //     walletPath = path.join(process.cwd(), 'excise-wallet');

    // } else if (org == "Fbr") {
    //     walletPath = path.join(process.cwd(), 'fbr-wallet');
    // }else if (org == "Manufacturer") {
    //     walletPath = path.join(process.cwd(), 'manufacturer-wallet');
    // } else
    //     return null
    walletPath = path.join(process.cwd(), 'wallet');
    return walletPath

}


const getAffiliation =  (org) => {
    // if (org == "Excise") {
    //     return "excise.department";

    // } else if (org == "Fbr") {
    //     return "fbr.department";
    // }else if (org == "Manufacturer") {
    //     return "manufacturer.department";
    // }
    return "fbr";
}

const getRegisteredUser = async (username, userOrg, isJson) => {
    let ccp =  getCCP(userOrg)

    const caURL =  getCaUrl(userOrg, ccp)
    const ca = new FabricCAServices(caURL);

    const walletPath =  getWalletPath(userOrg)
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userIdentity = await wallet.get(username);
    if (userIdentity) {
        console.log(`An identity for the user ${username} already exists in the wallet`);
        var response = {
            success: true,
            message: username + ' enrolled Successfully',
        };
        return response
    }

    // Check to see if we've already enrolled the admin user.
    let adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
        console.log('An identity for the admin user "admin" does not exist in the wallet');
         enrollAdmin(userOrg, ccp);
        adminIdentity = await wallet.get('admin');
        console.log("Admin Enrolled Successfully")
    }

    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    let secret;
    try {
        // Register the user, enroll the user, and import the new identity into the wallet.
        secret = await ca.register({ affiliation: "", enrollmentID: username, role: 'user' }, adminUser);
        // const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client', attrs: [{ name: 'role', value: 'approver', ecert: true }] }, adminUser);

    } catch (error) {
        return error.message
    }

    const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });
    // const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret, attr_reqs: [{ name: 'role', optional: false }] });

    let x509Identity;
    // if (userOrg == "Excise") {
    //     x509Identity = {
    //         credentials: {
    //             certificate: enrollment.certificate,
    //             privateKey: enrollment.key.toBytes(),
    //         },
    //         mspId: 'ExciseMSP',
    //         type: 'X.509',
    //     };
    // } else if (userOrg == "Fbr") {
    //     x509Identity = {
    //         credentials: {
    //             certificate: enrollment.certificate,
    //             privateKey: enrollment.key.toBytes(),
    //         },
    //         mspId: 'FbrMSP',
    //         type: 'X.509',
    //     };
    // }else if (userOrg == "Manufacturer") {
    //     x509Identity = {
    //         credentials: {
    //             certificate: enrollment.certificate,
    //             privateKey: enrollment.key.toBytes(),
    //         },
    //         mspId: 'ManufacturerMSP',
    //         type: 'X.509',
    //     };
    // }
    x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: 'FbrMSP',
        type: 'X.509',
    };

    await wallet.put(username, x509Identity);
    console.log(`Successfully registered and enrolled admin user ${username} and imported it into the wallet`);

    var response = {
        success: true,
        message: username + ' enrolled Successfully',
    };
    return response
}

const isUserRegistered = async (username, userOrg) => {
    const walletPath = await getWalletPath(userOrg)
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userIdentity = await wallet.get(username);
    if (userIdentity) {
        console.log(`An identity for the user ${username} exists in the wallet`);
        return true
    }
    return false
}


const getCaInfo =  (org, ccp) => {
    let caInfo
    // if (org == "Excise") {
    //     console.log("debugging");

    //     caInfo = ccp.certificateAuthorities['ca.excise.com'];

    // } else if (org == "Fbr") {
    //     caInfo = ccp.certificateAuthorities['ca.fbr.com'];
    // } else if (org == "Manufacturer") {
    //     caInfo = ccp.certificateAuthorities['ca.manufacturer.com'];
    // } else
    //     return null
    caInfo = ccp.certificateAuthorities['ca.fbr.com'];
    return caInfo

}

const enrollAdmin = async (org, ccp) => {

    console.log('calling enroll Admin method')

    try {

        const caInfo =  getCaInfo(org, ccp) //ccp.certificateAuthorities['ca.excise.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath =  getWalletPath(org) //path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin');
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        let x509Identity;
        // if (org == "Excise") {
        //     x509Identity = {
        //         credentials: {
        //             certificate: enrollment.certificate,
        //             privateKey: enrollment.key.toBytes(),
        //         },
        //         mspId: 'ExciseMSP',
        //         type: 'X.509',
        //     };
        // } else if (org == "Fbr") {
        //     x509Identity = {
        //         credentials: {
        //             certificate: enrollment.certificate,
        //             privateKey: enrollment.key.toBytes(),
        //         },
        //         mspId: 'FbrMSP',
        //         type: 'X.509',
        //     };
        // }else if (org == "Manufacturer") {
        //     x509Identity = {
        //         credentials: {
        //             certificate: enrollment.certificate,
        //             privateKey: enrollment.key.toBytes(),
        //         },
        //         mspId: 'ManufacturerMSP',
        //         type: 'X.509',
        //     };
        // }
        x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'FbrMSP',
            type: 'X.509',
        };
        await wallet.put('admin', x509Identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
        return
    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
    }
}

const registerAndGerSecret = async (username, userOrg) => {
    let ccp = await getCCP(userOrg)

    const caURL = await getCaUrl(userOrg, ccp)
    const ca = new FabricCAServices(caURL);

    const walletPath = await getWalletPath(userOrg)
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userIdentity = await wallet.get(username);
    if (userIdentity) {
        console.log(`An identity for the user ${username} already exists in the wallet`);
        var response = {
            success: true,
            message: username + ' enrolled Successfully',
        };
        return response
    }

    // Check to see if we've already enrolled the admin user.
    let adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
        console.log('An identity for the admin user "admin" does not exist in the wallet');
        await enrollAdmin(userOrg, ccp);
        adminIdentity = await wallet.get('admin');
        console.log("Admin Enrolled Successfully")
    }

    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    let secret;
    try {
        // Register the user, enroll the user, and import the new identity into the wallet.
        secret = await ca.register({ affiliation: await getAffiliation(userOrg), enrollmentID: username, role: 'user' }, adminUser);
        // const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client', attrs: [{ name: 'role', value: 'approver', ecert: true }] }, adminUser);

    } catch (error) {
        return error.message
    }

    var response = {
        success: true,
        message: username + ' enrolled Successfully',
        secret: secret
    };
    return response

}

exports.getRegisteredUser = getRegisteredUser

module.exports = {
    getCCP: getCCP,
    getWalletPath: getWalletPath,
    getRegisteredUser: getRegisteredUser,
    isUserRegistered: isUserRegistered,
    registerAndGerSecret: registerAndGerSecret

}
