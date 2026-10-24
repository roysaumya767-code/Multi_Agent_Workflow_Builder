const { Queue } = require("bullmq");


const workflowQueue = new Queue("workflowqueue",{
  connection: {
    host: "127.0.0.1",
    port: 6379,
  }});

async function addToQueque (req,res) {
         
         const sub = req.user.sub;
         console.log(req.user);
    try {
      const {nodes,edges} = req.body.workflow;
      if(!nodes || !edges) {
         return res.json({ success: "false" ,message:"need nodes and edges in data"});
      }
      
     const job = await workflowQueue.add("addWorkflow",{sub,nodes,edges},{attempts:3,
      backoff:{
        type:'exponential',
        delay:1000,

      }
     },{ delay: 5000 });
       console.log("Job added to queue:", job.id);


    
  return res.json({ success: "true",message: "successfully added value in queue" ,jobId:job.id})
    }
    catch (error){
         
               return res.json({ success: "false" ,message:`caught an error ${error}`});
      
    }

}

async function getJobStatus(req,res) {
  const {jobId} = req.params;
   const job = await workflowQueue.getJob(jobId);
   if(!job) return res.json({ success: false})
    const jobStatus = await job.getState();
   return res.json({
      success: true,
      jobStatus,
      jobProgress: job.progress,
      result: job.returnvalue,
    });
}


module.exports = {addToQueque,getJobStatus};