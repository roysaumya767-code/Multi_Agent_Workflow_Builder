const { ValidateToken } = require("../service/auth");

function  restrictToLoggedinUser(req,res,next) {
     const userx = req.cookies?.uid;
     
    if(!userx) return res.status(401).json({ error: "Login required" });
    const user = ValidateToken(userx);
       
    if(!user) return res.status(401).json({ error: "Login required" });
    req.user=user;
    next();
}


module.exports = {
    restrictToLoggedinUser
};