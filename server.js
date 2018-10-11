const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const fs=require('fs');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const mime=require('mime-types');
const keys = require('./config/keys');
const find=require('find');
const multer=require('multer');
const GridFsStorage=require('multer-gridfs-storage');
const Grid=require('gridfs-stream');
const folderModel=require('./models/folderModel');

var childProcess=require('child_process');
var Schema=mongoose.Schema;

var path=require('path');
var urlencodedParser=bodyParser.urlencoded({extended:false});


//********************SETTING view engines and routes****************************

app.set('view engine','ejs');
app.use('/compile-run',express.static('./public'));
app.use(express.static('./loginpage'));
app.use('/profile/workspace',express.static('views'));


app.listen(4000,()=>{
  console.log("the server has started");
})

//*******************************************************************************



//********************compilation-routes***********************

//promise declarations
function inputFile(req){
  return  new Promise((resolve,reject)=>{
  fs.writeFile('input.cpp',req.body.input,function(err,file){
    console.log("hello world-1");
    if(err)throw err;
    resolve('input complete');
  })
})
}


function outputFile(req){
  return new Promise((resolve,reject)=>{

  fs.writeFile('code.cpp',req.body.Code,function(err,file){
    console.log("hello world-2");
    if(err)throw err;
    resolve('and program file generated');
  });
})
}

function saveFile(req){
  return new Promise((resolve,reject)=>{
    fs.writeFile('save.cpp',req.body.Code,function(err,file){

      if(err)throw err;
      resolve('file saved');

    });
  });
}




function executeFile()
{

  return new Promise((resolve,reject)=>{
    var spawn=childProcess.spawnSync;

  console.log("hello world-3");
  var compile=spawn('g++',['code.cpp']);


    console.log("the promise function is working well");
    const exec=childProcess.exec;

      exec('a.exe < input.cpp',function(err,stdout,stderr){
        if(err)
        throw err;
        console.log("hello world4 "+stdout);
        resolve(stdout);

      });
    });
}
//*********************storing in gridfs************

//grabbing the file from the file system
function storeFile(docName,parent){
return new Promise((resolve,reject)=>{

  console.log("the file has been written with + "+parent );
var file=path.join(__dirname,'./save.cpp');
Grid.mongo=mongoose.mongo;


  console.log('-connection open -');
  var gfs=Grid(conn.db);

  var writestream=gfs.createWriteStream({
    filename:docName,
    metadata:parent

  });
  fs.createReadStream(file).pipe(writestream);

  writestream.on('close',function(file){
    console.log(file.filename+'Written to DB');
    resolve(true);
  })

})
}

app.use("/downloadFile",urlencodedParser,function(req,res){

gfs.files.findOne({filename:req.body.name,metadata:req.body.parent},(error,file)=>{

const readstream=gfs.createReadStream(file.filename);
readstream.pipe(res);


})



})

//**************************************************

//*******find files*********************************
app.use("/getList",urlencodedParser,function(req,response){
console.log("current directory is "+req.body.directory);
 var folders=[],files=[];

var findFolders=new Promise(function(resolve,reject){
  folderModel.find({parent:req.body.directory},function(err,foundData){
      if(err){
        console.log("error occured");

      }
      else

        folders=foundData

resolve(true);
     });
})

   findFolders.then(function(){
     gfs.files.find({metadata:req.body.directory}).toArray(function(error,files){

         if(files.length===0){
            response.send({folders:folders,file:[]});
           }
           else
              response.send({folders:folders,file:files});
         });
   })




   })



//*****************************************************



app.use("/compile",urlencodedParser,function(req,res){
async function main(){
  const getInput=await inputFile(req);
  const getoutput=await outputFile(req);
  const output=await executeFile();
  console.log(output);
  res.send(output);
}
//saving the code route
main();
});

//*****************creating new folder********

app.use("/folder",urlencodedParser,function(req,res){

var createNewFolder=new Promise(function(resolve,reject){
  folderModel.create({
    name:req.body.name,
    parent:req.body.parent

  })
  resolve(true)
})
createNewFolder.then(function(){
  res.send(true);
})
})


//*********************************



app.use("/save",urlencodedParser,function(req,res){

  async function save(){
    const status=await saveFile(req);
    console.log(req.body.parent);
    const file=await storeFile(req.body.fileName,req.body.parent);

    res.send("done");
  }
  save();

})


//**************************end compilation-route********************



//*******************************Authentication-process******************/
app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[keys.session.cookieKey]
}));


//initialize passport
app.use(passport.initialize());
app.use(passport.session());


//connect to mongodb
// mongoose.connect(keys.mongodb.dbURI,()=>{
//   console.log('connected to mongo db');
// });

let gfs;
mongoose.connect('mongodb://localhost/function');
var conn=mongoose.connection;
mongoose.Promise=global.Promise;
mongoose.connection.once('open',function(){
gfs=Grid(conn.db,mongoose.mongo);
  console.log('Connection has been made now make fireworks');

}).on('error',function(error){
  console.log('Connection error:')
});

app.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/');
})


//set up authRoutes
app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);

//create home routes
