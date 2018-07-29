const express=require('express');
const mongoose = require('mongoose');
const router =express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');



require('../models/user');

//passport config

require('../config/passport')(passport);



const User=mongoose.model('user');

router.get('/register',(req,res)=>{

  res.render('user/register');  

});

router.get('/login',(req,res)=>{
    
   res.render('user/login');
})


router.post('/register',(req,res)=>{

console.log('in post of register')
if(req.body.password !=req.body.Cpassword){
    req.flash('error_msg','Confirm password does not match');
    console.log('password does not match');
    res.redirect('/user/register');

}
if(req.body.password.length < 6){
    req.flash('error_msg','The length of Password should be greater than or equal to 6 characters');
    console.log('password length')
    res.redirect('/user/register');
}


else{


    User.findOne({email:req.body.email}).then( user=>{

        console.log(user)
if(user){

    req.flash('error_msg','Email already registered');
    res.redirect('/user/register');

}else{
const newUser =new User({

    name:req.body.name,
        username:req.body.username,
         email:req.body.email,
         password:req.body.password, 

});
console.log('here')
bcrypt.genSalt(10,(err,salt)=>{

bcrypt.hash(newUser.password,salt,(err,hash)=>{

    if(err) throw err;
    newUser.password=hash;

    newUser.save()
    .then( ()=>{
req.flash('success_msg','You are succesfully registered and can log in');
res.redirect('/user/login');

    } )
    .catch(err=>{
console.log(err);

    })
})

}  )

}

    } ).catch(err=>{
        console.log(err);
    })

}

});


router.post('/login',  (req,res,next)=>{
    console.log('in post');
    passport.authenticate('local',{
        successRedirect:'/kb/' ,
        failureRedirect:'/user/login' ,
        failureFlash:true
    })(req,res,next);



    
});


router.get('/logout',(req,res)=>{

req.logout();
console.log('logged out successfully !!!');
req.flash('success_msg','You are logged out !!!');
res.redirect('/user/login');

})

module.exports =router;
