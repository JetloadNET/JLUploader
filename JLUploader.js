//JLUploader version 0.1
const fastify = require('fastify')({ logger: true })
const settings = require('/opt/express/settings.json');
const fs = require('fs')
var request = require('request');
const axios = require('axios');
const path = require('path');
const API_KEY = settings.API_KEY
const VIDEOS_LOCATION = settings.VIDEOS_LOCATION
var log = false;
var log_file = settings.log_file
var system_log = settings.system_log
var log_format = settings.log_format
var max_simultaneous_uploads = settings.max_simultaneous_uploads
var isRunning = 0;


function readFilesSync(dir) {
  const files = [];
  fs.readdirSync(dir).forEach(filename => {
    const name = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    const filepath = path.resolve(dir, filename);
    const stat = fs.statSync(filepath);
    const isFile = stat.isFile();

    if (isFile) files.push({ filepath, name, ext, stat });
  });

  files.sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  return files;
}
 

// Log function
async function xlog(url,code){
  // Log the URLs
  fs.appendFile(log_file, '\n'+url, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

// Log the codes (prevent multiple uploads)
  fs.appendFile(system_log, '\n'+code, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}



 fastify.get('/', async (request, reply) => {
   var request = require('request');

   //Upload function
   async function upload_file(data,file){

     var url = data.hostname+data.path
     var file_data = fs.createReadStream(`${VIDEOS_LOCATION}${file}`)

     var formData = {
             file: file_data,
             upload_id:data.upload_id.user_id
     };

   let size = fs.lstatSync(`${VIDEOS_LOCATION}${file}`).size;
   var r = request.post({url:url, formData: formData}, function optionalCallback(err, httpResponse, body) {
     console.log(body);
      xlog(body,file)
     if (isRunning < 0) {
       isRunning = 0
     }
     else {
isRunning -=1
     }


     console.log(isRunning);
           clearInterval(q);
   });

   var q = setInterval(function () {
           var dispatched = r.req.connection._bytesDispatched;
           let percent = dispatched*100/size;
            console.dir(file+" Uploaded: " + percent.toFixed(2) + "%");

       }, 250);

   }


   if (isRunning >  0) {
     return isRunning
     return 'script is running'
   }

    console.log(isRunning);
   await start_upload().then(function(){
   isRunning = max_simultaneous_uploads;
   })
   return 'started ...'



   //Upload sever
   async function get_upload_srv(file){
     axios.get(`https://jetload.net/api/v2/upload/${API_KEY}`).then(function(data){
     console.log(`Uploading file: ${VIDEOS_LOCATION}${file} to srv: ${data.data.hostname}`);
     upload_file(data.data,file)
   })
   }




   async function start_upload(){

     if (!fs.existsSync(system_log)) {
         console.log('error opening file '+system_log + '\n');
       fs.writeFile(system_log, 'asynchronous write!', (err) => {
       if (err) throw err;
       console.log('new log file has been created');
     });
         return;
     }

     if (!fs.existsSync(log_file)) {
         console.log('error opening file '+system_log + '\n');
       fs.writeFile(log_file, 'asynchronous write!', (err) => {
       if (err) throw err;
       console.log('new log file has been created');
     });
         return;
     }
     var uploaded_log = fs.readFileSync(system_log, 'utf8');
     const files = readFilesSync(VIDEOS_LOCATION);
     var files_list = []
     for (var i = 0; i < files.length; i++) {

       if(uploaded_log.includes(files[i].name+files[i].ext)){
         console.log(`File: ${files[i].name+files[i].ext} already uploaded! \n`);
        continue;
       }
       else {
         await files_list.push(files[i].name+files[i].ext)
       }


     }

for (var i = 0; i < files_list.length; i++) {
if (i > max_simultaneous_uploads) {
  return;
}

get_upload_srv(files_list[i])

}

     return 'ok'



    // const files = readFilesSync(VIDEOS_LOCATION);


   }





})














// Run the server!
const start = async () => {
  try {
    await fastify.listen(1000,'0.0.0.0')
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
