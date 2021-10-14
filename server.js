const express=require('express');
const bodyParser=require('body-parser');
const bcrypt = require('bcrypt');

const app=express();
const saltRounds = 10;
const myPlaintextPassword = 'password';

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
    bcrypt.compare(myPlaintextPassword, '$2b$10$8UXLa5o3ufv3XJDI6Ws4UuxTzSyECj3ukg9cTWX2dDBYYRa9aOg4y', function(err, result) {
        console.log('first guess',res);
    });
    bcrypt.compare('veggies', '$2b$10$8UXLa5o3ufv3XJDI6Ws4UuxTzSyECj3ukg9cTWX2dDBYYRa9aOg4y', function(err, result) {
        console.log('Second guess',res);
    });
    if(req.body.email===database.users[0].email&&
        req.body.password===database.users[0].password){
            res.json('Success');
        }else{
            res.status(400).json('error loging in');
        }
})

app.post('/register',(req,res)=>{
    const{name,email,password}=req.body;
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