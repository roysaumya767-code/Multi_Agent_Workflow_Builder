const pool = require("../db");

async function LoginUser(req,res) {
     const {name,email} = req.body;
      try {
        const x =  await pool.query("select * from users where email = $1",[email]);

        if(x.rows.length == 0) {
        await pool.query(
  "INSERT INTO users (name, email) VALUES ($1, $2)",
  [name, email]
);

        }
         return res.json({Success:"true"});
      } catch (error) {
            console.error("Database operation failed:", error.message);
    return res.status(500).json({ success: "false", message: "Server error" });

      }
    
   


}



module.exports = {LoginUser};
