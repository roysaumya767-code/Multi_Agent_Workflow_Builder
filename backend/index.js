
const express = require('express');
const cors = require('cors');
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const client = require("./client");
const server = http.createServer(app);
const workRoutes = require("./routes/workflow");
const userRoutes = require("./routes/login");
const socketAuth = require("./socketauth");

const PORT = 1111;
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));
app.use(express.json());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});


app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});
app.use('/user', userRoutes);
app.use('/api', workRoutes);
io.use(socketAuth);
io.on('connection', (socket) => {
     socket.on('joinroom', async(data) => {
        const {userId } = data;
        console.log("socket id",socket.user.id);
       
        
        socket.join(userId);
         
})
});



server.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});