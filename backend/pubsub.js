const {Redis} = require('ioredis');
const client = require("./client");
const subscriber = new Redis({
      host: "127.0.0.1",
  port: 6379,

});

async function publishMessage(channel,message) {
    await client.publish(channel, JSON.stringify(message));

}


async function subscribeMessage(channel,callback) {
    await subscriber.subscribe(channel);
    subscriber.on("message",(receivedChannel, message)=> {
   if(receivedChannel===channel) {
    callback(JSON.parse(message));
   }
    })

}

module.exports = {publishMessage,subscribeMessage};


