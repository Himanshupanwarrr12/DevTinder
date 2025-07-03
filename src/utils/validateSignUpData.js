const validator = require('validator')

function validateSignUpData(req){
    const  {firstName,emailId,password,gender,skills} = req.body

    if(!firstName){
        throw new Error("Name is  not valid")
    }
    if(!gender){
        throw new Error("gender is not valid")
    }
     if(!skills){
        throw new Error("skills are  required")
    }
     if(!validator.isEmail(emailId)){
        throw new Error("email is not valid")
    } if(!validator.isStrongPassword(password)){
        throw new Error("please enter a strong password")
    }
}


module.exports = {validateSignUpData} 