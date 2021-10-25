const express=require('express');
const bodyParser=require('body-parser');
const bcrypt = require('bcrypt') ;
const saltRounds = 10;
const cors = require('cors');
const knex=require('knex');

const db=knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '1234567',
      database : 'facedetect'
    }
  });

//   db.select ('*').from ('users').then(data=>{
//         console.log(data);
//   });

const app=express();

app.use(bodyParser.json());
app.use(cors())

const database={
    users:[
        {
            id:'123',
            name:'John',
            password:'hello',
            email:'john@gmail.com',
            password:"hello",
            entries:0,
            joined:new Date()
        },
        {
            id:'124',
            name:'Sally',
            password:'hellos',
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
            res.json(database.users[0]);
        }else{
            res.status(400).json('error loging in');
        }
})

app.post('/register',(req,res)=>{
    const{name,email,password,joined}=req.body;
    // const salt = bcrypt.genSaltSync(saltRounds);
    // const hash = bcrypt.hashSync(password,salt);
    // console.log(hash);
    db('users')
        .returning('*')  
        .insert({
            email:email,
            name:name,
            joined:new Date()
        })
        .then(user=>{
            res.json(user[0]);
        })
        .catch(err=>res.status(400).json('Unable to register'))
})

app.get('/profile/:id',(req,res)=>{
    const{id}=req.params;
    db.select('*').from('users').where({id})
        .then(user=>{
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('Not found')
        }
    })
    .catch(err=> res.status(400).json('err getting user'))
})

app.put('/image',(req,res)=>{
    const{id}=req.body;
    db('users').where('id','=',id)
    .increment('entries',1)
    .returning('entries')
    .then(entries=>{
        res.json(entries[0]);
    })
    .catch(err=>res.status(400).json("Unable to get entries"))
})


app.listen(3003,()=>{
    console.log('App is working');
})