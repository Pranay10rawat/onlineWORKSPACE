const mongoose=require('mongoose');
const Schema=mongoose.Schema;

//creating the model Schema
const FolderSchema=new Schema({
  name:String,
  parent:String
})

const folder=mongoose.model('folder',FolderSchema);
module.exports=folder;
