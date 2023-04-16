#package the chaincode
#make sure you are in basic network sir
export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/excise.com/orderers/orderer.excise.com/msp/tlscacerts/tlsca.excise.com-cert.pem
export PEER1_Excise_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/excise.com/peers/peer1.excise.com/tls/ca.crt
export PEER1_Fbr_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/fbr.com/peers/peer1.fbr.com/tls/ca.crt
export PEER1_Manufacturer_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/manufacturer.com/peers/peer1.manufacturer.com/tls/ca.crt
export FABRIC_CFG_PATH=${PWD}/artifacts/channel/config/

export CHANNEL_NAME=automobilechannel
export PRIVATE_DATA_CONFIG=${PWD}/artifacts/private-data/collections_config.json
#major setting for all 

setGlobalsForOrderer() {
    export CORE_PEER_LOCALMSPID="OrdererMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/excise.com/orderers/orderer.excise.com/msp/tlscacerts/tlsca.excise.com-cert.pem
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/excise.com/users/Admin@excise.com/msp
}

setGlobalsForPeer1Excise(){
    export CORE_PEER_LOCALMSPID="ExciseMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER1_Excise_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/excise.com/users/Admin@excise.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}

setGlobalsForPeer1Fbr(){
    export CORE_PEER_LOCALMSPID="FbrMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER1_Fbr_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/fbr.com/users/Admin@fbr.com/msp
    export CORE_PEER_ADDRESS=localhost:10051
    
}
setGlobalsForPeer1Manufacturer(){
    export CORE_PEER_LOCALMSPID="ManufacturerMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER1_Manufacturer_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/manufacturer.com/users/Admin@manufacturer.com/msp
    export CORE_PEER_ADDRESS=localhost:20051
}

# presetup() {
#     echo Vendoring Go dependencies ...
#     pushd ./artifacts/src/github.com/fabcar/go
#     GO111MODULE=on go mod vendor
#     popd
#     echo Finished vendoring Go dependencies
# }
# presetup

export CC_NAME=gocc
export CC_VERSION=1.0
export CC_LABEL="$CC_NAME.$CC_VERSION-1.0"
export CC_PACKAGE_FILE=$HOME/packages/$CC_LABEL.tar.gz

packageChaincode() {
    setGlobalsForPeer1Excise
    mkdir -p $HOME/packages
    peer lifecycle chaincode package $CC_PACKAGE_FILE --label $CC_LABEL -p supplychain
    ls -la $CC_PACKAGE_FILE
    echo "===================== Chaincode is packaged  ===================== "
}
# packageChaincode

installChaincode() {
    setGlobalsForPeer1Excise
    peer lifecycle chaincode install $CC_PACKAGE_FILE
    echo "===================== Chaincode is installed on peer1.excise ===================== "

    # setGlobalsForPeer1Org1
    # peer lifecycle chaincode install ${CC_NAME}.tar.gz
    # echo "===================== Chaincode is installed on peer1.org1 ===================== "

    setGlobalsForPeer1Fbr
    peer lifecycle chaincode install $CC_PACKAGE_FILE
    echo "===================== Chaincode is installed on peer1.fbr ===================== "

     setGlobalsForPeer1Manufacturer
    peer lifecycle chaincode install $CC_PACKAGE_FILE
    echo "===================== Chaincode is installed on peer1.manufacturer ===================== "
}

# installChaincode

queryInstalled() {
    setGlobalsForPeer1Excise
    peer lifecycle chaincode queryinstalled >&log.txt
    cat log.txt
    CC_PACKAGE_ID=$(sed -n "/${CC_NAME}_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    echo PackageID is ${CC_PACKAGE_ID}
    echo "===================== Query installed successful on peer1.excise on channel ===================== "
}

# queryInstalled

# --collections-config ./artifacts/private-data/collections_config.json \
#         --signature-policy "OR('Org1MSP.member','Org2MSP.member')" \
# --collections-config $PRIVATE_DATA_CONFIG \

approveForMyOrg1() {
    setGlobalsForPeer1Excise
    # set -x
     peer lifecycle chaincode approveformyorg -o localhost:7050  --ordererTLSHostnameOverride orderer.excise.com --tls  --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name gocc --version 1.0  --init-required --package-id ${CC_PACKAGE_ID}   --sequence 2 --waitForEvent
}

getBlock() {
    setGlobalsForPeer1Excise
    # peer channel fetch 10 -c mychannel -o localhost:7050 \
    #     --ordererTLSHostnameOverride orderer.example.com --tls \
    #     --cafile $ORDERER_CA

    peer channel getinfo  -c mychannel -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.excise.com --tls \
        --cafile $ORDERER_CA
}

# getBlock

# approveForMyOrg1

# --signature-policy "OR ('Org1MSP.member')"
# --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA
# --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles $PEER0_ORG1_CA --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles $PEER0_ORG2_CA
#--channel-config-policy Channel/Application/Admins
# --signature-policy "OR ('Org1MSP.peer','Org2MSP.peer')"

checkCommitReadyness() {
    setGlobalsForPeer1Excise
    peer lifecycle chaincode checkcommitreadiness \
        --channelID automobilechannel --name gocc --version 1.0 \
        --sequence 2 --output json --init-required
    echo "===================== checking commit readyness from org 1 ===================== "
}

# checkCommitReadyness

# --collections-config ./artifacts/private-data/collections_config.json \
# --signature-policy "OR('Org1MSP.member','Org2MSP.member')" \
approveForMyOrg2() {
    setGlobalsForPeer1Fbr

   peer lifecycle chaincode approveformyorg -o localhost:7050  --ordererTLSHostnameOverride orderer.excise.com --tls  --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name gocc --version 1.0  --init-required --package-id ${CC_PACKAGE_ID}   --sequence 2 --waitForEvent


    echo "===================== chaincode approved from org 2 ===================== "
}

# approveForMyOrg2

checkCommitReadyness() {

    setGlobalsForPeer1Fbr
     peer lifecycle chaincode checkcommitreadiness \
        --channelID automobilechannel --name gocc --version 1.0 \
        --sequence 2 --output json --init-required
    echo "===================== checking commit readyness from org 1 ===================== "
}

# checkCommitReadyness

commitChaincodeDefination() {
    setGlobalsForPeer1Excise
   peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.excise.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        --channelID automobilechannel --name gocc \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER1_Excise_CA \
        --version 1.0 --sequence 2 --init-required

}

# commitChaincodeDefination

queryCommitted() {
    setGlobalsForPeer1Excise
   peer lifecycle chaincode querycommitted -n gocc  -C automobilechannel

}

# queryCommitted

chaincodeInvokeInit() {
    setGlobalsForPeer1Excise
     peer chaincode invoke -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.excise.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        -C automobilechannel -n gocc \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER1_Excise_CA \
        --peerAddresses localhost:10051 --tlsRootCertFiles $PEER1_Fbr_CA \
        --isInit -c '{"Args":["init","Pkr","10000000","Pakistani Rupee!!!","MAdil"]}'

}

# chaincodeInvokeInit

chaincodeInvoke() {
    # setGlobalsForPeer0Org1
    # peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
    # --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} \
    # --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
    # --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA  \
    # -c '{"function":"initLedger","Args":[]}'

    setGlobalsForPeer1Excise

    ## Create Car
    # peer chaincode invoke -o localhost:7050 \
    #     --ordererTLSHostnameOverride orderer.example.com \
    #     --tls $CORE_PEER_TLS_ENABLED \
    #     --cafile $ORDERER_CA \
    #     -C $CHANNEL_NAME -n ${CC_NAME}  \
    #     --peerAddresses localhost:7051 \
    #     --tlsRootCertFiles $PEER0_ORG1_CA \
    #     --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA   \
    #     -c '{"function": "createCar","Args":["Car-ABCDEEE", "Audi", "R8", "Red", "Pavan"]}'

    ## Init ledger
 peer chaincode invoke -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.excise.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        -C automobilechannel -n gocc \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER1_Excise_CA \
        --peerAddresses localhost:10051 --tlsRootCertFiles $PEER1_Fbr_CA \
        -c '{"Args":["transfer", "3520299610969", "1234", "100","Dar"]}'


    ## Add private data
    # export CAR=$(echo -n "{\"key\":\"1111\", \"make\":\"Tesla\",\"model\":\"Tesla A1\",\"color\":\"White\",\"owner\":\"pavan\",\"price\":\"10000\"}" | base64 | tr -d \\n)
    # peer chaincode invoke -o localhost:7050 \
    #     --ordererTLSHostnameOverride orderer.example.com \
    #     --tls $CORE_PEER_TLS_ENABLED \
    #     --cafile $ORDERER_CA \
    #     -C $CHANNEL_NAME -n ${CC_NAME} \
    #     --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_ORG1_CA \
    #     --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
    #     -c '{"function": "createPrivateCar", "Args":[]}' \
    #     --transient "{\"car\":\"$CAR\"}"
}

# chaincodeInvoke

chaincodeQuery() {
    setGlobalsForPeer1Excise

    # Query all cars
    # peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"Args":["queryAllCars"]}'

    # Query Car by Id
   peer chaincode query -C automobilechannel -n gocc -c '{"Args":["balanceOf","3520299610969"]}'

    #'{"Args":["GetSampleData","Key1"]}'

    # Query Private Car by Id
    # peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "readPrivateCar","Args":["1111"]}'
    # peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "readCarPrivateDetails","Args":["1111"]}'
}

# chaincodeQuery

# Run this function if you add any new dependency in chaincode
# presetup

# packageChaincode
# installChaincode
# queryInstalled
# approveForMyOrg1
# # checkCommitReadyness
# approveForMyOrg2
# checkCommitReadyness
# commitChaincodeDefination
# queryCommitted
# chaincodeInvokeInit
# sleep 5
# chaincodeInvoke
# sleep 3
# chaincodeQuery
