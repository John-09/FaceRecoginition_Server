const express=require('express');
const bodyParser=require('body-parser');
const bcrypt = require('bcrypt') ;
const saltRounds = 10;
const cors = require('cors');
const knex=require('knex');

const db=knex({
    client: 'mysql',
    version: '5.7',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : 'Johnee',
      database : 'test'
    }
  });

//   mysql.select ('*').from ('login').then(data=>{
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
    // db.query(
    //     "INSERT INTO users (name,email,joined) VALUES (name,email,new Date())",
    //     [name,email,joined],
    //     (err,res)=>{
    //         console.log(err);
    //     }
    // );
    db('users')
    return knex('users')
        .returning('*')  
        .insert({
            email:email,
            name:name,
            joined:new Date()
        })
        .then(user=>{
            res.json(user);
        })
        .catch(err=>res.status(400).json('Unable to register'))
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

app.put('/image',(req,res)=>{
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


app.listen(3003,()=>{
    console.log('App is working');
})