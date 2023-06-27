# Installation Guide

# step 1:
install vagrant ,oracle vm box,visual studio
clone this git https://github.com/MuhammadAdil006/Finalized-Docker
go into this folder

# step 2 Installation of vm box and dependancies:
open cmd 

your path should be ....../Finalized-Docker

type code . to open vscode 

open setup folder

click on each .sh file and below right of vscode click on crlf change into lf for each .sh file in this directory

click on new terminal 

type vagrant up on terminal

type vagrant ssh after downlaoding details

you should have login now to vagrant

type cd setup

type bash ./init-vexpress.sh

to confirm the binaries

type bash ./validate-prereqs.sh

# step 3 installation of network setup
cd BasicNetwork-2.0

