const router=require('express').Router();




router.get('/workspace',(req,res)=>{
    if(req.user==undefined)
    res.redirect('/');
    res.render('profile',{user:req.user});
});


module.exports=router;
