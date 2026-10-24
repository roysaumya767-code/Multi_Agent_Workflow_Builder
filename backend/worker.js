const { Worker } = require("bullmq");
const {publishMessage,subscribeMessage} = require("./pubsub");

const WebSocket = require("ws");
console.log("Starting worker...");
const Worker1 = new Worker("workflowqueue",async (job) => {
    console.log("job.id : ",job.id);
    console.log("nodes : ",job.data);

   await  new Promise((res) => setTimeout(() => res(),5*1000));
      const ws = new WebSocket("ws://127.0.0.1:8000/ws/run")
   await  new Promise((res,rej) =>{
    ws.on("open",res);
    ws.on("error",rej);
   });
      try {
        ws.send(JSON.stringify(job.data));
       const result =  await  new Promise((res,rej) => {
        ws.on("message",async (x) => {
          const message = JSON.parse(x.toString());
                   console.log(message);
            await publishMessage("nodeinfo",{user:job.data.sub,message:message});
                  

       
        if (
  ["completed", "error"].includes(message.status) &&
  !("node_id" in message)
) {
          if(message.status==="error") {
             rej(new Error(message.message || "Workflow failed"));
          }
          else {
            res(message)
          }

        }
         });
       });
       console.log("result", result);
         return { success: "true",result: result};
           

      }
      finally {
         ws.close();
      }
  
    


},{
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  concurrency: 50,
limiter: {
    max: 10,
    duration: 1000,
  },
maxStalledCount:2}
,

);
Worker1.on('stalled',(job,result) => {
    console.log("jobstalled");
})
/*Worker1.on('completed',(job,result) => {
    console.log("job completed",job.id,result);
})
Worker1.on('failed',(job,error) => {
    console.log("job failed",error);
})*/

/*Worker1.on("ready", () => {
  console.log("Worker is ready");
});

Worker1.on("error", (err) => {
  console.log("Worker error:", err.message);
});

Worker1.on("active", (job) => {
  console.log("Job active:", job.id);
});

Worker1.on("completed", (job, result) => {
  console.log("Job completed:", job.id, result);
});

Worker1.on("failed", (job, error) => {
  console.log("Job failed:", job?.id, error.message);
});*/


