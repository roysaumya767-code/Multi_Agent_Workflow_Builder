const { Worker } = require("bullmq");
console.log("Starting worker...");
const Worker1 = new Worker("workflowqueue",async (job) => {
    console.log("job.id : ",job.id);
    console.log("nodes : ",job.data);

   await  new Promise((res) => setTimeout(() => res(),5*1000));
   console.log("Attempt failing:", new Date().toLocaleString());
   //throw new Error("bullmq retrying");
      

   console.log("job finished");
     return { success: "true"};

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


