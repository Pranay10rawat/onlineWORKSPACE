const router=require('express').Router();
const passport=require('passport');


//***********************google authentication *********/

router.get('/google',passport.authenticate('google',{
    scope:['profile']
}))



router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
    res.redirect('/profile/workspace');
})



//*************************************************** */


module.exports=router;
