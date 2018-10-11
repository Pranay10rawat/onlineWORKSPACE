var editor=ace.edit("editor");
var contents=$("#contents");
var dirStatus=$("#current-dir");
var newFolder=$('#create');
var folderName=$('#folderName')
var fileName=$("#fileName");
var saveButton=$("#saveMe");
var button=$("#myButton");
var input=$("#input");
var output=$("#output");
var curFiles=$("#cur-dir-files");
var curFolders=$('#cur-dir-folders');
var curDirectory="main";




var getFiles=function(instance){

$.post("/downloadFile",{name:instance.innerHTML,parent:curDirectory},function(data,status){
editor.setValue(data);
});

}

var getFolders=function(instance){

  var jumpingDir=instance.innerHTML;
  curDirectory=jumpingDir;
  dirStatus.append("/"+jumpingDir);
  console.log("the current jumping directory "+jumpingDir);

  getList(jumpingDir);




}


var getList=function(directory){
curFolders.empty();
curFiles.empty();
$.post("/getList",{
  directory:directory
},function(data,status){
  console.log(data);

  var files="",folders="";
  for(var i=0;i<data.file.length;i++)
  files+=`<li class="list-group-item list-group-item-action" onclick="getFiles(this)">${data.file[i].filename}</li>`

  for(var k=0;k<data.folders.length;k++)
  folders+=`<li class="list-group-item list-group-item-action" onclick="getFolders(this)">${data.folders[k].name}</li>`

  curFiles.append(files)
  curFolders.append(folders);

})

}
getList(curDirectory);


console.log("hello world");
button.click(function(){
output.empty();

 var sourceCode=editor.getSession().getValue();


 $.post("/compile",{
   Code:sourceCode,
   input:input.val()
 },function(data,status){
   output.append(data);
 });

});
newFolder.click(function(){



   $.post("/folder",{
   name:folderName.val(),
   parent:curDirectory
 },function(data,status){
   dirStatus.append("/"+folderName.val());
   console.log("this is the folder name "+folderName.val());
  curDirectory=folderName.val();
   getList(curDirectory);
 });




 });

saveButton.click(function(){

console.log("the button has been clicked");
  var sourceCode=editor.getSession().getValue();

  $.post("/save",{
    Code:sourceCode,
    fileName:fileName.val(),
    parent:curDirectory
  },function(data,status){
    console.log(status);
    getList(curDirectory);
  });
});
