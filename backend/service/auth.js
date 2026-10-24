const JWT = require("jsonwebtoken");
const secret = "XXXXXX";
function CreateTokenForUser(User) {
    const payload = {
        sub:User.sub,
        email:User.email,
    }
    const token = JWT.sign(payload,secret);
    return token;


}
function ValidateToken(token) {
    const payload = JWT.verify(token,secret);
    return payload;
    

}
module.exports = {CreateTokenForUser,ValidateToken};