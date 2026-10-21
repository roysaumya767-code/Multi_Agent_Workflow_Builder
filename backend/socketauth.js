require("dotenv").config();
const { createRemoteJWKSet, jwtVerify } = require("jose");

const jwks = createRemoteJWKSet(new URL(`https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`));

async function socketAuth(socket,next) {
    const token = socket.handshake.auth?.token;
     if (!token) {
      return next(new Error("Authentication required"));
    }
    const {payload} = await jwtVerify(token,jwks,{
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      audience: process.env.AUTH0_AUDIENCE,
    });
    socket.user = {
        id:payload.sub,
    }

}
module.exports = socketAuth;