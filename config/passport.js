const LocalStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');


const User =mongoose.model('user');

    
module.exports= function(passport){

    passport.use(new LocalStrategy({usernameField:'username'},(username,password,done)=>{
    
        console.log(username);
        console.log(password);
    //Match user
        User.findOne({
           username:username
        }).then(user =>{
            if(!user){
                console.log('no user found');
                return done(null,false,{message:'no user found'});
            }
    //Match password
    bcrypt.compare(password,user.password ,(err,isMatch)=>{
        if(err) throw err;
        if(isMatch){
            return done(null,user);
        }else{
            return done(null,false,{message:'Password Incorrect'});
        }
    
    })
        })
    
    }))
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
    
    }
