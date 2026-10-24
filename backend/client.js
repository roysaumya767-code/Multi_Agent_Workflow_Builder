const {Redis} = require('ioredis');
const {addToQueque} = require("./job");
const client = new Redis({
      host: "127.0.0.1",
  port: 6379,

}

);

client.on('connect', () => {
  console.log("Successfully connected to Redis");
});

client.on('error', (error) => {
  console.log(`Redis error: ${error.message}`);
});



module.exports = client;