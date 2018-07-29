const express=require('express');
const mongoose = require('mongoose');
const router =express.Router();



require('../models/knowledge');
const Knowledge =mongoose.model('knowledge');


router.get('/add',(req,res)=>{

    res.render('kb/add');



})

//add KnowledgeBase

router.post('/add',(req,res)=>{

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
        console.log('Data saved Successfully....!!!');
        req.flash('success_msg','Your new KnowledgeBase Added');
        res.redirect('/kb/');

    }).catch(err=>{
        console.log(err);
    });

}

});

router.get('/',(req,res)=>{
Knowledge.find({})
.sort({date:'desc'})
.then(kb=>{
    //console.log(kb);
    //console.log(user);
    res.render('kb/index',{
        kb:kb
    });
}).catch(err=>{

    console.log(err);
})

})


router.get('/edit/:id',(req,res)=>{
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



router.put('/edit/:id',(req,res)=>{

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
req.flash('success_msg','Your KnowledgeBase Successfully Edited')
res.redirect('/kb/');
    }).catch(err=>{
        console.log(`here are errors..........${err}`);
    } );

});


//Delete KB

router.delete('/delete/:id',(req,res)=>{

    console.log(req.params.id)
Knowledge.remove({_id:req.params.id}).
then((()=>{

console.log('removed');

req.flash('error_msg','Your KnowledgeBase deleted')
res.redirect('/kb/')

})  )

.catch( err=>{

    console.log(err);
})


})

module.exports=router;

