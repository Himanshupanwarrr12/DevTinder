const validator = require('validator')

function validateSignUpData(req){
    const  {firstName,emailId,password,gender} = req.body

    if(!firstName){
        throw new Error("Name is  not valid")
    }
    if(!gender){
        throw new Error("gender is not valid")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("please enter a strong password")
    }
}


module.exports = {validateSignUpData} 