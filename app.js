const express =require('express');
const exphbs =require('express-handlebars');
const app=express();
const bodyParser=require('body-parser');
const path=require('path');
const mongoose=require('mongoose');
const session = require('express-session');
const methodOverride=require('method-override');

mongoose.connect('mongodb://localhost/KBase').
then( ()=>console.log('Mongodb Connected') ).
catch(err=>console.log(err)   );

require('./models/knowledge')
const Knowledge=mongoose.model('knowledge');


//session
app.use(session({

    secret:'My secret' ,
    resave:true,
    saveUninitialized:true
    
}))




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

app.get('/kb/add',(req,res)=>{

    res.render('kb/add');



})


app.post('/kb/add',(req,res)=>{

    console.log(req.body.content);
let errors=[];

if(!req.body.title){
errors.push({

    text : "Please Enter a valid title"
})
}
if(!req.body.content){
    errors.push({
       text : "Please add Content"
    });
}
console.log(errors);
if(errors.length > 0){
    res.render('kb/add' ,{
        errors:errors,
        title:req.body.title,
        content:req.body.content
    });
}else{
    const newUSer={
        title:req.body.title,
        content:req.body.content
    }

    new Knowledge(newUSer).save().
    then(()=>{
        console.log('Data saved Successfully....!!!')
        res.redirect('/kb/');

    }).catch(err=>{
        console.log(err);
    });

}

});

app.get('/kb/',(req,res)=>{
Knowledge.find({})
.sort({date:'desc'})
.then(kb=>{
    //console.log(kb);
    res.render('kb/index',{
        kb:kb
    });
}).catch(err=>{

    console.log(err);
})

})


app.get('/kb/edit/:id',(req,res)=>{
 //console.log('hello')
  
  //console.log('The Trimmed id='+a);
    Knowledge.findOne({_id:req.params.id}).
then(KBase=>{
console.log(KBase);
    res.render('kb/edit',{    
       kb:KBase
    })

}).catch(err=>{

    console.log(err);
});

});



app.put('/kb/edit/:id',(req,res)=>{

    let a=JSON.stringify(req.params.id);
 // console.log( mongoose.ObjectID(req.params.id)) 
    //JSON.stringify(obj)
console.log(`After Stringify`+a);
console.log(`without Stringify`+req.params.id);

var b=req.params.id;
var s=b.substr(1)
//var c=JSON.stringify(b)
console.log(s);
//mongoose.Types.ObjectId(a)
console.log('in put')
    Knowledge.findOne({
       _id:s
    }).
    then(kb=>{
        console.log('here');
kb.title=req.body.title;
kb.content=req.body.content;
kb.save();
console.log('Edit successfull');
res.redirect('/kb/');
    }).catch(err=>{
        console.log(`here are errors..........${err}`);
    } );

});


//Delete KB

app.delete('/kb/delete/:id',(req,res)=>{

    console.log(req.params.id)
Knowledge.remove({_id:req.params.id}).
then((()=>{

console.log('removed');
res.redirect('/kb/')

})  )

.catch( err=>{

    console.log(err);
})


})




app.listen(5001,(req,res)=>{

    console.log('app running on port 5001')

});