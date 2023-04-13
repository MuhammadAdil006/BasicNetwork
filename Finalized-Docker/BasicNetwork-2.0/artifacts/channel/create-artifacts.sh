
chmod -R 0755 ./crypto-config
# Delete existing artifacts
rm -rf ./crypto-config
rm automobilegenesis.block automobile-channel.tx
rm -rf ../../channel-artifacts/*

#Generate Crypto artifactes for organizations
cryptogen generate --config=./crypto-config.yaml --output=./crypto-config/



# System channel
SYS_CHANNEL="ordererchannel"

# channel name defaults to "automobile"
CHANNEL_NAME="automobilechannel"

echo $CHANNEL_NAME

# Generate System Genesis block
configtxgen -profile AutomobileOrdererGenesis -configPath . -channelID $SYS_CHANNEL  -outputBlock automobilegenesis.block


# Generate channel configuration block
configtxgen -profile AutomobileChannel -configPath . -outputCreateChannelTx ./automobile-channel.tx -channelID $CHANNEL_NAME

echo "#######    Generating anchor peer update for Org1MSP  ##########"
configtxgen -profile AutomobileChannel  -outputAnchorPeersUpdate ./Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Excise

echo "#######    Generating anchor peer update for Org2MSP  ##########"
configtxgen -profile AutomobileChannel -outputAnchorPeersUpdate ./Org2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Fbr
echo "#######    Generating anchor peer update for Org2MSP  ##########"
configtxgen -profile AutomobileChannel  -outputAnchorPeersUpdate ./Org3MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Manufacturer