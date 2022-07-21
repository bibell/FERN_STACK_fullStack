const { json } = require('express');
const express=require('express');
const fs=require("fs");
const path=require('path');
const { stringify } = require('querystring');
const { findByIdAndRemove, findByIdAndUpdate } = require('../models/dataBaseStore');
const employeeDataBase=require('../models/dataBaseStore');
const route=express.Router();

route.get('/',(req,res)=>{
    console.log("the backend you write is working correctlly")
    res.status(200).json("we will send you the output")
})

route.get('/allUser/info/dns',(req,res)=>{
    res.status(200).json({name:"belay hacker",message:'these is the pure message',email:'smone',password:'nemar hasen'})
})

//create each user acount in the file system with out using database 
route.post('/userAcount/signUp',(req,res)=>{
    let recievUserInfo={
        userName:req.body.name,
        userPhone:req.body.phone,
        userEmail:req.body.email,
        userPassword:req.body.password
    }
    console.log(recievUserInfo);
    console.log("the url whare it comme from is just that "+req.url);
    console.log("the method that came from is just that "+req.method);
  fs.readFile(path.join(__dirname,'acounts','key',recievUserInfo.userPhone+'.txt'),'utf8',(err,data)=>{
      if(err){
          console.log('there is being error has been ocured'+err)
          fs.writeFileSync(path.join(__dirname,'acounts','key',recievUserInfo.userPhone+'.txt'),recievUserInfo.userPhone)
          //res.status(200).json('false');
          fs.readFile(path.join(__dirname,'acounts',recievUserInfo.userPhone+recievUserInfo.userPassword+'.json'),'utf8',(err,data)=>{
            if(err){
             fs.writeFileSync(path.join(__dirname,'acounts',recievUserInfo.userPhone+recievUserInfo.userPassword+'.json'),`{"userName":"${recievUserInfo.userName}",\n "userPhone":"${recievUserInfo.userPhone}",\n "userEmail":"${recievUserInfo.userEmail}",\n "userPassword":"${recievUserInfo.userPassword}"\n}`);
             console.log('user information is being created successfully');
               //console.log("some kind of error has been made in file reading "+err);
               res.status(200).json(recievUserInfo);
              try{ 
               console.log('user existes .....');
               res.status(200).json(data);
             }catch(e){
                console.log("some kind of error has been ocured during writing file to the server");  
                res.status(301).json(e);
                }
             }else{
                console.log(data);
                let changeFileToJson=JSON.parse(data);
                res.status(200).json(changeFileToJson);
            }
        })
        }
      else{
        res.status(200).json('true')
      }
  })
    /*
    let fileExists=fs.existsSync(path.join(__dirname,'acounts',recievUserInfo.userPhone+'.txt'));
   if(fileExists){
       console.log("the file you are requested is exists");
   }else{
       console.log("the file you are requested is not existes");
   }
   */
   


})

route.post('/profile/user/image',(req,res)=>{
    let comming={
        name:req.body.name,
        type:req.body.type
    }
 
    console.log(comming);
    res.json(comming);
})

route.post('/userAcount/login',(req,res)=>{
    let creadential={
        phone:req.body.phone,
        pass:req.body.pass
    }
    console.log(creadential);
   fs.readFile(path.join(__dirname,'acounts',creadential.phone+creadential.pass+'.json'),'utf8',(err,data)=>{
       if(err){
           res.status(301).json('invalid creadential');
       }else{
           res.status(200).json(data);
       }
   })  
})

route.post('/api/empoyee/read',(req,res)=>{
    console.log('the first api call is being runnig...')
    res.status(200).send('response is being send to the client')
});

//store the employee information to the mongose database
//CREATE
route.post('/employee/api/creat/employeeInfo',async(req,res)=>{
    //use the model to store the actual employee information
    const employeeData=new employeeDataBase({
        employeeName:req.body.uname,
        employeeBirth:req.body.udate,
        employeeGender:req.body.ugender,
        employeeSalary:req.body.usalary
    });

    //now i will use try and catch block if there is some problem 
    //these will help me to handle the errors before the app crashes
    try{
       await employeeData.save();
       console.log('saving the employee information is success');
       res.status(200).json({message:'Employee Data is being saved'});
    }catch(e){
       console.log('unable to store employee information due to '+e);
       res.status(300).json(e);
    }

});

//READ all the database information
route.get('/employee/api/read/employeeInfo',async(req,res)=>{
  //write try and catch block to handle the error   
    try{
        console.log('some kind of request is comming from the client side');

      const employeeList=await employeeDataBase.find();
      console.log(' reading employee list is succes');
      res.status(200).json(employeeList);
     }catch(e){
         console.log('error in reading employee lists due to '+e);
         res.status(300).json(e);
     }

});

//UPDATE employee information
route.put('/employee/api/update/employeeInfo/:id',async(req,res)=>{
    //get the specific employee information
    const getValues={        
        getNewName:req.body.newEmployeeName,
        getNewBirth:req.body.newEmployeeBirth,
        getNewGender:req.body.newEmployeeGender,
        getNewSalary:req.body.newEmployeeSalary

    };

  console.log(req.params.id);  

console.log('____________________________');
console.log(getValues.getNewName);
console.log(getValues.getNewBirth);
console.log(getValues.getNewGender);
console.log(getValues.getNewSalary);

    //now use try and catch block for error handling
    try{
                 
      const updatedData=await employeeDataBase.findByIdAndUpdate({_id:req.params.id},
                                                {employeeName:req.body.newEmployeeName,
                                                employeeBirth:req.body.newEmployeeBirth,
                                                employeeGender:req.body.newEmployeeGender,
                                                employeeSalary:req.body.newEmployeeSalary});
      console.log('employee updated sucessfully');
      res.status(200).send({message:'updated sucessfully'});        
                                                                                    
    }catch(e){
        console.log('error in updating employee information due to '+e);
        res.status(300).json(e);
    }
});

//DELETE employee infromation
route.delete('/employee/api/delete/employeeInfo/:id',async(req,res)=>{
    const getInfo=req.params.id;
    try{
      await employeeDataBase.findByIdAndRemove({_id:getInfo});
      console.log('deleteing the user information success');
      res.status(200).json('Employee has been removed sucesfully');
    }catch(e){
        console.log('unable to remove employee informtion due to '+e);
        res.status(300).json({message:'problemose removing employee'});
    }
});


route.post('/userPost/notification',(req,res)=>{
    let getInfo={
        name:req.body.name,
        message:req.body.message,
        date:req.body.date
    }
    
 fs.appendFile(path.join(__dirname,'notification.txt'),`,{\n "name":"${getInfo.name}",\n "message":"${getInfo.message}",\n "date":"${getInfo.date}" \n}\n`,(err)=>{
     if(err){
         console.log('error ocured during appending file'+err)
         res.header('javaScript/text').status(200).json(err);
     }else{
        //res.header('application/json').status(200).json('it has been appending file is being success')      
        fs.readFile(path.join(__dirname,'notification.txt'),'utf8',(err,data)=>{
          if(err){
              console.log(err)
          }else{
                          
            fs.writeFile(path.join(__dirname,'notification.json'),`{\n"userId":[${data}]}`,(er,da)=>{
                if(er){
                   console.log(er)
                }else{
                    console.log(da)
                    res.status(200).json(da)
                }
            })
            res.status(200).json(data)
             
        }
       }) 
       }
 })

})

module.exports=route;