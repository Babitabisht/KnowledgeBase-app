const express =require('express');
const exphbs =require('express-handlebars');
const app=express();
const bodyParser=require('body-parser');
const path=require('path');
const mongoose=require('mongoose');
const session = require('express-session');
const methodOverride=require('method-override');
const flash=require('express-flash');

mongoose.connect('mongodb://localhost/KBase').
then( ()=>console.log('Mongodb Connected') ).
catch(err=>console.log(err)   );

require('./models/knowledge')
const Knowledge=mongoose.model('knowledge');

const kb=require('./routes/kb');
const user=require("./routes/user");


//session
app.use(session({

    secret:'My secret' ,
    resave:true,
    saveUninitialized:true
    
}));

app.use(flash());
app.use( (req,res,next)=>{

res.locals.success_msg=req.flash('success_msg');
res.locals.error_msg=req.flash('error_msg');

next();
}  )




//handlebars middleware
app.engine('handlebars',exphbs({
    defaultLayout:'main'
}));
app.set('view engine','handlebars');

//method override

app.use(methodOverride('_method'));



//body-Parser Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.get('/',(req,res)=>{

    res.render('index',{
        title:'hello'
    });

   });


app.get('/about',(req,res)=>{

    res.render('about');

});   

app.use('/kb',kb);
app.use('/user',user)
app.listen(5001,(req,res)=>{

    console.log('app running on port 5001')

});