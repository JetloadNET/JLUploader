Install our JLUploader

                                         Tutorial for CentOS with NodeJS pre-installed


- mkdir /opt/express/
- chmod 777 /opt/express
- touch /opt/express/urls_log.txt && chmod 777 /opt/express/urls_log.txt
- touch /opt/express/uploaded.txt && chmod 777 /opt/express/uploaded.txt
- copy settings.json & JLUploader.js to /opt/express/
- edit settings.json with your API KEY & Video location ex /home/videos/

- Run /opt/express/JLUploader.js and launch http://server_ip:1000/ in browser



                                          Guide for installing on Ubuntu/Debian/Linux Mint 

- sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
- curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
- sudo apt -y install nodejs
- sudo apt -y  install gcc g++ make

- npm install fastify --save
- npm install axios --save
- npm install request --save
- npm install path--save 

- Edit settings.json with your API KEY & Video location ex /home/videos/

Run the script using
- node /opt/express/JLUploader.js
