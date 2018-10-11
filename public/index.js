var sourceCode=$("#sourceCode");
var button=$("#myButton");
var input=$("#input");
var output=$("#output");
console.log("hello world");
button.click(function(){

 $.post("/compile",{
   Code:sourceCode.val(),
   input:input.val()
 },function(data,status){
   output.append(data);
 });



});
