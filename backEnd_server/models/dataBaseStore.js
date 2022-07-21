const mongoose=require('mongoose')

const employee=new mongoose.Schema({
    employeeName:{
        type:String,
        required:true
    } ,
    employeeBirth:{
        type:Date,
        required:true
    },
    employeeGender:{
        type:String,
        required:true
    },
    employeeSalary:{
        type:Number,
        required:true
    }
});

module.exports=mongoose.model('employeeDataBase',employee)