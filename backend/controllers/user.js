const pool = require("../db");
const {CreateTokenForUser,ValidateToken} = require("../service/auth")

async function LoginUser(req,res) {
     const {sub,name,email} = req.body;
     const user = {
      sub: sub,
      name:name,
      email:email,
     }

      try {
        const x =  await pool.query("select * from users where email = $1",[email]);

        if(x.rows.length == 0) {
        await pool.query(
  "INSERT INTO users (sub,name, email) VALUES ($1, $2,$3)",
  [sub,name, email]
);


}
const token = CreateTokenForUser(user);
    res.cookie('uid',token);

         return res.json({success:true});
      } catch (error) {
            console.error("Database operation failed:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });

      }
    
   


}



module.exports = {LoginUser};
