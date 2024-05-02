const jwt = require("jsonwebtoken");

function verifyToken(req,res,next){

    if(req.headers.authorization!==undefined){
        let token = req.headers.authorization.split(" ")[1];
        jwt.verify(token,"NutrifyApp",(err,data)=>{
        if(!err){
             next();
        }
        else{
            res.status(403).send({message:"invalid token"})
        }
    })
        
    }
    else{
        res.send({message:"Pleaswe send the token"})
    }
   
}

module.exports = verifyToken;