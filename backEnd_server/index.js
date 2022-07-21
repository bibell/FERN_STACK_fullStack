//import express and other libraries to the project
const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const http=require('http');
const {Server}=require('socket.io');
const rout=require('./routes/controller.js');
const app=express();
const path=require('path');
const fs=require('fs');
//const bcrypt=require('bcrypt');

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(rout);

//write socket connection 
const server=http.createServer(app)

const io=new Server(server,{
    cors:{
        origin:'http://localhost:3000',
        methods:["GET","POST"]
    }
    
})

io.on('connection',(socket)=>{
    //socket.emit('frontRecv',socket.id);
    console.log(`user is being connected with the id of ${socket.id}`)
    //console.log('name  '+data.name);
    //console.log('phone '+data.phone);
    //let message='';
    //io.emit('frontRecv',socket.id)
    let dataSocket=socket.id
    socket.on('EmployeeChatRoom',(data)=>{
        console.log('some message send by the name of '+data.name);
        console.log('the actual message is '+data.message);
        console.log("is these working "+socket.id);
     //try to save the actual message in the server file system
     try{
        //fs.writeFileSync(path.join(__dirname,'chat.txt'),`${data.name} \n ${data.message}`); 
        fs.appendFile(path.join(__dirname,'publicMessage.txt'),`\n"userName":"${data.name}", \n"message":"${data.message}", \n`,(err)=>{
            if(err){
                console.log(err)
            }
        })  
         io.emit('publicMessage',data);
         io.emit('frontRecv',data);
        }catch(e){
            console.log("some kind of error has been ocured during messaging...."+e);
        io.emit('publicMessage',data);
        io.emit('frontRecv',data);
           }
    });
    //io.emit('publicMessage',message);
  
})

const PORT=process.env.port;
const urlKey=process.env.url;
 
mongoose.connect(urlKey,(err,data)=>{
    if(err){
       console.log('error has been ocured during connecting with mongoose '+err);
    }else{
        console.log("Connection has been made with mongoose database "+data);
    }
});

server.listen(7000,()=>{
    console.log(`express app running on port ${PORT}`);
});