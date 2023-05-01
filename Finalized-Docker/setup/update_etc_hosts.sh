#!/bin/bash
# Update /etc/hosts
source    ./manage_hosts.sh

HOSTNAME=peer1.excise.com
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME
HOSTNAME=peer1.fbr.com
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME
HOSTNAME=peer1.manufacturer.com
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME
HOSTNAME=orderer.excise.com
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME
HOSTNAME=orderer2.excise.com
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME
HOSTNAME=orderer3.excise.com
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME
HOSTNAME=postgresql
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME
HOSTNAME=explorer
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME
HOSTNAME=vagrant
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME
HOSTNAME=ca-excise
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME
HOSTNAME=ca-fbr
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME
HOSTNAME=ca-manufacturer
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME
HOSTNAME=couchdb0
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME
HOSTNAME=couchdb1
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME
HOSTNAME=couchdb2
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME

HOSTNAME=tlsca.fbr.com
removehost $HOSTNAME            &> /dev/null
addhost $HOSTNAME
