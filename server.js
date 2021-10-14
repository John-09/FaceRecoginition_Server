const express=require('express');
const bodyParser=require('body-parser');
const bcrypt = require('bcrypt') ;
const saltRounds = 10;

const app=express();

app.use(bodyParser.json());

const database={
    users:[
        {
            id:'123',
            name:'John',
            email:'john@gmail.com',
            entries:0,
            joined:new Date()
        },
        {
            id:'124',
            name:'Sally',
            email:'sally@gmail.com',
            entries:0,
            joined:new Date()
        }
    ],
    login:[
        {
            id:"987",
            hash:'',
            email:'john@gmail.com'
        }
    ]
}

app.get('/',(req,res)=>{
    res.send(database.users)    
})

app.post('/signin',(req,res)=>{
    bcrypt.compare('apples', '$2b$10$myZTe0vMt1BIiH0qRQGIwe7t7G8S7uUPPhmAsFoY1OI6w5Yb3/kIq', function(err, res) {
        console.log('first guess',res);
    })
    bcrypt.compare('nice', '$2b$10$myZTe0vMt1BIiH0qRQGIwe7t7G8S7uUPPhmAsFoY1OI6w5Yb3/kIq', function(err, res) {
        console.log('Scenod guess',res);
    })
    if(req.body.email===database.users[0].email&&
        req.body.password===database.users[0].password){
            res.json('Success');
        }else{
            res.status(400).json('error loging in');
        }
})

app.post('/register',(req,res)=>{
    const{name,email,password}=req.body;
    // const salt = bcrypt.genSaltSync(saltRounds);
    // const hash = bcrypt.hashSync(password,salt);
    // console.log(hash);
    database.users.push({
        id:'125',
        name:name,
        email:email,
        password:password,
        entries:0,
        joined:new Date()
    })
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id',(req,res)=>{
    const{id}=req.params;
    let found=false;
    database.users.forEach(user=>{
        if(user.id===id){
            found=true;
            return res.json(user);
        }
    })
    if(!found){
        res.status(400).json('Not found');
    }
})

app.post('/image',(req,res)=>{
    const{id}=req.body;
    let found=false;
    database.users.forEach(user=>{
        if(user.id===id){
            found=true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if(!found){
        res.status(400).json('Not found');
    }
})


app.listen(3000,()=>{
    console.log('App is working');
})