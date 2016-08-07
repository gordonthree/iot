#IoT

Combination automatcion api (backend) and management interface (frontend)

the two express functions, iotconfig and iotfw are all that's needed for the automatic api to do it's thing, well and the mysql table nodelist


Goals:

Package.json needs to be cleaned up, I don't think I'm using everything that's in there

Combine nodecontrol with nodedetails - jquery mobile pop up window maybe?

Retire nodelist page, its been replaced with nodedetails

Lots more database maintenance tools needed.

Other info:

Yeah, it's a mess. I'm a hardware guy, and generally scatterbrain when it comes to programming.

Project relies on a mysql database, I will post table defs shortly.

Getting started:
1. Clone this repo to your local machine, you'll need a modern version of nodejs and npm installed (4.5.something?), as well as mysql
2. cd iot
3. npm install 
4. create empty database named iot, import nodelist.sql to it to create nodelist master table
5. adjust mysql connection settings in index.js
6. I use pm2 to run the app in the background, and watch for changes to the source code: sudo npm install --global pm2 ... follow docs to setup pm2 to autostart on your distro
7. probably missed some things - send me an email for help gordonthree@gmail.com
