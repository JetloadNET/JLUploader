//JL Upload version 0.1
const fs = require('fs')
var request = require('request');
const axios = require('axios');
const settings = require('/opt/settings.json');

var isRunning = false;
if (isRunning == true) {
console.log('wait until all uploads finished...');
return;
}
console.log(isRunning);
const API_KEY = settings.API_KEY
const VIDEOS_LOCATION = settings.VIDEOS_LOCATION
var log = false;
var log_file = settings.log_file
var system_log = settings.system_log
var log_format = settings.log_format
var max_simultaneous_uploads = settings.max_simultaneous_uploads



// Log function
function xlog(url,code){
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

//Upload sever
function get_upload_srv(file){
  axios.get(`https://jetload.net/api/v2/upload/${API_KEY}`).then(function(data){
  console.log(`Uploading file: ${VIDEOS_LOCATION}${file} to srv: ${data.data.hostname}`);
  upload_file(data.data,file)
})
}

//Upload function
function upload_file(data,file){
  var isRunning = true
  console.log(file);

  var url = data.hostname+data.path
  var file_data = fs.createReadStream(`${VIDEOS_LOCATION}${file}`)

  var formData = {
          file: file_data,
          upload_id:data.upload_id.user_id
  };

let size = fs.lstatSync(`${VIDEOS_LOCATION}${file}`).size;
var r = request.post({url:url, formData: formData}, function optionalCallback(err, httpResponse, body) {
  console.log(body);
        clearInterval(q);
});

var q = setInterval(function () {
        var dispatched = r.req.connection._bytesDispatched;
        let percent = dispatched*100/size;
         console.dir(file+" Uploaded: " + percent.toFixed(2) + "%");

    }, 250);
 
}


// ready files in directory
var i = 0
fs.readdirSync(VIDEOS_LOCATION).forEach(file => {
   i+=1
  // check if file already uploaded!
  fs.readFile(system_log, function (err, data) {
  if(data.includes(file)){
    console.log(`File: ${file} already uploaded! \n`);
   return;
  }
});

if (i > max_simultaneous_uploads) {
  return;
}
get_upload_srv(file)

});
