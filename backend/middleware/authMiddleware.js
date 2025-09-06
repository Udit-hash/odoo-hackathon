const jwt=require("jsonwebtoken");

const {jwt_secret} = require("../utils/validators");

const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(411).json({
            msg:"User authorization failed"
        })
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token,jwt_secret);
        if(decode){
            req.email=decoded.email;
            next();
        }else{
            return res.status(411).json({
                msg:"User authorization failed"

            })
        }
    } catch (error) {
        return res.status(403).json({
            msg:"Authorization failed"
        })
    }
}

module.exports={
    authMiddleware
}
