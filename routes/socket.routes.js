const userController = require('../controller/user.controller');
const socket = require('socket.io');;

module.exports = (server) => {
    
const io = socket(server);
const activeUsers = new Set();

io.on("connection", function (socket) {

  console.log("Made socket connection");

  socket.on("new user", async(data)=> {
    console.log(data);
    socket.userId = data['id'];
    let getUsers = await userController.activeUsers(data);
    io.emit("new user", getUsers);
    
  });

  socket.on("message_sent",  async(data)=> {

    let addedChat = await userController.addChat(data);
    io.emit("message_sent", addedChat);

  }); 

  socket.on("all_messages", async(data)=>{
    let allMessages = await userController.getMessages(data);
    io.emit("all_messages", allMessages)
  });

  socket.on("typing", function (data) {
    io.emit("typing", data);
  }); 
  socket.on("disconnect", (data) => {
    console.log('socket disconnected', socket.userId);  
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });
});

}
