// http://expressjs.com/api.html#res.download
var express = require('express')
  , app = module.exports = express()
  walk=require('walk');

 var filesStorage=__dirname + '/files/';
 var files=[];
app.get('/',loadFilesNames, function(req, res){
  var responseHtml=files.length>0?'':'There is No file to download';
  for(var i=0;i<files.length;i++)
  {
    responseHtml+='<li>Download <a href="'+files[i]+'">'+files[i]+'</a>.</li>';
  }
  responseHtml='<ul>'+responseHtml+'</ul>';
  res.send(responseHtml);
});

// load files 
function loadFilesNames(req,res,next)
{
  files=[];
// Walker options
var walker  = walk.walk(filesStorage, { followLinks: false });

walker.on('file', function(root, stat, next) {
    // Add this file to the list of files
    files.push(stat.name);
    next();
});

walker.on('end', function() {
    next();
});

}

// /files/* is accessed via req.params[0]
// but here we name it :file
app.get('/:file(*)',loadFilesNames, function(req, res, next){
  var file = req.params.file;
    
file=file.replace('dua','').replace('.json','');
   // check if latest file is exist
   var fileName='dua'+file+'.json';
   var path=__dirname + '/files/' + fileName;
   var indexOfRequestedFile=files.indexOf(fileName);
   console.log(indexOfRequestedFile);
   if(indexOfRequestedFile<0){
     res.statusCode = 404;
    res.send('file not found');
   }
   else if(indexOfRequestedFile<files.length-1){
    path=__dirname+'/files/'+files[files.length-1];
   }
  res.download(path);
});
// error handling middleware. Because it's
// below our routes, you will be able to
// "intercept" errors, otherwise Connect
// will respond with 500 "Internal Server Error".
app.use(function(err, req, res, next){
  // special-case 404s,
  // remember you could
  // render a 404 template here
  if (404 == err.status) {
    res.statusCode = 404;
    res.send('Cant find that file, sorry!');
  } else {
    next(err);
  }
});

  app.listen(process.env.PORT||3000);
  console.log('Express started on port %d', 3000);
