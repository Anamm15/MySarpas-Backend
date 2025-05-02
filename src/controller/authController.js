const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// sesuaikan dengan db

const register =async(req,res)=>{
    try{
        // variable body
        // Hash password
        // const hashedPassword = await bcrypt.hash(password, 10);
        // generate jwt
        res.status(201).json({
            data : "tes" //{isi data}
        })
    }catch(err){
        res.json({
            err: err
        })
    }
}
const login =async(req,res)=>{
    try{
        // variable body
        // buat token
        res.status(201).json({
            data : "tes" //{isi data}
        })
    }catch(err){
        res.json({
            err: err
        })
    }
}

module.exports = {
    register,
    login
  };