const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const key ='abcd123@!#';

let User; 
try {
  User = mongoose.model('users');
} catch (error) {
  User =  require('../model/user.model').getUserModel();
}


exports.generateToken = (payload) =>{
    let token = jwt.sign(payload, key);
    return token;
}

exports.verifyToken = (req, res, next) =>{

    let token = req.headers['token'];
    jwt.verify(token, key, (err, decoded)=>{

        if(err){
            res.status(403).json('Invalid token');
        }else{

            try{

                User.find({email: decoded.email},(err,data)=>{
                    if(err){
                        res.status(403).json('Some error');
                    }else{
                        if(data.length>0){
                            req.headers['token'] = JSON.stringify(data[0]);
                            next();
                        }else{
                            res.status(403).json('Not a valid user');
                        }
                    }
                   
                });

            }catch(e){
                res.status(403).json('Some error');
            }
           
           
        }
    });
}