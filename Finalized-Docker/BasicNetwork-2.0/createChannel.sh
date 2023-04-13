export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/excise.com/orderers/orderer.excise.com/msp/tlscacerts/tlsca.excise.com-cert.pem
export PEER1_Excise_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/excise.com/peers/peer1.excise.com/tls/ca.crt
export PEER1_Fbr_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/fbr.com/peers/peer1.fbr.com/tls/ca.crt
export PEER1_Manufacturer_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/manufacturer.com/peers/peer1.manufacturer.com/tls/ca.crt
export FABRIC_CFG_PATH=${PWD}/artifacts/channel/config/

export CHANNEL_NAME=automobilechannel

# setGlobalsForOrderer(){
#     export CORE_PEER_LOCALMSPID="OrdererMSP"
#     export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
#     export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/users/Admin@example.com/msp
    
# }

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

createChannel(){
    rm -rf ./channel-artifacts/*
    setGlobalsForPeer1Excise
    
    peer channel create -o localhost:7050 -c $CHANNEL_NAME \
    --ordererTLSHostnameOverride orderer.excise.com \
    -f ./artifacts/channel/automobile-channel.tx --outputBlock ./channel-artifacts/automobilegenesis.block \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
}

removeOldCrypto(){
    rm -rf ./api-1.4/crypto/*
    rm -rf ./api-1.4/fabric-client-kv-Excise/*
    rm -rf ./api-2.0/Excise-wallet/*
    rm -rf ./api-2.0/Fbr-wallet/*
    rm -rf ./api-2.0/Manufacturer-wallet/*

}


joinChannel(){
    setGlobalsForPeer1Excise
    peer channel join -b ./channel-artifacts/automobilegenesis.block
    
    setGlobalsForPeer1Fbr
    peer channel join -b ./channel-artifacts/automobilegenesis.block
    
    setGlobalsForPeer1Manufacturer
    peer channel join -b ./channel-artifacts/automobilegenesis.block
    
}

updateAnchorPeers(){
    setGlobalsForPeer1Excise
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.excise.com -c $CHANNEL_NAME -f ./artifacts/channel/Org1MSPanchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
    
    setGlobalsForPeer1Fbr
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.excise.com -c $CHANNEL_NAME -f ./artifacts/channel/Org2MSPanchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
    
    setGlobalsForPeer1Manufacturer
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.excise.com -c $CHANNEL_NAME -f ./artifacts/channel/Org3MSPanchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
    
}

removeOldCrypto

createChannel
joinChannel
updateAnchorPeers